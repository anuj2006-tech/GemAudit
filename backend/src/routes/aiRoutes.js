import express from 'express';
import * as aiController from '../controllers/aiController.js';
import { requireAuth, requireTenant, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);
router.use(requireTenant);

router.post(
  '/ingest', 
  requireRole(['COMPANY_OWNER', 'ADMIN', 'BID_MANAGER']), 
  aiController.ingestDocument
);

router.post(
  '/query', 
  requireRole(['COMPANY_OWNER', 'ADMIN', 'BID_MANAGER', 'PROPOSAL_WRITER', 'REVIEWER']), 
  aiController.queryAI
);

router.get(
  '/history/:sessionId', 
  requireRole(['COMPANY_OWNER', 'ADMIN', 'BID_MANAGER', 'PROPOSAL_WRITER', 'REVIEWER']), 
  aiController.getHistory
);

export default router;
