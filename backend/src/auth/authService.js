import jwt from 'jsonwebtoken';
import { supabaseAdmin } from '../config/supabase.js';
import { hashPassword, verifyPassword } from './passwordService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'tender_management_secure_jwt_token_secret_998811';

/**
 * Registers a new company and its owner in a single database transaction.
 * @param {Object} params
 * @param {string} params.companyName
 * @param {string} params.industry
 * @param {string} params.country
 * @param {string} params.phone
 * @param {string} params.companyEmail
 * @param {string} params.ownerName
 * @param {string} params.ownerEmail
 * @param {string} params.ownerPassword
 */
export const registerCompanyAndOwner = async ({
  companyName,
  industry,
  country,
  phone,
  companyEmail,
  ownerName,
  ownerEmail,
  ownerPassword
}) => {
  if (!companyName || !companyEmail || !ownerName || !ownerEmail || !ownerPassword) {
    throw new Error('Missing required registration fields.');
  }

  // 1. Hash the password using Argon2
  const passwordHash = await hashPassword(ownerPassword);

  // 2. Call the database RPC function to register both in one transaction
  const { data, error } = await supabaseAdmin.rpc('register_company_and_owner', {
    p_company_name: companyName,
    p_industry: industry || null,
    p_country: country || null,
    p_phone: phone || null,
    p_company_email: companyEmail,
    p_owner_name: ownerName,
    p_owner_email: ownerEmail,
    p_password_hash: passwordHash
  });

  if (error) {
    // If it's a known database check/uniqueness exception
    if (error.message.includes('already registered')) {
      throw new Error('Email is already registered.');
    }
    throw new Error(`Registration failed: ${error.message}`);
  }

  return data;
};

/**
 * Log in a user across any tenant company.
 * @param {string} email
 * @param {string} password
 */
export const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }

  // 1. Platform Admin Super Admin override check
  const superadminEmail = process.env.SUPERADMIN_EMAIL || 'superadmin@tender.ai';
  const superadminPassword = process.env.SUPERADMIN_PASSWORD || 'SuperSecurePassword123';

  if (email.toLowerCase() === superadminEmail.toLowerCase() && password === superadminPassword) {
    // Return a PLATFORM_ADMIN session
    const token = jwt.sign(
      {
        id: '00000000-0000-0000-0000-000000000000',
        email: superadminEmail,
        role: 'PLATFORM_ADMIN',
        company_id: null
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      token,
      user: {
        id: '00000000-0000-0000-0000-000000000000',
        email: superadminEmail,
        name: 'Platform Admin'
      },
      role: 'PLATFORM_ADMIN',
      company_id: null
    };
  }

  // 2. Query normal user from public.users with role details
  const { data: user, error: fetchError } = await supabaseAdmin
    .from('users')
    .select(`
      id,
      company_id,
      name,
      email,
      password_hash,
      role_id,
      roles (
        name
      )
    `)
    .eq('email', email.toLowerCase())
    .maybeSingle();

  if (fetchError || !user) {
    throw new Error('Invalid email or password.');
  }

  // 3. Verify Argon2 password hash
  const isMatch = await verifyPassword(user.password_hash, password);
  if (!isMatch) {
    throw new Error('Invalid email or password.');
  }

  // 4. Extract role name
  const roleName = user.roles ? user.roles.name : 'EMPLOYEE';

  // 5. Generate secure tenant-bound JWT
  const token = jwt.sign(
    {
      id: user.id,
      company_id: user.company_id,
      email: user.email,
      role: roleName
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    },
    role: roleName,
    company_id: user.company_id
  };
};
