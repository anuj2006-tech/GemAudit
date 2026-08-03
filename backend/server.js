import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';
import { requireAuth, requireSuperAdmin } from './middleware.js';
import { createProfile, getProfileById, getAllLegalAdmins } from './models/Profile.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;
const isSupabaseConfigured = supabaseUrl && 
                             supabaseUrl !== 'https://your-project-id.supabase.co' && 
                             supabaseServiceKey && 
                             supabaseServiceKey !== 'your-supabase-service-role-key';

if (isSupabaseConfigured) {
  try {
    // Use service role key to manage users as Admin (bypass RLS)
    supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    console.log('Supabase client initialized successfully.');
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error.message);
  }
} else {
  console.warn('WARNING: Supabase is not fully configured in backend/.env. Supabase operations will fail until configured.');
}

// Secret for signing JWT
const JWT_SECRET = process.env.JWT_SECRET || 'tender_management_secure_jwt_token_secret_998811';

// Unified Login Endpoint
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  // 1. Check if login matches Superadmin credentials in env
  const superadminEmail = process.env.SUPERADMIN_EMAIL || 'superadmin@tender.ai';
  const superadminPassword = process.env.SUPERADMIN_PASSWORD || 'SuperSecurePassword123';

  if (email.toLowerCase() === superadminEmail.toLowerCase() && password === superadminPassword) {
    // Superadmin authenticated successfully
    const token = jwt.sign(
      { email: superadminEmail, role: 'super-admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      token,
      user: {
        email: superadminEmail,
        name: 'Super Admin'
      },
      role: 'super-admin'
    });
  }

  // 2. Otherwise, authenticate via Supabase Auth
  if (!isSupabaseConfigured || !supabase) {
    return res.status(503).json({ 
      error: 'Supabase DB not configured. Please add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to backend/.env file to authenticate Admin users.' 
    });
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      return res.status(401).json({ error: `Authentication failed: ${authError.message}` });
    }

    const userId = authData.user.id;

    // Check role in profiles table
    let profile;
    try {
      profile = await getProfileById(supabase, userId);
    } catch (profileError) {
      return res.status(403).json({ error: 'Access denied: Profile role not found.' });
    }

    if (profile.role !== 'legal-admin') {
      return res.status(403).json({ error: 'Access denied: Invalid user role.' });
    }

    // Admin authenticated successfully
    const token = jwt.sign(
      { id: userId, email: profile.email, role: 'legal-admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      token,
      user: {
        email: profile.email,
        name: profile.name
      },
      role: 'legal-admin'
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error during login.' });
  }
});

// Logout endpoint (stateless backend, client just discards token)
app.post('/api/auth/logout', (req, res) => {
  return res.json({ message: 'Logged out successfully' });
});

// Create Legal Admin (Protected: Only Superadmin can call)
app.post('/api/users/legal-admin', requireSuperAdmin, async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  if (!isSupabaseConfigured || !supabase) {
    return res.status(503).json({ 
      error: 'Supabase is not configured. Configure it in backend/.env to create Admin accounts.' 
    });
  }

  try {
    // 1. Create user in Supabase Auth (using admin auth API, which triggers email_confirm = true)
    const { data: authUser, error: createAuthError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, role: 'legal-admin' }
    });

    if (createAuthError) {
      return res.status(400).json({ error: `Supabase Auth error: ${createAuthError.message}` });
    }

    const userId = authUser.user.id;

    // 2. Insert record in profiles table
    let profile;
    try {
      profile = await createProfile(supabase, {
        id: userId,
        email,
        name,
        role: 'legal-admin'
      });
    } catch (insertProfileError) {
      console.error('Error inserting profile:', insertProfileError.message);
      // Clean up the created auth user if profile insertion failed
      await supabase.auth.admin.deleteUser(userId);
      return res.status(500).json({ error: insertProfileError.message });
    }

    return res.status(201).json({
      message: 'Legal Admin created successfully.',
      user: {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        created_at: profile.created_at
      }
    });

  } catch (error) {
    console.error('Error creating legal admin:', error);
    return res.status(500).json({ error: 'Internal server error while creating admin.' });
  }
});

// Get all Legal Admins (Protected: Superadmin only)
app.get('/api/users/legal-admins', requireSuperAdmin, async (req, res) => {
  if (!isSupabaseConfigured || !supabase) {
    return res.status(503).json({ 
      error: 'Supabase is not configured. Configure it in backend/.env to retrieve Admin accounts.' 
    });
  }

  try {
    const data = await getAllLegalAdmins(supabase);
    return res.json(data);
  } catch (error) {
    console.error('Error fetching legal admins:', error);
    return res.status(500).json({ error: 'Internal server error while fetching admins.' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
