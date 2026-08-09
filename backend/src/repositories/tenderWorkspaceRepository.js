/**
 * Repository for Tender Workspace Database Operations
 * Implements defense-in-depth tenant isolation by combining Supabase RLS and explicit company_id filters.
 */
export class TenderWorkspaceRepository {
  constructor(supabaseClient) {
    this.client = supabaseClient;
  }

  // ---------------------------------------------------------
  // Tender Documents Operations
  // ---------------------------------------------------------

  async createDocument(docData) {
    const { data, error } = await this.client
      .from('tender_documents')
      .insert(docData)
      .select()
      .single();

    if (error) throw new Error(`Create tender document error: ${error.message}`);
    return data;
  }

  async findDocumentById(id, companyId) {
    const { data, error } = await this.client
      .from('tender_documents')
      .select('*')
      .eq('id', id)
      .eq('company_id', companyId)
      .maybeSingle();

    if (error) throw new Error(`Fetch tender document error: ${error.message}`);
    return data;
  }

  async findAllDocuments(tenderId, companyId) {
    const { data, error } = await this.client
      .from('tender_documents')
      .select('*')
      .eq('tender_id', tenderId)
      .eq('company_id', companyId)
      .order('created_at', { ascending: true });

    if (error) throw new Error(`Fetch tender documents error: ${error.message}`);
    return data;
  }

  async updateDocument(id, companyId, updateData) {
    const { data, error } = await this.client
      .from('tender_documents')
      .update(updateData)
      .eq('id', id)
      .eq('company_id', companyId)
      .select()
      .single();

    if (error) throw new Error(`Update tender document error: ${error.message}`);
    return data;
  }

  async deleteDocument(id, companyId) {
    const { error } = await this.client
      .from('tender_documents')
      .delete()
      .eq('id', id)
      .eq('company_id', companyId);

    if (error) throw new Error(`Delete tender document error: ${error.message}`);
    return true;
  }

  // ---------------------------------------------------------
  // Tender Requirements Operations
  // ---------------------------------------------------------

  async createRequirement(reqData) {
    const { data, error } = await this.client
      .from('tender_requirements')
      .insert(reqData)
      .select()
      .single();

    if (error) throw new Error(`Create tender requirement error: ${error.message}`);
    return data;
  }

  async findRequirements(tenderId, companyId) {
    const { data, error } = await this.client
      .from('tender_requirements')
      .select('*')
      .eq('tender_id', tenderId)
      .eq('company_id', companyId)
      .order('created_at', { ascending: true });

    if (error) throw new Error(`Fetch tender requirements error: ${error.message}`);
    return data;
  }

  async findRequirementById(id, companyId) {
    const { data, error } = await this.client
      .from('tender_requirements')
      .select('*')
      .eq('id', id)
      .eq('company_id', companyId)
      .maybeSingle();

    if (error) throw new Error(`Fetch requirement error: ${error.message}`);
    return data;
  }

  async deleteRequirementsByTender(tenderId, companyId) {
    const { error } = await this.client
      .from('tender_requirements')
      .delete()
      .eq('tender_id', tenderId)
      .eq('company_id', companyId);

    if (error) throw new Error(`Delete tender requirements error: ${error.message}`);
    return true;
  }

  // ---------------------------------------------------------
  // Tender Analysis Operations
  // ---------------------------------------------------------

  async createAnalysis(analysisData) {
    const { data, error } = await this.client
      .from('tender_analysis')
      .insert(analysisData)
      .select()
      .single();

    if (error) throw new Error(`Create tender analysis error: ${error.message}`);
    return data;
  }

  async findAnalysisByTender(tenderId, companyId) {
    const { data, error } = await this.client
      .from('tender_analysis')
      .select('*')
      .eq('tender_id', tenderId)
      .eq('company_id', companyId)
      .maybeSingle();

    if (error) throw new Error(`Fetch tender analysis error: ${error.message}`);
    return data;
  }

  async updateAnalysis(tenderId, companyId, updateData) {
    const { data, error } = await this.client
      .from('tender_analysis')
      .update(updateData)
      .eq('tender_id', tenderId)
      .eq('company_id', companyId)
      .select()
      .single();

    if (error) throw new Error(`Update tender analysis error: ${error.message}`);
    return data;
  }

  // ---------------------------------------------------------
  // Tender Requirement Results Operations
  // ---------------------------------------------------------

  async createRequirementResult(resultData) {
    const { data, error } = await this.client
      .from('tender_requirement_results')
      .insert(resultData)
      .select()
      .single();

    if (error) throw new Error(`Create requirement result error: ${error.message}`);
    return data;
  }

  async findRequirementResults(tenderId, companyId) {
    const { data, error } = await this.client
      .from('tender_requirement_results')
      .select('*')
      .eq('tender_id', tenderId)
      .eq('company_id', companyId)
      .order('created_at', { ascending: true });

    if (error) throw new Error(`Fetch requirement results error: ${error.message}`);
    return data;
  }

  async findRequirementResultById(id, companyId) {
    const { data, error } = await this.client
      .from('tender_requirement_results')
      .select('*')
      .eq('id', id)
      .eq('company_id', companyId)
      .maybeSingle();

    if (error) throw new Error(`Fetch requirement result error: ${error.message}`);
    return data;
  }

  async updateRequirementResult(id, companyId, updateData) {
    const { data, error } = await this.client
      .from('tender_requirement_results')
      .update(updateData)
      .eq('id', id)
      .eq('company_id', companyId)
      .select()
      .single();

    if (error) throw new Error(`Update requirement result error: ${error.message}`);
    return data;
  }

  async deleteRequirementResultsByTender(tenderId, companyId) {
    const { error } = await this.client
      .from('tender_requirement_results')
      .delete()
      .eq('tender_id', tenderId)
      .eq('company_id', companyId);

    if (error) throw new Error(`Delete requirement results error: ${error.message}`);
    return true;
  }
}
