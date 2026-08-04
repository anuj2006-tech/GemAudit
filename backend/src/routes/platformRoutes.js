import express from 'express';
import * as platformController from '../controllers/platformController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Block anything that is not PLATFORM_ADMIN
router.use(requireAuth);
router.use(requireRole(['PLATFORM_ADMIN']));

router.get('/companies', platformController.getCompanies);
router.get('/admins', platformController.getAdmins);
router.get('/users', platformController.getUsers);
router.get('/audits', platformController.getAudits);
router.get('/plans', platformController.getPlans);

router.post('/companies/:companyId/admins', platformController.createCompanyAdmin);


export default router;

