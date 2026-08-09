import { TenderRegService } from '../services/tenderRegService.js';

export const getTenders = (req, res) => {
  try {
    const tenders = TenderRegService.getTenders();
    return res.json(tenders);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const createTender = (req, res) => {
  try {
    const tender = TenderRegService.createTender(req.body);
    return res.status(201).json(tender);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const createCompany = (req, res) => {
  try {
    const company = TenderRegService.createCompany(req.body);
    return res.status(201).json(company);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const uploadDocument = async (req, res) => {
  const { companyId } = req.params;
  try {
    const docData = {
      filename: req.body.filename || req.file?.originalname || 'Company_Certificate.pdf',
      text: req.body.text || req.body.extracted_text
    };
    const document = await TenderRegService.uploadDocument(companyId, docData);
    return res.status(201).json(document);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const matchDocumentToTenders = async (req, res) => {
  const { companyId, documentId } = req.params;
  try {
    const result = await TenderRegService.matchDocumentToTenders(companyId, documentId);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
