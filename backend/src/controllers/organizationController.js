import { OrganizationService } from '../services/organizationService.js';

const buildUserContext = (req) => {
  return {
    token: req.token,
    companyId: req.companyId,
    userId: req.user.id,
    role: req.user.role
  };
};

// --- User Actions ---

export const getUsers = async (req, res) => {
  try {
    const context = buildUserContext(req);
    const result = await OrganizationService.getUsers(context);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const context = buildUserContext(req);
    const result = await OrganizationService.createUser(req.body, context);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const context = buildUserContext(req);
    const result = await OrganizationService.updateUser(id, req.body, context);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const context = buildUserContext(req);
    await OrganizationService.deleteUser(id, context);
    return res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// --- Department Actions ---

export const getDepartments = async (req, res) => {
  try {
    const context = buildUserContext(req);
    const result = await OrganizationService.getDepartments(context);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const createDepartment = async (req, res) => {
  try {
    const context = buildUserContext(req);
    const result = await OrganizationService.createDepartment(req.body, context);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteDepartment = async (req, res) => {
  const { id } = req.params;
  try {
    const context = buildUserContext(req);
    await OrganizationService.deleteDepartment(id, context);
    return res.json({ message: 'Department deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// --- Company Settings Actions ---

export const getCompanySettings = async (req, res) => {
  try {
    const context = buildUserContext(req);
    const result = await OrganizationService.getCompanyDetails(context);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateCompanySettings = async (req, res) => {
  try {
    const context = buildUserContext(req);
    const result = await OrganizationService.updateCompanyDetails(req.body, context);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
