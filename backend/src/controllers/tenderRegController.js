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
      text: req.body.text || req.body.extracted_text,
      base64: req.body.base64
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

export const chatWithTender = async (req, res) => {
  const { documentId, tenderId, message } = req.body;
  try {
    const result = await TenderRegService.chatWithTender(documentId, tenderId, message);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};



export const generateBidDocument = async (req, res) => {
  try {
    const result = await TenderRegService.generateBidDocument(req.body);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getPriceScheduleTemplate = async (req, res) => {
  const { companyId, documentId, tenderId } = req.body;
  try {
    const result = await TenderRegService.getPriceScheduleTemplate(companyId, documentId, tenderId);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
