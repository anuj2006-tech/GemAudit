import { getTenantClient } from '../config/supabase.js';
import { TenderRepository } from '../repositories/tenderRepository.js';
import { logAudit } from '../utils/auditLogger.js';

export class TenderService {
  /**
   * Helper to initialize the repository with tenant client
   */
  static getRepo(token) {
    const tenantClient = getTenantClient(token);
    return new TenderRepository(tenantClient);
  }

  static async getTenders(userContext) {
    const repo = this.getRepo(userContext.token);
    return await repo.findAll(userContext.companyId);
  }

  static async getTenderById(id, userContext) {
    const repo = this.getRepo(userContext.token);
    const tender = await repo.findById(id, userContext.companyId);
    if (!tender) {
      throw new Error('Tender not found or access denied.');
    }
    return tender;
  }

  static async createTender(tenderData, userContext) {
    const repo = this.getRepo(userContext.token);
    
    // Inject company_id and created_by to enforce tenant boundaries
    const cleanData = {
      ...tenderData,
      company_id: userContext.companyId,
      created_by: userContext.userId
    };

    const newTender = await repo.create(cleanData);

    // Audit log
    await logAudit({
      companyId: userContext.companyId,
      userId: userContext.userId,
      action: 'tender_create',
      entityName: 'tenders',
      entityId: newTender.id,
      details: { title: newTender.title }
    });

    return newTender;
  }

  static async updateTender(id, updateData, userContext) {
    const repo = this.getRepo(userContext.token);
    
    // Strip company_id and created_by from client update inputs to prevent tampering
    const { company_id, created_by, ...cleanUpdate } = updateData;
    
    const updatedTender = await repo.update(id, userContext.companyId, cleanUpdate);

    // Audit log
    await logAudit({
      companyId: userContext.companyId,
      userId: userContext.userId,
      action: 'tender_update',
      entityName: 'tenders',
      entityId: id,
      details: { updated_fields: Object.keys(cleanUpdate) }
    });

    return updatedTender;
  }

  static async deleteTender(id, userContext) {
    const repo = this.getRepo(userContext.token);
    await repo.delete(id, userContext.companyId);

    // Audit log
    await logAudit({
      companyId: userContext.companyId,
      userId: userContext.userId,
      action: 'tender_delete',
      entityName: 'tenders',
      entityId: id
    });

    return true;
  }
}
