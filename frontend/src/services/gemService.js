/**
 * GeM Verification Frontend API Service
 */

const API_BASE = '/api/gem-verification';

export const fetchGeMTenders = async () => {
  try {
    const res = await fetch(`${API_BASE}/tenders`);
    if (!res.ok) throw new Error('Failed to fetch GeM tenders');
    const data = await res.json();
    return data.tenders || [];
  } catch (err) {
    console.error('fetchGeMTenders error:', err);
    throw err;
  }
};

export const fetchBiddersForTender = async (tenderId) => {
  try {
    const res = await fetch(`${API_BASE}/tenders/${tenderId}/bidders`);
    if (!res.ok) throw new Error('Failed to fetch bidders');
    const data = await res.json();
    return data.bidders || [];
  } catch (err) {
    console.error('fetchBiddersForTender error:', err);
    throw err;
  }
};

export const triggerBidderVerification = async (bidderId) => {
  try {
    const res = await fetch(`${API_BASE}/verify-bidder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bidderId })
    });
    if (!res.ok) throw new Error('Failed to run verification');
    const data = await res.json();
    return data.verification;
  } catch (err) {
    console.error('triggerBidderVerification error:', err);
    throw err;
  }
};

export const submitOfficerDecision = async (bidderId, decisionStatus, officerRemarks) => {
  try {
    const res = await fetch(`${API_BASE}/bidder/${bidderId}/decision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decisionStatus, officerRemarks })
    });
    if (!res.ok) throw new Error('Failed to submit procurement officer decision');
    const data = await res.json();
    return data.bidder;
  } catch (err) {
    console.error('submitOfficerDecision error:', err);
    throw err;
  }
};

export const analyzeBidDocument = async (documentType, documentText, bidderContext) => {
  try {
    const res = await fetch(`${API_BASE}/ai-analyze-doc`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentType, documentText, bidderContext })
    });
    if (!res.ok) throw new Error('Failed to analyze bid document');
    const data = await res.json();
    return data.analysis;
  } catch (err) {
    console.error('analyzeBidDocument error:', err);
    throw err;
  }
};
