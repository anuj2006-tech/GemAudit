/**
 * Repository for Company Brain Document and Fact Database Operations
 * Strictly isolates queries to the tenant company_id.
 */
export class CompanyBrainRepository {
  constructor(supabaseClient) {
    this.client = supabaseClient;
  }

  // ---------------------------------------------------------
  // Document Operations
  // ---------------------------------------------------------

  async findAllDocuments(companyId) {
    const { data, error } = await this.client
      .from('company_brain_documents')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Fetch brain documents error: ${error.message}`);
    return data;
  }

  async findDocumentsByCategory(category, companyId) {
    const { data, error } = await this.client
      .from('company_brain_documents')
      .select('*')
      .eq('company_id', companyId)
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Fetch brain documents by category error: ${error.message}`);
    return data;
  }

  async findDocumentById(id, companyId) {
    const { data, error } = await this.client
      .from('company_brain_documents')
      .select('*')
      .eq('id', id)
      .eq('company_id', companyId)
      .maybeSingle();

    if (error) throw new Error(`Fetch brain document by ID error: ${error.message}`);
    return data;
  }

  async createDocument(docData) {
    const { data, error } = await this.client
      .from('company_brain_documents')
      .insert(docData)
      .select()
      .single();

    if (error) throw new Error(`Create brain document error: ${error.message}`);
    return data;
  }

  async updateDocument(id, companyId, updateData) {
    const { data, error } = await this.client
      .from('company_brain_documents')
      .update(updateData)
      .eq('id', id)
      .eq('company_id', companyId)
      .select()
      .single();

    if (error) throw new Error(`Update brain document error: ${error.message}`);
    return data;
  }

  async deleteDocument(id, companyId) {
    const { error } = await this.client
      .from('company_brain_documents')
      .delete()
      .eq('id', id)
      .eq('company_id', companyId);

    if (error) throw new Error(`Delete brain document error: ${error.message}`);
    return true;
  }

  // ---------------------------------------------------------
  // Fact Operations
  // ---------------------------------------------------------

  async findFactsByCategory(category, companyId) {
    const { data, error } = await this.client
      .from('company_brain_facts')
      .select('*')
      .eq('company_id', companyId)
      .eq('category', category)
      .order('created_at', { ascending: true });

    if (error) throw new Error(`Fetch brain facts by category error: ${error.message}`);
    return data || [];
  }

  async findFactsByDocument(documentId, companyId) {
    const { data, error } = await this.client
      .from('company_brain_facts')
      .select('*')
      .eq('company_id', companyId)
      .eq('document_id', documentId)
      .order('created_at', { ascending: true });

    if (error) throw new Error(`Fetch brain facts by document error: ${error.message}`);
    return data || [];
  }

  async createFact(factData) {
    const { data, error } = await this.client
      .from('company_brain_facts')
      .insert(factData)
      .select()
      .single();

    if (error) throw new Error(`Create brain fact error: ${error.message}`);
    return data;
  }

  async deleteFactsByDocument(documentId, companyId) {
    const { error } = await this.client
      .from('company_brain_facts')
      .delete()
      .eq('company_id', companyId)
      .eq('document_id', documentId);

    if (error) throw new Error(`Delete brain facts error: ${error.message}`);
    return true;
  }
}
