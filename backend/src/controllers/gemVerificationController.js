/**
 * GeM Verification Controller
 */

import { 
  getGeMTenders, 
  getBiddersForTender, 
  runMultiPortalVerification, 
  updateOfficerDecision, 
  getAuditLogs 
} from '../services/gemVerificationService.js';

import { analyzeBidDocumentWithAI } from '../services/gemAiEngine.js';

/**
 * GET /api/gem-verification/tenders
 */
export const fetchTendersController = async (req, res, next) => {
  try {
    const tenders = await getGeMTenders();
    return res.json({ success: true, count: tenders.length, tenders });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/gem-verification/tenders/:tenderId/bidders
 */
export const fetchBiddersController = async (req, res, next) => {
  try {
    const { tenderId } = req.params;
    const bidders = await getBiddersForTender(tenderId);

    // Auto-run multi-portal verification if not yet verified
    for (const bidder of bidders) {
      if (!bidder.latestVerification) {
        await runMultiPortalVerification(bidder.id);
      }
    }

    return res.json({ success: true, count: bidders.length, bidders });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/gem-verification/verify-bidder
 */
export const runVerificationController = async (req, res, next) => {
  try {
    const { bidderId } = req.body;
    if (!bidderId) {
      return res.status(400).json({ error: 'bidderId is required.' });
    }

    const verificationResult = await runMultiPortalVerification(bidderId);
    return res.json({ success: true, verification: verificationResult });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/gem-verification/bidder/:bidderId/decision
 */
export const submitOfficerDecisionController = async (req, res, next) => {
  try {
    const { bidderId } = req.params;
    const { decisionStatus, officerRemarks } = req.body;

    if (!['QUALIFIED', 'DISQUALIFIED', 'CLARIFICATION_SEEKED'].includes(decisionStatus)) {
      return res.status(400).json({ error: 'Invalid decisionStatus provided.' });
    }

    const updatedBidder = await updateOfficerDecision(bidderId, decisionStatus, officerRemarks);
    return res.json({ success: true, bidder: updatedBidder });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/gem-verification/ai-analyze-doc
 */
export const analyzeDocController = async (req, res, next) => {
  try {
    const { documentType, documentText, bidderContext } = req.body;
    const analysis = await analyzeBidDocumentWithAI({ documentType, documentText, bidderContext });
    return res.json({ success: true, analysis });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/gem-verification/audit-logs
 */
export const fetchAuditLogsController = async (req, res, next) => {
  try {
    const logs = await getAuditLogs();
    return res.json({ success: true, logs });
  } catch (err) {
    next(err);
  }
};
