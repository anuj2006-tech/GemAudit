import express from 'express';
import * as documentController from '../controllers/documentController.js';
import { requireAuth, requireTenant, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);
router.use(requireTenant);

router.get('/', documentController.getDocuments);
router.get('/:id', documentController.getDocumentById);
router.get('/:id/versions', documentController.getVersions);

router.post(
  '/', 
  requireRole(['COMPANY_OWNER', 'ADMIN', 'BID_MANAGER', 'PROPOSAL_WRITER']), 
  documentController.registerUpload
);

router.post(
  '/:id/versions', 
  requireRole(['COMPANY_OWNER', 'ADMIN', 'BID_MANAGER', 'PROPOSAL_WRITER']), 
  documentController.addVersion
);

router.delete(
  '/:id', 
  requireRole(['COMPANY_OWNER', 'ADMIN']), 
  documentController.deleteDocument
);

export default router;
