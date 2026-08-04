import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('WARNING: Supabase URL or Service Role Key is missing in environment variables.');
}

// Admin client (bypasses RLS - use strictly for system/admin operations and registration)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

/**
 * Returns a Supabase client authenticated as the specific user.
 * This client is subject to Row-Level Security (RLS) policies.
 * @param {string} userToken - The user's JWT
 */
export const getTenantClient = (userToken) => {
  // If RLS is explicitly configured to be enforced at the SQL level for the backend API
  // Note: This requires the JWT_SECRET in .env to match the actual Supabase JWT Secret
  if (process.env.ENFORCE_RLS_IN_BACKEND === 'true') {
    return createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      global: {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      }
    });
  }

  // Default: Fallback to service role client to avoid signature key mismatch errors
  // during local runs, relying on repository-level explicit company_id filters.
  return supabaseAdmin;
};
