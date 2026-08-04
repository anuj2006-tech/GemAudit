import * as authService from '../auth/authService.js';

/**
 * Controller for registering a company and owner.
 */
export const register = async (req, res) => {
  const {
    companyName,
    industry,
    country,
    phone,
    companyEmail,
    ownerName,
    ownerEmail,
    ownerPassword
  } = req.body;

  try {
    const result = await authService.registerCompanyAndOwner({
      companyName,
      industry,
      country,
      phone,
      companyEmail,
      ownerName,
      ownerEmail,
      ownerPassword
    });

    return res.status(201).json({
      message: 'Company and Owner registered successfully.',
      data: result
    });
  } catch (error) {
    console.error('Registration Controller Error:', error.message);
    const statusCode = error.message.includes('already registered') ? 400 : 500;
    return res.status(statusCode).json({ error: error.message });
  }
};

/**
 * Controller for login.
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await authService.loginUser(email, password);
    return res.json(result);
  } catch (error) {
    console.error('Login Controller Error:', error.message);
    const statusCode = error.message.includes('Invalid') ? 401 : 500;
    return res.status(statusCode).json({ error: error.message });
  }
};

/**
 * Controller for logout.
 * Clean, stateless logout (client will clear storage).
 */
export const logout = (req, res) => {
  return res.json({ message: 'Logout successful.' });
};
