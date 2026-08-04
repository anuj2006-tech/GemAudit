import { supabaseAdmin, getTenantClient } from '../config/supabase.js';
import { logAudit } from '../utils/auditLogger.js';

// Load optional OpenAI API Key from environment
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/**
 * Generate a vector representation of a string.
 * Uses OpenAI embeddings API if configured, otherwise falls back to a deterministic semantic mockup vector.
 * @param {string} text
 */
const getEmbedding = async (text) => {
  if (OPENAI_API_KEY && OPENAI_API_KEY !== 'your-openai-api-key') {
    try {
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'text-embedding-ada-002',
          input: text
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'OpenAI Embedding Error');
      }

      const resJson = await response.json();
      return resJson.data[0].embedding;
    } catch (error) {
      console.error('OpenAI Embeddings call failed, using fallback hash:', error.message);
    }
  }

  // Fallback: Deterministic vector hash generation (1536 float dimensions)
  const embedding = new Array(1536).fill(0);
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  
  // Seed the array based on hash values
  for (let i = 0; i < 1536; i++) {
    embedding[i] = Math.sin(hash + i) * 0.1;
  }
  
  // Normalize vector (Cosine similarity depends on normalized vectors)
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return embedding.map(val => val / magnitude);
};

export class RAGService {
  /**
   * Chunks document content, generates embeddings, and stores them in the database.
   * @param {string} documentId - Target document UUID
   * @param {string} rawContent - Document text content
   * @param {Object} userContext - Context containing token, companyId, and userId
   */
  static async ingestDocument(documentId, rawContent, userContext) {
    const tenantClient = getTenantClient(userContext.token);

    // 1. Check document ownership
    const { data: document, error: docError } = await tenantClient
      .from('documents')
      .select('id')
      .eq('id', documentId)
      .eq('company_id', userContext.companyId)
      .maybeSingle();

    if (docError || !document) {
      throw new Error('Document not found or access denied.');
    }

    // 2. Simple chunking strategy (e.g. 1000 characters with 200 character overlap)
    const chunkSize = 1000;
    const overlap = 200;
    const chunks = [];
    let start = 0;

    while (start < rawContent.length) {
      const end = start + chunkSize;
      chunks.push(rawContent.substring(start, end));
      start += chunkSize - overlap;
    }

    // 3. Generate embeddings and insert into the database
    const insertPayloads = [];
    for (const chunk of chunks) {
      const vector = await getEmbedding(chunk);
      insertPayloads.push({
        company_id: userContext.companyId,
        document_id: documentId,
        chunk_content: chunk,
        embedding: vector,
        created_by: userContext.userId
      });
    }

    const { error: insertError } = await tenantClient
      .from('embeddings')
      .insert(insertPayloads);

    if (insertError) {
      throw new Error(`Failed to ingest document embeddings: ${insertError.message}`);
    }

    // 4. Create Audit Log
    await logAudit({
      companyId: userContext.companyId,
      userId: userContext.userId,
      action: 'document_ingestion',
      entityName: 'documents',
      entityId: documentId,
      details: { chunks_count: chunks.length }
    });

    return { success: true, chunksIngested: chunks.length };
  }

  /**
   * Run a semantic similarity search across tenant documents and answer using context.
   * @param {string} question - User question
   * @param {Object} userContext - Session context
   * @param {string} [sessionId] - Existing chat session ID
   */
  static async queryAI(question, userContext, sessionId = null) {
    const tenantClient = getTenantClient(userContext.token);
    const activeSessionId = sessionId || `session_${Date.now()}`;

    // 1. Generate query embedding
    const queryVector = await getEmbedding(question);

    // 2. Call pgvector similarity search RPC strictly filtered by company_id
    const { data: matchedChunks, error: matchError } = await tenantClient.rpc(
      'match_embeddings',
      {
        query_embedding: queryVector,
        match_threshold: 0.5,
        match_count: 5,
        p_company_id: userContext.companyId
      }
    );

    if (matchError) {
      throw new Error(`Vector similarity query failed: ${matchError.message}`);
    }

    // 3. Construct Context from matched chunks
    const contextText = matchedChunks && matchedChunks.length > 0
      ? matchedChunks.map(c => c.chunk_content).join('\n---\n')
      : 'No matching company document source found.';

    // 4. Generate AI Completion response
    let aiResponseText = '';
    if (OPENAI_API_KEY && OPENAI_API_KEY !== 'your-openai-api-key') {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are an expert AI Bid Evaluation Assistant for Legal Tenders. 
Answer the user's questions based ONLY on the context of their uploaded company documents provided below.
If the answer cannot be found in the context, state that clearly.

--- CONTEXT ---
${contextText}`
              },
              { role: 'user', content: question }
            ],
            temperature: 0.2
          })
        });

        if (response.ok) {
          const resJson = await response.json();
          aiResponseText = resJson.choices[0].message.content;
        } else {
          throw new Error('OpenAI Chat Completion API Error');
        }
      } catch (err) {
        console.error('OpenAI Chat Completion failed, fallback to mock:', err.message);
      }
    }

    // Fallback Mock completion summarizing matched source chunks
    if (!aiResponseText) {
      aiResponseText = `[AI Assistant Response (Preview Mode)]\nBased on your company documents:\n\n` +
        (matchedChunks && matchedChunks.length > 0
          ? matchedChunks.map((c, i) => `[Source ${i+1}]: ${c.chunk_content.substring(0, 150)}...`).join('\n\n')
          : `No documents matched this query. Please upload and ingest your tender documentation files.`);
    }

    // 5. Store conversation history in DB
    await tenantClient.from('chat_history').insert([
      {
        company_id: userContext.companyId,
        user_id: userContext.userId,
        session_id: activeSessionId,
        message_role: 'user',
        message_content: question
      },
      {
        company_id: userContext.companyId,
        user_id: userContext.userId,
        session_id: activeSessionId,
        message_role: 'assistant',
        message_content: aiResponseText
      }
    ]);

    // 6. Log Audit trail
    await logAudit({
      companyId: userContext.companyId,
      userId: userContext.userId,
      action: 'ai_rag_query',
      entityName: 'chat_history',
      entityId: null,
      details: { session_id: activeSessionId, matched_chunks_count: matchedChunks?.length || 0 }
    });

    return {
      sessionId: activeSessionId,
      response: aiResponseText,
      sources: matchedChunks ? matchedChunks.map(c => ({ documentId: c.document_id, similarity: c.similarity })) : []
    };
  }

  /**
   * Retrieves tenant-scoped chat sessions
   */
  static async getChatHistory(sessionId, userContext) {
    const tenantClient = getTenantClient(userContext.token);
    const { data, error } = await tenantClient
      .from('chat_history')
      .select('*')
      .eq('company_id', userContext.companyId)
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to load chat history: ${error.message}`);
    }
    return data;
  }
}
