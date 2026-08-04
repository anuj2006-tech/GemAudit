import { RAGService } from '../ai/ragService.js';

const buildUserContext = (req) => {
  return {
    token: req.token,
    companyId: req.companyId,
    userId: req.user.id,
    role: req.user.role
  };
};

export const ingestDocument = async (req, res) => {
  const { documentId, content } = req.body;

  if (!documentId || !content) {
    return res.status(400).json({ error: 'Document ID and text content are required.' });
  }

  try {
    const context = buildUserContext(req);
    const result = await RAGService.ingestDocument(documentId, content, context);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const queryAI = async (req, res) => {
  const { question, sessionId } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question is required.' });
  }

  try {
    const context = buildUserContext(req);
    const result = await RAGService.queryAI(question, context, sessionId);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getHistory = async (req, res) => {
  const { sessionId } = req.params;

  try {
    const context = buildUserContext(req);
    const result = await RAGService.getChatHistory(sessionId, context);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
