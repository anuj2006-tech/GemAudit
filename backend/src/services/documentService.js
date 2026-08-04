import { getTenantClient } from '../config/supabase.js';
import { DocumentRepository } from '../repositories/documentRepository.js';
import { logAudit } from '../utils/auditLogger.js';

export class DocumentService {
  static getRepo(token) {
    const tenantClient = getTenantClient(token);
    return new DocumentRepository(tenantClient);
  }

  /**
   * Helper to construct safe company isolated storage paths
   */
  static getStoragePath(companyId, type, filename) {
    const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const folder = type || 'documents'; // documents, certificates, tenders, proposals
    return `${companyId}/${folder}/${Date.now()}_${cleanFilename}`;
  }

  static async getDocuments(userContext) {
    const repo = this.getRepo(userContext.token);
    return await repo.findAll(userContext.companyId);
  }

  static async getDocumentsByTender(tenderId, userContext) {
    const repo = this.getRepo(userContext.token);
    return await repo.findByTender(tenderId, userContext.companyId);
  }

  static async getDocumentById(id, userContext) {
    const repo = this.getRepo(userContext.token);
    const doc = await repo.findById(id, userContext.companyId);
    if (!doc) {
      throw new Error('Document not found or access denied.');
    }
    return doc;
  }

  static async registerUploadedDocument(docData, userContext) {
    const repo = this.getRepo(userContext.token);

    // Build unique isolated storage path
    const fileKey = this.getStoragePath(
      userContext.companyId,
      docData.type, // e.g., 'documents', 'certificates', 'tenders', 'proposals'
      docData.name
    );

    const cleanDocData = {
      company_id: userContext.companyId,
      tender_id: docData.tenderId || null,
      name: docData.name,
      file_path: fileKey,
      file_type: docData.fileType || null,
      file_size: docData.fileSize || 0,
      uploaded_by: userContext.userId
    };

    // Create Document entry
    const newDoc = await repo.create(cleanDocData);

    // Create Document Version 1 entry
    await repo.createVersion({
      company_id: userContext.companyId,
      document_id: newDoc.id,
      version_number: 1,
      file_path: fileKey,
      file_size: docData.fileSize || 0,
      updated_by: userContext.userId
    });

    // Audit trail
    await logAudit({
      companyId: userContext.companyId,
      userId: userContext.userId,
      action: 'document_upload',
      entityName: 'documents',
      entityId: newDoc.id,
      details: { name: newDoc.name, file_path: fileKey }
    });

    return newDoc;
  }

  static async createNewVersion(id, versionData, userContext) {
    const repo = this.getRepo(userContext.token);

    // Verify document belongs to tenant
    const doc = await repo.findById(id, userContext.companyId);
    if (!doc) {
      throw new Error('Document not found or access denied.');
    }

    // Get current versions to find next version number
    const versions = await repo.findVersions(id, userContext.companyId);
    const nextVerNum = versions.length > 0 ? versions[0].version_number + 1 : 1;

    const fileKey = this.getStoragePath(
      userContext.companyId,
      versionData.type || 'documents',
      versionData.name
    );

    // Add version
    const newVer = await repo.createVersion({
      company_id: userContext.companyId,
      document_id: id,
      version_number: nextVerNum,
      file_path: fileKey,
      file_size: versionData.fileSize || 0,
      updated_by: userContext.userId
    });

    // Update document table file_path and file_size to point to latest version
    await repo.update(id, userContext.companyId, {
      file_path: fileKey,
      file_size: versionData.fileSize || 0,
      updated_at: new Date().toISOString()
    });

    // Audit log
    await logAudit({
      companyId: userContext.companyId,
      userId: userContext.userId,
      action: 'document_version_create',
      entityName: 'documents',
      entityId: id,
      details: { version: nextVerNum, file_path: fileKey }
    });

    return newVer;
  }

  static async getDocumentVersions(id, userContext) {
    const repo = this.getRepo(userContext.token);
    
    // Verify document belongs to tenant
    const doc = await repo.findById(id, userContext.companyId);
    if (!doc) {
      throw new Error('Document not found or access denied.');
    }

    return await repo.findVersions(id, userContext.companyId);
  }

  static async deleteDocument(id, userContext) {
    const repo = this.getRepo(userContext.token);
    
    // Verify document belongs to tenant
    const doc = await repo.findById(id, userContext.companyId);
    if (!doc) {
      throw new Error('Document not found or access denied.');
    }

    await repo.delete(id, userContext.companyId);

    // Audit log
    await logAudit({
      companyId: userContext.companyId,
      userId: userContext.userId,
      action: 'document_delete',
      entityName: 'documents',
      entityId: id,
      details: { name: doc.name }
    });

    return true;
  }
}
