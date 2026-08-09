import api from './api';

/**
 * Frontend Service for Company Brain Operations
 */
export const getCompanyBrainHealth = async () => {
  return await api.get('/api/company-brain/health');
};

export const getCompanyBrainDocuments = async () => {
  return await api.get('/api/company-brain/documents');
};

export const getCompanyBrainCategoryDetails = async (category) => {
  return await api.get(`/api/company-brain/documents/category/${category}`);
};

/**
 * Uploads a document to Company Brain
 * @param {Object} uploadData - { name, category, mimeType, fileSize, base64 }
 */
export const uploadCompanyBrainDocument = async (uploadData) => {
  return await api.post('/api/company-brain/upload', uploadData);
};

export const deleteCompanyBrainDocument = async (id) => {
  return await api.delete(`/api/company-brain/documents/${id}`);
};
