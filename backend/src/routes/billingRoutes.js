import express from 'express';
import * as billingController from '../controllers/billingController.js';
import { requireAuth, requireTenant, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);
router.use(requireTenant);

router.get('/subscription', requireRole(['COMPANY_OWNER', 'ADMIN']), billingController.getSubscription);
router.get('/invoices', requireRole(['COMPANY_OWNER', 'ADMIN']), billingController.getInvoices);
router.post('/upgrade', requireRole(['COMPANY_OWNER']), billingController.updateSubscription);

export default router;
