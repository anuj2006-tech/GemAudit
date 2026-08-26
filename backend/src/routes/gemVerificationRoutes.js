/**
 * GeM Verification Routes
 */

import express from 'express';
import { 
  fetchTendersController, 
  fetchBiddersController, 
  runVerificationController, 
  submitOfficerDecisionController, 
  analyzeDocController, 
  fetchAuditLogsController 
} from '../controllers/gemVerificationController.js';

const router = express.Router();

router.get('/tenders', fetchTendersController);
router.get('/tenders/:tenderId/bidders', fetchBiddersController);
router.post('/verify-bidder', runVerificationController);
router.post('/bidder/:bidderId/decision', submitOfficerDecisionController);
router.post('/ai-analyze-doc', analyzeDocController);
router.get('/audit-logs', fetchAuditLogsController);

export default router;
