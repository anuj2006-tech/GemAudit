import express from 'express';
import * as tenderController from '../controllers/tenderController.js';
import { requireAuth, requireTenant, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Apply auth and tenant validation to all tender routes
router.use(requireAuth);
router.use(requireTenant);

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

export default router;
