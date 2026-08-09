import express from 'express';
import * as tenderController from '../controllers/tenderController.js';
import * as tenderWorkspaceController from '../controllers/tenderWorkspaceController.js';
import { requireAuth, requireTenant, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Apply auth and tenant validation to all tender routes
router.use(requireAuth);
router.use(requireTenant);

// Base Tender Metadata Routes
router.get('/', tenderController.getTenders);
router.get('/:id', tenderController.getTenderById);

router.post(
  '/', 
  requireRole(['COMPANY_OWNER', 'ADMIN', 'BID_MANAGER']), 
  tenderController.createTender
);

router.put(
  '/:id', 
  requireRole(['COMPANY_OWNER', 'ADMIN', 'BID_MANAGER']), 
  tenderController.updateTender
);

router.delete(
  '/:id', 
  requireRole(['COMPANY_OWNER', 'ADMIN']), 
  tenderController.deleteTender
);

// 📑 Tender Workspace Routes
router.post(
  '/:id/documents',
  requireRole(['COMPANY_OWNER', 'ADMIN', 'BID_MANAGER']),
  tenderWorkspaceController.uploadTenderDocument
);

router.get('/:id/documents', tenderWorkspaceController.getTenderDocuments);

router.get('/:id/documents/:documentId/status', tenderWorkspaceController.getTenderDocumentStatus);

router.delete(
  '/:id/documents/:documentId',
  requireRole(['COMPANY_OWNER', 'ADMIN', 'BID_MANAGER']),
  tenderWorkspaceController.deleteTenderDocument
);

router.post(
  '/:id/analyze',
  requireRole(['COMPANY_OWNER', 'ADMIN', 'BID_MANAGER']),
  tenderWorkspaceController.analyzeTenderEligibility
);

router.get('/:id/requirements', tenderWorkspaceController.getTenderRequirements);
router.get('/:id/eligibility', tenderWorkspaceController.getTenderEligibility);
router.get('/:id/evidence', tenderWorkspaceController.getTenderEvidence);
router.get('/:id/analysis', tenderWorkspaceController.getTenderAnalysis);

router.post(
  '/:id/requirements/:requirementId/review',
  requireRole(['COMPANY_OWNER', 'ADMIN']),
  tenderWorkspaceController.overrideRequirementResult
);

export default router;
