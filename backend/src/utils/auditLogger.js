import { supabaseAdmin } from '../config/supabase.js';

/**
 * Log an audit trail entry.
 * Runs using the administrative client to ensure log integrity.
 * @param {Object} params
 * @param {string} params.companyId - Tenant company UUID
 * @param {string} params.userId - User UUID
 * @param {string} params.action - Security or business action name
 * @param {string} params.entityName - Targeted table/resource
 * @param {string} params.entityId - ID of the resource
 * @param {Object} params.details - Details payload
 * @param {string} params.ipAddress - Request IP
 */
export const logAudit = async ({
  companyId,
  userId,
  action,
  entityName,
  entityId,
  details = {},
  ipAddress = null
}) => {
  try {
    const cleanUserId = (userId === '99999999-9999-9999-9999-999999999999' || userId === '00000000-0000-0000-0000-000000000000') ? null : userId;
    const { error } = await supabaseAdmin
      .from('audit_logs')
      .insert({
        company_id: companyId,
        user_id: cleanUserId || null,
        action,
        entity_name: entityName,
        entity_id: entityId || null,
        details,
        ip_address: ipAddress
      });

    if (error) {
      console.error('Audit log insertion failed:', error.message);
    }
  } catch (err) {
    console.error('Audit logging execution error:', err);
  }
};
