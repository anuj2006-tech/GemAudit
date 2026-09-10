from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict

class BidderBase(BaseModel):
    gem_seller_id: str
    company_name: str
    tender_ref: Optional[str] = "GEM/2026/B/894120"
    tender_name: Optional[str] = "Supply of Office Furniture"
    cin_number: Optional[str] = None
    pan_number: str
    gstin: str
    udyam_number: Optional[str] = None
    enterprise_type: Optional[str] = None
    dipp_startup_number: Optional[str] = None
    nsic_number: Optional[str] = None
    epfo_code: Optional[str] = None
    esic_code: Optional[str] = None
    submitted_turnover: float = 0.0
    submitted_experience_years: int = 0
    local_content_percent: float = 0.0

class BidderCreate(BidderBase):
    pass

class BidderResponse(BidderBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    decision_status: str
    officer_remarks: Optional[str] = None
    created_at: datetime


class DocumentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    bidder_id: int
    doc_type: str
    file_name: str
    file_path: str
    extracted_text: Optional[str] = None
    extracted_claims_json: Optional[str] = None
    uploaded_at: datetime


class VerificationResultResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    bidder_id: int
    document_id: Optional[int] = None
    check_type: str
    portal_name: str
    status: str # VERIFIED, MISMATCH, MISSING, EXPIRED, DEBARRED, NEEDS_REVIEW
    weight: float = 10.0
    points_earned: float = 10.0
    badge_color: str
    title: str
    details: str
    ai_notes: Optional[str] = None
    claimed_data_json: Optional[str] = None
    matched_record_json: Optional[str] = None
    verified_at: datetime


class ComplianceAssessmentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    bidder_id: int
    score: float
    risk_level: str # Low, Medium, High
    passed_checks_count: int
    warning_checks_count: int
    failed_checks_count: int
    ai_recommendation_status: str
    ai_recommendation_summary: str
    action_items_json: Optional[str] = None
    timestamp: datetime


class AuditLogResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    bidder_id: int
    action: str
    performed_by: str
    details_json: Optional[str] = None
    timestamp: datetime


class DecisionRequest(BaseModel):
    decision_status: str # MARK_QUALIFIED, MARK_DISQUALIFIED, REQUEST_CLARIFICATION
    officer_remarks: str


class ClarificationNoticeGenerateRequest(BaseModel):
    selected_issues: List[str] # Check titles / details to include
    template_type: Optional[str] = "CUSTOM"
    officer_note: Optional[str] = ""
    deadline_days: int = 3


class ClarificationNoticeSendRequest(BaseModel):
    issues_referenced: List[str]
    template_type: Optional[str] = "CUSTOM"
    officer_note: Optional[str] = ""
    generated_notice_text: str
    deadline_days: int = 3


class BidderResponseLogResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    clarification_request_id: int
    bidder_id: int
    response_text: str
    uploaded_doc_name: Optional[str] = None
    received_timestamp: datetime
    score_before: float
    score_after: float


class ClarificationRequestResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    bidder_id: int
    tender_ref: str
    issues_referenced_json: str
    template_type: Optional[str] = None
    officer_note: Optional[str] = None
    generated_notice_text: str
    sent_timestamp: datetime
    deadline_date: str
    deadline_days: int
    status: str
    responses: List[BidderResponseLogResponse] = []


class SimulateResponseRequest(BaseModel):
    clarification_request_id: Optional[int] = None
    response_text: str
    resolve_issues: Optional[bool] = True
    uploaded_doc_name: Optional[str] = None


class BidderDecisionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    bidder_id: int
    tender_ref: str
    decision: str
    decided_by: str
    decided_at: datetime
    score_snapshot: float
    risk_level_snapshot: str
    checks_snapshot_json: str
    notification_text: Optional[str] = None
    notification_sent_at: Optional[datetime] = None


class SendNotificationRequest(BaseModel):
    decision_id: int
    notification_text: str


class BidderDashboardResponse(BaseModel):
    bidder: BidderResponse
    latest_assessment: Optional[ComplianceAssessmentResponse] = None
    verification_results: List[VerificationResultResponse] = []
    documents: List[DocumentResponse] = []
    audit_logs: List[AuditLogResponse] = []
    clarification_requests: List[ClarificationRequestResponse] = []
    decisions: List[BidderDecisionResponse] = []
