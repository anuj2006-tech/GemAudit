import express from 'express';
import * as tenderRegController from '../controllers/tenderRegController.js';

const router = express.Router();

// Seeded Tenders
router.get('/tenders', tenderRegController.getTenders);
router.post('/tenders', tenderRegController.createTender);

// Company & Document Flow
router.post('/companies', tenderRegController.createCompany);
router.post('/companies/:companyId/documents', tenderRegController.uploadDocument);
router.post('/companies/:companyId/documents/:documentId/match', tenderRegController.matchDocumentToTenders);

export default router;
