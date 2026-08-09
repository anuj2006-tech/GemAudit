/**
 * Repository for Document and Document Version Database Operations
 * Strictly isolates queries to the tenant company_id.
 */
export class DocumentRepository {
  constructor(supabaseClient) {
    this.client = supabaseClient;
  }

  async findAll(companyId) {
    const { data, error } = await this.client
      .from('documents')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Fetch documents error: ${error.message}`);
    return data;
  }

  async findByTender(tenderId, companyId) {
    const { data, error } = await this.client
      .from('documents')
      .select('*')
      .eq('company_id', companyId)
      .eq('tender_id', tenderId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Fetch documents by tender error: ${error.message}`);
    return data;
  }

  async findById(id, companyId) {
    const { data, error } = await this.client
      .from('documents')
      .select('*')
      .eq('id', id)
      .eq('company_id', companyId)
      .maybeSingle();

    if (error) throw new Error(`Fetch document by ID error: ${error.message}`);
    return data;
  }

  async create(docData) {
    const { data, error } = await this.client
      .from('documents')
      .insert(docData)
      .select()
      .single();

    if (error) throw new Error(`Create document error: ${error.message}`);
    return data;
  }

  async update(id, companyId, updateData) {
    const { data, error } = await this.client
      .from('documents')
      .update(updateData)
      .eq('id', id)
      .eq('company_id', companyId)
      .select()
      .single();

    if (error) throw new Error(`Update document error: ${error.message}`);
    return data;
  }

  async delete(id, companyId) {
    const { error } = await this.client
      .from('documents')
      .delete()
      .eq('id', id)
      .eq('company_id', companyId);

    if (error) throw new Error(`Delete document error: ${error.message}`);
    return true;
  }

  async createVersion(versionData) {
    const { data, error } = await this.client
      .from('document_versions')
      .insert(versionData)
      .select()
      .single();

    if (error) throw new Error(`Create document version error: ${error.message}`);
    return data;
  }

  async findVersions(documentId, companyId) {
    const { data, error } = await this.client
      .from('document_versions')
      .select('*')
      .eq('document_id', documentId)
      .eq('company_id', companyId)
      .order('version_number', { ascending: false });

    if (error) throw new Error(`Fetch document versions error: ${error.message}`);
    return data;
  }

  async getStatus(id, companyId) {
    const doc = await this.findById(id, companyId);
    if (!doc) throw new Error('Document not found or access denied.');

    return {
      id: doc.id,
      filename: doc.name,
      processing_status: doc.processing_status || 'queued',
      indexing_status: doc.indexing_status || 'pending',
      structured_data: doc.structured_data || {},
      error_message: doc.error_message || null
    };
  }
}
