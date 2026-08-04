import { PlatformService } from '../services/platformService.js';

export const getCompanies = async (req, res) => {
  try {
    const data = await PlatformService.getCompanies();
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAudits = async (req, res) => {
  try {
    const data = await PlatformService.getPlatformAudits();
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getPlans = async (req, res) => {
  try {
    const data = await PlatformService.getPlans();
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAdmins = async (req, res) => {
  try {
    const data = await PlatformService.getCompanyAdmins();
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const data = await PlatformService.getCompanyUsers();
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};



export const createCompanyAdmin = async (req, res) => {
  const { companyId } = req.params;
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  try {
    const data = await PlatformService.createCompanyAdmin(companyId, { name, email, password });
    return res.status(201).json({
      message: 'Company Admin created successfully.',
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        created_at: data.created_at
      }
    });
  } catch (error) {
    const statusCode = error.message.includes('not found') ? 404 : 400;
    return res.status(statusCode).json({ error: error.message });
  }
};

