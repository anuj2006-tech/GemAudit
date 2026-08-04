import api from './api';
import axios from 'axios';

// Get documents metadata
export const getDocuments = async () => {
  return api.get('/api/documents');
};

export const getDocumentById = async (id) => {
  return api.get(`/api/documents/${id}`);
};

export const getDocumentVersions = async (id) => {
  return api.get(`/api/documents/${id}/versions`);
};

export const deleteDocument = async (id) => {
  return api.delete(`/api/documents/${id}`);
};

/**
 * Handle document upload directly to Supabase Storage and register metadata in Express
 * @param {File} file - Browser file object
 * @param {string} type - Folder category ('documents', 'certificates', 'tenders', 'proposals')
 * @param {string} [tenderId] - Optional associated tender UUID
 */
export const uploadFile = async (file, type, tenderId = null) => {
  const token = localStorage.getItem('auth_token');
  if (!token) throw new Error('Authentication required.');

  // 1. Register intent with backend to obtain assigned file path and upload params
  const registerRes = await api.post('/api/documents', {
    name: file.name,
    type,
    fileType: file.type,
    fileSize: file.size,
    tenderId
  });

  const docMetadata = registerRes.data;
  const assignedPath = docMetadata.file_path; // e.g., 'company-id/documents/timestamp_file.pdf'

  // 2. Fetch Supabase storage URL from env or dynamic backend config
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jbbktvczaejswwzxboug.supabase.co';
  const bucketName = 'legal-tenders';

  // 3. Upload file directly to Supabase Storage REST API using the user's JWT
  const uploadUrl = `${supabaseUrl}/storage/v1/object/${bucketName}/${assignedPath}`;

  await axios.post(uploadUrl, file, {
    headers: {
      'Content-Type': file.type,
      Authorization: `Bearer ${token}`
    }
  });

  // 4. Trigger AI ingestion in the background if it's a text-based document
  if (file.name.endsWith('.txt') || file.name.endsWith('.pdf') || file.name.endsWith('.docx') || file.name.endsWith('.json')) {
    try {
      // In a real application, the backend extracts text and ingests it.
      // We send a request to start text extraction and RAG ingestion.
      await api.post('/api/ai/ingest', {
        documentId: docMetadata.id,
        content: `Document Content: ${file.name}\nSize: ${file.size} bytes.\nUploaded file content preview placeholder.`
      });
    } catch (aiErr) {
      console.error('Auto RAG ingestion failed:', aiErr.message);
    }
  }

  return docMetadata;
};
