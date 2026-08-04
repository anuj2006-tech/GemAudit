import express from 'express';
import * as orgController from '../controllers/organizationController.js';
import { requireAuth, requireTenant, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);
router.use(requireTenant);

// --- User Management Routes ---
router.get('/users', requireRole(['COMPANY_OWNER', 'ADMIN']), orgController.getUsers);
router.post('/users', requireRole(['COMPANY_OWNER', 'ADMIN']), orgController.createUser);
router.put('/users/:id', requireRole(['COMPANY_OWNER', 'ADMIN']), orgController.updateUser);
router.delete('/users/:id', requireRole(['COMPANY_OWNER']), orgController.deleteUser); // Owner only deletes users

// --- Department Routes ---
router.get('/departments', requireRole(['COMPANY_OWNER', 'ADMIN', 'BID_MANAGER', 'EMPLOYEE']), orgController.getDepartments);
router.post('/departments', requireRole(['COMPANY_OWNER', 'ADMIN']), orgController.createDepartment);
router.delete('/departments/:id', requireRole(['COMPANY_OWNER', 'ADMIN']), orgController.deleteDepartment);

// --- Company Settings Routes ---
router.get('/settings', requireRole(['COMPANY_OWNER', 'ADMIN']), orgController.getCompanySettings);
router.put('/settings', requireRole(['COMPANY_OWNER', 'ADMIN']), orgController.updateCompanySettings);

export default router;
