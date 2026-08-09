import { CompanyBrainService } from '../services/companyBrainService.js';

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
    const data = await CompanyBrainService.getDocuments(context);
    return res.json(data);
  } catch (error) {
    console.error('[Company Brain Controller] getDocuments error:', error.message);
    return res.status(500).json({ error: 'Failed to retrieve company brain documents.' });
  }
};

export const getCategoryDetails = async (req, res) => {
  const { category } = req.params;
  const validCategories = ['company_profile', 'financial', 'experience', 'certification', 'technical'];
  
  if (!validCategories.includes(category)) {
    return res.status(400).json({ error: `Invalid category: ${category}` });
  }

  try {
    const context = buildUserContext(req);
    const data = await CompanyBrainService.getCategoryDetails(category, context);
    return res.json(data);
  } catch (error) {
    console.error('[Company Brain Controller] getCategoryDetails error:', error.message);
    return res.status(500).json({ error: 'Failed to retrieve category capability details.' });
  }
};

export const getHealth = async (req, res) => {
  try {
    const context = buildUserContext(req);
    const data = await CompanyBrainService.getHealth(context);
    return res.json(data);
  } catch (error) {
    console.error('[Company Brain Controller] getHealth error:', error.message);
    return res.status(500).json({ error: 'Failed to calculate company brain health.' });
  }
};

export const uploadDocument = async (req, res) => {
  const { name, category, mimeType, fileSize, base64 } = req.body;
  
  if (!name || !category || !mimeType || !fileSize || !base64) {
    return res.status(400).json({ error: 'Missing required upload parameters (name, category, mimeType, fileSize, base64).' });
  }

  const validCategories = ['company_profile', 'financial', 'experience', 'certification', 'technical'];
  if (!validCategories.includes(category)) {
    return res.status(400).json({ error: `Invalid category: ${category}` });
  }

  try {
    const context = buildUserContext(req);
    const data = await CompanyBrainService.uploadDocument(req.body, context);
    return res.status(201).json(data);
  } catch (error) {
    console.error('[Company Brain Controller] uploadDocument error:', error.message);
    return res.status(500).json({ error: `Failed to initiate company brain document upload and analysis: ${error.message}` });
  }
};

export const deleteDocument = async (req, res) => {
  const { id } = req.params;
  
  try {
    const context = buildUserContext(req);
    await CompanyBrainService.deleteDocument(id, context);
    return res.json({ message: 'Document and associated capability facts deleted successfully.' });
  } catch (error) {
    console.error('[Company Brain Controller] deleteDocument error:', error.message);
    return res.status(500).json({ error: 'Failed to delete company brain document.' });
  }
};
