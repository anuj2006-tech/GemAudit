/**
 * Frontend Service communicating with FastAPI + SQLite Backend
 */

const FASTAPI_BASE = 'http://localhost:8000/api';

export const fetchTendersFastAPI = async () => {
  const res = await fetch(`${FASTAPI_BASE}/tenders`);
  if (!res.ok) throw new Error('Failed to fetch tenders from FastAPI backend');
  return await res.json();
};

export const fetchBiddersFastAPI = async (tenderRef) => {
  const url = tenderRef 
    ? `${FASTAPI_BASE}/bidders?tender_ref=${encodeURIComponent(tenderRef)}`
    : `${FASTAPI_BASE}/bidders`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch bidders from FastAPI backend');
  return await res.json();
};

export const fetchBidderDashboardFastAPI = async (bidderId) => {
  const res = await fetch(`${FASTAPI_BASE}/bidders/${bidderId}/dashboard`);
  if (!res.ok) throw new Error('Failed to fetch bidder dashboard');
  return await res.json();
};

export const uploadBidderDocumentFastAPI = async (bidderId, docType, file) => {
  const formData = new FormData();
  formData.append('doc_type', docType);
  formData.append('file', file);

  const res = await fetch(`${FASTAPI_BASE}/bidders/${bidderId}/documents/upload`, {
    method: 'POST',
    body: formData
  });

  if (!res.ok) throw new Error('Failed to upload document');
  return await res.json();
};

export const triggerVerificationFastAPI = async (bidderId) => {
  const res = await fetch(`${FASTAPI_BASE}/bidders/${bidderId}/verify`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to trigger AI verification');
  return await res.json();
};

export const submitOfficerDecisionFastAPI = async (bidderId, decisionStatus, officerRemarks) => {
  const res = await fetch(`${FASTAPI_BASE}/bidders/${bidderId}/decision`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ decision_status: decisionStatus, officer_remarks: officerRemarks })
  });
  if (!res.ok) throw new Error('Failed to submit officer decision');
  return await res.json();
};

export const sendBidderNotificationFastAPI = async (bidderId, payload) => {
  const res = await fetch(`${FASTAPI_BASE}/bidders/${bidderId}/send-notification`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to send decision notification');
  return await res.json();
};

export const fetchAuditLogsFastAPI = async () => {
  const res = await fetch(`${FASTAPI_BASE}/audit-logs`);
  if (!res.ok) throw new Error('Failed to fetch audit logs');
  return await res.json();
};

export const fetchMockGovRecordsFastAPI = async () => {
  const res = await fetch(`${FASTAPI_BASE}/mock-gov-records`);
  if (!res.ok) throw new Error('Failed to fetch mock gov records');
  return await res.json();
};

export const runBatchVerificationFastAPI = async () => {
  const res = await fetch(`${FASTAPI_BASE}/batch-verify`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to run batch verification');
  return await res.json();
};

export const fetchClarificationNoticeFastAPI = async (bidderId) => {
  const res = await fetch(`${FASTAPI_BASE}/bidders/${bidderId}/clarification-notice`);
  if (!res.ok) throw new Error('Failed to generate clarification notice');
  return await res.json();
};

export const generateClarificationNoticeLLMFastAPI = async (bidderId, payload) => {
  const res = await fetch(`${FASTAPI_BASE}/bidders/${bidderId}/generate-clarification-notice`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to generate LLM clarification notice');
  return await res.json();
};

export const sendClarificationNoticeFastAPI = async (bidderId, payload) => {
  const res = await fetch(`${FASTAPI_BASE}/bidders/${bidderId}/send-clarification-notice`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to send clarification notice');
  return await res.json();
};

export const simulateBidderResponseFastAPI = async (bidderId, payload) => {
  const res = await fetch(`${FASTAPI_BASE}/bidders/${bidderId}/simulate-bidder-response`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to simulate bidder response');
  return await res.json();
};
