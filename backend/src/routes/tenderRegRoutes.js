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

// Interactive Tender Analyst Chatbot
router.post('/chat', tenderRegController.chatWithTender);


// Two-Envelope Bid Document Generator
router.post('/generate-document', tenderRegController.generateBidDocument);
router.post('/price-schedule-template', tenderRegController.getPriceScheduleTemplate);

export default router;

