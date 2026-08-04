import { BillingService } from '../services/billingService.js';

const buildUserContext = (req) => {
  return {
    token: req.token,
    companyId: req.companyId,
    userId: req.user.id,
    role: req.user.role
  };
};

export const getSubscription = async (req, res) => {
  try {
    const context = buildUserContext(req);
    const data = await BillingService.getSubscription(context);
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getInvoices = async (req, res) => {
  try {
    const context = buildUserContext(req);
    const data = await BillingService.getBillingHistory(context);
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateSubscription = async (req, res) => {
  const { planName } = req.body;
  if (!planName) {
    return res.status(400).json({ error: 'Plan name is required.' });
  }

  try {
    const context = buildUserContext(req);
    const result = await BillingService.updateSubscription(planName, context);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
