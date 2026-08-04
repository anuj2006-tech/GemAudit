/**
 * Repository for Tender Database Operations
 * Implements defense-in-depth tenant isolation by combining RLS and explicit company_id filters.
 */
export class TenderRepository {
  constructor(supabaseClient) {
    this.client = supabaseClient;
  }

  async findAll(companyId) {
    const { data, error } = await this.client
      .from('tenders')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Fetch tenders error: ${error.message}`);
    return data;
  }

  async findById(id, companyId) {
    const { data, error } = await this.client
      .from('tenders')
      .select('*')
      .eq('id', id)
      .eq('company_id', companyId)
      .maybeSingle();

    if (error) throw new Error(`Fetch tender by ID error: ${error.message}`);
    return data;
  }

  async create(tenderData) {
    const { data, error } = await this.client
      .from('tenders')
      .insert(tenderData)
      .select()
      .single();

    if (error) throw new Error(`Create tender error: ${error.message}`);
    return data;
  }

  async update(id, companyId, updateData) {
    const { data, error } = await this.client
      .from('tenders')
      .update(updateData)
      .eq('id', id)
      .eq('company_id', companyId)
      .select()
      .single();

    if (error) throw new Error(`Update tender error: ${error.message}`);
    return data;
  }

  async delete(id, companyId) {
    const { error } = await this.client
      .from('tenders')
      .delete()
      .eq('id', id)
      .eq('company_id', companyId);

    if (error) throw new Error(`Delete tender error: ${error.message}`);
    return true;
  }
}
