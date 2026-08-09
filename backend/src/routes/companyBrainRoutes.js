import express from 'express';
import * as companyBrainController from '../controllers/companyBrainController.js';
import { requireAuth, requireTenant, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Enforce strict multi-tenant access control and roles constraints
router.use(requireAuth);
router.use(requireTenant);
router.use(requireRole(['PLATFORM_ADMIN', 'COMPANY_OWNER', 'ADMIN', 'COMPANY_ADMIN']));

// Define Company Brain endpoints
router.get('/health', companyBrainController.getHealth);
router.get('/documents', companyBrainController.getDocuments);
router.get('/documents/category/:category', companyBrainController.getCategoryDetails);
router.post('/upload', companyBrainController.uploadDocument);
router.delete('/documents/:id', companyBrainController.deleteDocument);

export default router;
