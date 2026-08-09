import api from './api';

export const getTenders = async () => {
  return api.get('/api/tenders');
};

export const getTenderById = async (id) => {
  return api.get(`/api/tenders/${id}`);
};

export const createTender = async (payload) => {
  return api.post('/api/tenders', payload);
};

export const updateTender = async (id, payload) => {
  return api.put(`/api/tenders/${id}`, payload);
};

export const deleteTender = async (id) => {
  return api.delete(`/api/tenders/${id}`);
};

// 📑 Tender Workspace Integrations
export const uploadTenderDocument = async (tenderId, payload) => {
  return api.post(`/api/tenders/${tenderId}/documents`, payload);
};

export const getTenderDocuments = async (tenderId) => {
  return api.get(`/api/tenders/${tenderId}/documents`);
};

export const getTenderDocumentStatus = async (tenderId, documentId) => {
  return api.get(`/api/tenders/${tenderId}/documents/${documentId}/status`);
};

export const deleteTenderDocument = async (tenderId, documentId) => {
  return api.delete(`/api/tenders/${tenderId}/documents/${documentId}`);
};

export const analyzeTenderEligibility = async (tenderId) => {
  return api.post(`/api/tenders/${tenderId}/analyze`);
};

export const getTenderRequirements = async (tenderId) => {
  return api.get(`/api/tenders/${tenderId}/requirements`);
};

export const getTenderEligibility = async (tenderId) => {
  return api.get(`/api/tenders/${tenderId}/eligibility`);
};

export const getTenderEvidence = async (tenderId) => {
  return api.get(`/api/tenders/${tenderId}/evidence`);
};

export const getTenderAnalysis = async (tenderId) => {
  return api.get(`/api/tenders/${tenderId}/analysis`);
};

export const overrideRequirementResult = async (tenderId, requirementId, payload) => {
  return api.post(`/api/tenders/${tenderId}/requirements/${requirementId}/review`, payload);
};
