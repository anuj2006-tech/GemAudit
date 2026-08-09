import { TenderWorkspaceService } from '../services/tenderWorkspaceService.js';

const buildUserContext = (req) => {
  return {
    token: req.token,
    companyId: req.companyId,
    userId: req.user.id,
    role: req.user.role
  };
};

export const uploadTenderDocument = async (req, res) => {
  const { id } = req.params; // tenderId
  try {
    const context = buildUserContext(req);
    const doc = await TenderWorkspaceService.uploadTenderDocument(id, req.body, context);
    return res.status(201).json(doc);
  } catch (error) {
    console.error('[Tender Workspace Controller] uploadTenderDocument error:', error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const getTenderDocuments = async (req, res) => {
  const { id } = req.params;
  try {
    const context = buildUserContext(req);
    const docs = await TenderWorkspaceService.getTenderDocuments(id, context);
    return res.json(docs);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getTenderDocumentStatus = async (req, res) => {
  const { id, documentId } = req.params;
  try {
    const context = buildUserContext(req);
    const status = await TenderWorkspaceService.getTenderDocumentStatus(id, documentId, context);
    return res.json(status);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteTenderDocument = async (req, res) => {
  const { id, documentId } = req.params;
  try {
    const context = buildUserContext(req);
    await TenderWorkspaceService.deleteTenderDocument(id, documentId, context);
    return res.json({ message: 'Tender document deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const analyzeTenderEligibility = async (req, res) => {
  const { id } = req.params;
  try {
    const context = buildUserContext(req);
    const result = await TenderWorkspaceService.analyzeTenderEligibility(id, context);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getTenderRequirements = async (req, res) => {
  const { id } = req.params;
  try {
    const context = buildUserContext(req);
    const repo = TenderWorkspaceService.getRepo(context.token);
    const requirements = await repo.findRequirements(id, context.companyId);
    return res.json(requirements);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getTenderEligibility = async (req, res) => {
  const { id } = req.params;
  try {
    const context = buildUserContext(req);
    const repo = TenderWorkspaceService.getRepo(context.token);
    const results = await repo.findRequirementResults(id, context.companyId);
    return res.json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getTenderEvidence = async (req, res) => {
  const { id } = req.params;
  try {
    const context = buildUserContext(req);
    const repo = TenderWorkspaceService.getRepo(context.token);
    const results = await repo.findRequirementResults(id, context.companyId);
    // Filter only evidence-carrying items
    const evidence = results.filter(r => r.evidence && r.status !== 'NOT_FOUND');
    return res.json(evidence);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getTenderAnalysis = async (req, res) => {
  const { id } = req.params;
  try {
    const context = buildUserContext(req);
    const repo = TenderWorkspaceService.getRepo(context.token);
    const analysis = await repo.findAnalysisByTender(id, context.companyId);
    if (!analysis) {
      return res.status(404).json({ error: 'No eligibility analysis exists for this tender.' });
    }
    return res.json(analysis);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const overrideRequirementResult = async (req, res) => {
  const { id, requirementId } = req.params; // tenderId, resultId (mapped to result row)
  const { status, reason } = req.body;
  try {
    const context = buildUserContext(req);
    const updated = await TenderWorkspaceService.overrideRequirementResult(id, requirementId, status, reason, context);
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
