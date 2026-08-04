import { DocumentService } from '../services/documentService.js';

const buildUserContext = (req) => {
  return {
    token: req.token,
    companyId: req.companyId,
    userId: req.user.id,
    role: req.user.role
  };
};

export const getDocuments = async (req, res) => {
  try {
    const context = buildUserContext(req);
    const data = await DocumentService.getDocuments(context);
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getDocumentById = async (req, res) => {
  const { id } = req.params;
  try {
    const context = buildUserContext(req);
    const data = await DocumentService.getDocumentById(id, context);
    return res.json(data);
  } catch (error) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    return res.status(statusCode).json({ error: error.message });
  }
};

export const registerUpload = async (req, res) => {
  try {
    const context = buildUserContext(req);
    const data = await DocumentService.registerUploadedDocument(req.body, context);
    return res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const addVersion = async (req, res) => {
  const { id } = req.params;
  try {
    const context = buildUserContext(req);
    const data = await DocumentService.createNewVersion(id, req.body, context);
    return res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getVersions = async (req, res) => {
  const { id } = req.params;
  try {
    const context = buildUserContext(req);
    const data = await DocumentService.getDocumentVersions(id, context);
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteDocument = async (req, res) => {
  const { id } = req.params;
  try {
    const context = buildUserContext(req);
    await DocumentService.deleteDocument(id, context);
    return res.json({ message: 'Document deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
