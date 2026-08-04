import { supabaseAdmin } from '../config/supabase.js';
import { hashPassword } from '../auth/passwordService.js';
import { logAudit } from '../utils/auditLogger.js';

export class PlatformService {
  static async getCompanies() {
    const { data, error } = await supabaseAdmin
      .from('companies')
      .select(`
        *,
        plans (
          name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Fetch platform companies error: ${error.message}`);
    return data;
  }

  static async getPlatformAudits() {
    const { data, error } = await supabaseAdmin
      .from('audit_logs')
      .select(`
        *,
        companies (
          name
        ),
        users (
          name,
          email
        )
      `)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw new Error(`Fetch platform audit logs error: ${error.message}`);
    return data;
  }

  static async getPlans() {
    const { data, error } = await supabaseAdmin
      .from('plans')
      .select('*')
      .order('price', { ascending: true });

    if (error) throw new Error(`Fetch plans error: ${error.message}`);
    return data;
  }

  static async getCompanyAdmins() {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select(`
        id,
        name,
        email,
        created_at,
        company_id,
        companies (
          name
        ),
        roles!inner (
          name
        )
      `)
      .eq('roles.name', 'ADMIN')
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Fetch platform admins error: ${error.message}`);
    return data;
  }

  static async getCompanyUsers() {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select(`
        id,
        name,
        email,
        created_at,
        company_id,
        companies (
          name
        ),
        roles (
          name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Fetch platform users error: ${error.message}`);
    return data;
  }


  static async createCompanyAdmin(companyId, { name, email, password }) {

    // 1. Verify company exists
    const { data: company, error: compErr } = await supabaseAdmin
      .from('companies')
      .select('id, name')
      .eq('id', companyId)
      .maybeSingle();

    if (compErr || !company) {
      throw new Error('Target company not found.');
    }

    // 2. Hash password using Argon2
    const passHash = await hashPassword(password);

    // 3. Resolve global ADMIN role
    const { data: role, error: roleErr } = await supabaseAdmin
      .from('roles')
      .select('id')
      .eq('name', 'ADMIN')
      .is('company_id', null)
      .maybeSingle();

    if (roleErr || !role) {
      throw new Error('Global ADMIN role is not seeded.');
    }

    // 4. Create User
    const { data: newUser, error: insertError } = await supabaseAdmin
      .from('users')
      .insert({
        company_id: companyId,
        name,
        email: email.toLowerCase(),
        password_hash: passHash,
        role_id: role.id
      })
      .select()
      .single();

    if (insertError) {
      if (insertError.message.includes('unique')) {
        throw new Error('Email is already registered.');
      }
      throw new Error(`Failed to create company admin: ${insertError.message}`);
    }

    // 5. Log audit trail
    await logAudit({
      companyId,
      userId: null,
      action: 'platform_admin_create_company_admin',
      entityName: 'users',
      entityId: newUser.id,
      details: { email: newUser.email, company_name: company.name }
    });

    return newUser;
  }
}

