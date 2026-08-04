import { getTenantClient, supabaseAdmin } from '../config/supabase.js';
import { hashPassword } from '../auth/passwordService.js';
import { logAudit } from '../utils/auditLogger.js';

export class OrganizationService {
  // ---------------------------------------------------------
  // User Management Operations
  // ---------------------------------------------------------

  static async getUsers(userContext) {
    const tenantClient = getTenantClient(userContext.token);
    const { data, error } = await tenantClient
      .from('users')
      .select(`
        id,
        name,
        email,
        created_at,
        role_id,
        department_id,
        roles (
          id,
          name,
          description
        ),
        departments (
          id,
          name
        )
      `)
      .eq('company_id', userContext.companyId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Fetch company users error: ${error.message}`);
    return data;
  }

  static async createUser(userData, userContext) {
    const tenantClient = getTenantClient(userContext.token);

    // Security check: Prevent standard ADMINs from elevating privileges
    if (userContext.role === 'ADMIN') {
      if (['PLATFORM_ADMIN', 'COMPANY_OWNER', 'ADMIN'].includes(userData.roleName)) {
        throw new Error('Unauthorized. Company Admins cannot provision administrator or owner accounts.');
      }
    }

    // 1. Hash the password using Argon2
    const passHash = await hashPassword(userData.password || 'TemporaryPassword123!');


    // 2. Resolve Role ID (Verify role is either global or company-specific)
    const { data: role, error: roleErr } = await tenantClient
      .from('roles')
      .select('id, name')
      .eq('name', userData.roleName)
      .maybeSingle();

    if (roleErr || !role) {
      throw new Error(`Role '${userData.roleName}' is not defined.`);
    }

    // 3. Create user record
    const { data: newUser, error: insertError } = await tenantClient
      .from('users')
      .insert({
        company_id: userContext.companyId,
        name: userData.name,
        email: userData.email.toLowerCase(),
        password_hash: passHash,
        role_id: role.id,
        department_id: userData.departmentId || null
      })
      .select()
      .single();

    if (insertError) {
      if (insertError.message.includes('unique')) {
        throw new Error('Email is already registered inside this platform.');
      }
      throw new Error(`Failed to create company user: ${insertError.message}`);
    }

    // 4. Log Audit Trail
    await logAudit({
      companyId: userContext.companyId,
      userId: userContext.userId,
      action: 'user_create',
      entityName: 'users',
      entityId: newUser.id,
      details: { email: newUser.email, role: role.name }
    });

    return newUser;
  }

  static async updateUser(id, updateData, userContext) {
    const tenantClient = getTenantClient(userContext.token);

    // Filter incoming updates to prevent company_id or password tampering
    const { company_id, password_hash, ...allowedUpdates } = updateData;

    if (updateData.roleName) {
      const { data: role } = await tenantClient
        .from('roles')
        .select('id')
        .eq('name', updateData.roleName)
        .maybeSingle();
      if (role) {
        allowedUpdates.role_id = role.id;
      }
    }

    const { data: updatedUser, error: updateError } = await tenantClient
      .from('users')
      .update(allowedUpdates)
      .eq('id', id)
      .eq('company_id', userContext.companyId)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Failed to update company user: ${updateError.message}`);
    }

    // Audit Trail
    await logAudit({
      companyId: userContext.companyId,
      userId: userContext.userId,
      action: 'user_update',
      entityName: 'users',
      entityId: id,
      details: { updated_fields: Object.keys(allowedUpdates) }
    });

    return updatedUser;
  }

  static async deleteUser(id, userContext) {
    const tenantClient = getTenantClient(userContext.token);

    // Prevent owners from deleting themselves
    if (id === userContext.userId) {
      throw new Error('You cannot delete your own account.');
    }

    const { error: deleteError } = await tenantClient
      .from('users')
      .delete()
      .eq('id', id)
      .eq('company_id', userContext.companyId);

    if (deleteError) {
      throw new Error(`Failed to delete company user: ${deleteError.message}`);
    }

    // Audit Trail
    await logAudit({
      companyId: userContext.companyId,
      userId: userContext.userId,
      action: 'user_delete',
      entityName: 'users',
      entityId: id
    });

    return true;
  }

  // ---------------------------------------------------------
  // Department Management Operations
  // ---------------------------------------------------------

  static async getDepartments(userContext) {
    const tenantClient = getTenantClient(userContext.token);
    const { data, error } = await tenantClient
      .from('departments')
      .select('*')
      .eq('company_id', userContext.companyId)
      .order('name', { ascending: true });

    if (error) throw new Error(`Fetch departments error: ${error.message}`);
    return data;
  }

  static async createDepartment(depData, userContext) {
    const tenantClient = getTenantClient(userContext.token);
    const { data, error } = await tenantClient
      .from('departments')
      .insert({
        company_id: userContext.companyId,
        name: depData.name,
        description: depData.description || null
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create department: ${error.message}`);
    }

    // Audit log
    await logAudit({
      companyId: userContext.companyId,
      userId: userContext.userId,
      action: 'department_create',
      entityName: 'departments',
      entityId: data.id,
      details: { name: data.name }
    });

    return data;
  }

  static async deleteDepartment(id, userContext) {
    const tenantClient = getTenantClient(userContext.token);
    const { error } = await tenantClient
      .from('departments')
      .delete()
      .eq('id', id)
      .eq('company_id', userContext.companyId);

    if (error) throw new Error(`Failed to delete department: ${error.message}`);

    // Audit log
    await logAudit({
      companyId: userContext.companyId,
      userId: userContext.userId,
      action: 'department_delete',
      entityName: 'departments',
      entityId: id
    });

    return true;
  }

  // ---------------------------------------------------------
  // Company Profile/Settings Operations
  // ---------------------------------------------------------

  static async getCompanyDetails(userContext) {
    const tenantClient = getTenantClient(userContext.token);
    const { data, error } = await tenantClient
      .from('companies')
      .select(`
        *,
        plans (
          name,
          price,
          limits
        )
      `)
      .eq('id', userContext.companyId)
      .single();

    if (error) throw new Error(`Fetch company profile error: ${error.message}`);
    return data;
  }

  static async updateCompanyDetails(updateData, userContext) {
    const tenantClient = getTenantClient(userContext.token);
    
    // Strip critical billing plan references to prevent manual subscription overrides
    const { plan_id, id, ...allowedUpdates } = updateData;

    const { data, error } = await tenantClient
      .from('companies')
      .update(allowedUpdates)
      .eq('id', userContext.companyId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update company settings: ${error.message}`);

    // Audit log
    await logAudit({
      companyId: userContext.companyId,
      userId: userContext.userId,
      action: 'company_settings_update',
      entityName: 'companies',
      entityId: userContext.companyId,
      details: { updated_fields: Object.keys(allowedUpdates) }
    });

    return data;
  }
}
