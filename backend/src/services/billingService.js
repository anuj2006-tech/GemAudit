import { getTenantClient, supabaseAdmin } from '../config/supabase.js';
import { logAudit } from '../utils/auditLogger.js';

export class BillingService {
  static async getSubscription(userContext) {
    const tenantClient = getTenantClient(userContext.token);
    const { data, error } = await tenantClient
      .from('subscriptions')
      .select(`
        *,
        plans (
          name,
          price,
          limits
        )
      `)
      .eq('company_id', userContext.companyId)
      .maybeSingle();

    if (error) throw new Error(`Fetch subscription error: ${error.message}`);
    return data;
  }

  static async getBillingHistory(userContext) {
    const tenantClient = getTenantClient(userContext.token);
    const { data, error } = await tenantClient
      .from('billing')
      .select('*')
      .eq('company_id', userContext.companyId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Fetch billing invoices error: ${error.message}`);
    return data;
  }

  static async updateSubscription(planName, userContext) {
    const tenantClient = getTenantClient(userContext.token);

    // 1. Resolve Target Plan ID (Global plans)
    const { data: plan, error: planErr } = await supabaseAdmin
      .from('plans')
      .select('id, name')
      .eq('name', planName)
      .single();

    if (planErr || !plan) {
      throw new Error(`Plan '${planName}' is not active.`);
    }

    // 2. Update company table plan_id
    const { error: companyErr } = await tenantClient
      .from('companies')
      .update({ plan_id: plan.id })
      .eq('id', userContext.companyId);

    if (companyErr) {
      throw new Error(`Failed to update company plan: ${companyErr.message}`);
    }

    // 3. Update subscription record
    const { data: sub, error: subErr } = await tenantClient
      .from('subscriptions')
      .update({
        plan_id: plan.id,
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 Days
        updated_at: new Date().toISOString()
      })
      .eq('company_id', userContext.companyId)
      .select()
      .single();

    if (subErr) {
      throw new Error(`Failed to update subscription record: ${subErr.message}`);
    }

    // 4. Log Audit log
    await logAudit({
      companyId: userContext.companyId,
      userId: userContext.userId,
      action: 'subscription_upgrade',
      entityName: 'subscriptions',
      entityId: sub.id,
      details: { new_plan: planName }
    });

    return sub;
  }
}
