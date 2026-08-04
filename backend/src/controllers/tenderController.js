import { TenderService } from '../services/tenderService.js';

const buildUserContext = (req) => {
  return {
    token: req.token,
    companyId: req.companyId,
    userId: req.user.id,
    role: req.user.role
  };
};

export const getTenders = async (req, res) => {
  try {
    const context = buildUserContext(req);
    const data = await TenderService.getTenders(context);
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getTenderById = async (req, res) => {
  const { id } = req.params;
  try {
    const context = buildUserContext(req);
    const data = await TenderService.getTenderById(id, context);
    return res.json(data);
  } catch (error) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    return res.status(statusCode).json({ error: error.message });
  }
};

export const createTender = async (req, res) => {
  try {
    const context = buildUserContext(req);
    const data = await TenderService.createTender(req.body, context);
    return res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateTender = async (req, res) => {
  const { id } = req.params;
  try {
    const context = buildUserContext(req);
    const data = await TenderService.updateTender(id, req.body, context);
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteTender = async (req, res) => {
  const { id } = req.params;
  try {
    const context = buildUserContext(req);
    await TenderService.deleteTender(id, context);
    return res.json({ message: 'Tender deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
