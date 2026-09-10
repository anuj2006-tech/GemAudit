from datetime import datetime
import json
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database import Base

class Bidder(Base):
    __tablename__ = "bidders"

    id = Column(Integer, primary_key=True, index=True)
    gem_seller_id = Column(String, unique=True, index=True)
    company_name = Column(String, index=True)
    tender_ref = Column(String, default="GEM/2026/B/894120", index=True)
    tender_name = Column(String, default="Supply of Office Furniture")
    cin_number = Column(String, nullable=True)
    pan_number = Column(String, index=True)
    gstin = Column(String, index=True)
    udyam_number = Column(String, nullable=True)
    enterprise_type = Column(String, nullable=True) # Micro, Small, Medium, Large
    dipp_startup_number = Column(String, nullable=True)
    nsic_number = Column(String, nullable=True)
    epfo_code = Column(String, nullable=True)
    esic_code = Column(String, nullable=True)
    submitted_turnover = Column(Float, default=0.0)
    submitted_experience_years = Column(Integer, default=0)
    local_content_percent = Column(Float, default=0.0)
    decision_status = Column(String, default="PENDING") # PENDING, MARK_QUALIFIED, MARK_DISQUALIFIED, REQUEST_CLARIFICATION, AWAITING_CLARIFICATION
    officer_remarks = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    documents = relationship("Document", back_populates="bidder", cascade="all, delete-orphan")
    verification_results = relationship("VerificationResult", back_populates="bidder", cascade="all, delete-orphan")
    assessments = relationship("ComplianceAssessment", back_populates="bidder", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="bidder", cascade="all, delete-orphan")
    clarification_requests = relationship("ClarificationRequest", back_populates="bidder", cascade="all, delete-orphan")
    decisions = relationship("BidderDecision", back_populates="bidder", cascade="all, delete-orphan")


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    bidder_id = Column(Integer, ForeignKey("bidders.id"), nullable=False)
    doc_type = Column(String, nullable=False) # UDYAM, GST, PAN, EPFO_ESIC, STARTUP_INDIA, NSIC, OEM_AUTH
    file_name = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    extracted_text = Column(Text, nullable=True)
    extracted_claims_json = Column(Text, nullable=True) # JSON string of extracted claims
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    bidder = relationship("Bidder", back_populates="documents")


class MockGovRecord(Base):
    """
    Simulated official government database record representing sources:
    Udyam, GSTN, Income Tax/PAN, MCA21, EPFO, ESIC, Startup India, NSIC, DigiLocker, Blacklist
    """
    __tablename__ = "mock_gov_records"

    id = Column(Integer, primary_key=True, index=True)
    portal_name = Column(String, index=True) # e.g. "Udyam", "GSTN", "Income Tax", "MCA21", "EPFO", "ESIC", "Startup India", "NSIC", "DigiLocker", "CPPP Blacklist"
    registration_number = Column(String, index=True) # GSTIN, PAN, URN, CIN, etc.
    bidder_name = Column(String, index=True)
    status = Column(String, default="ACTIVE") # ACTIVE, CANCELLED, DELAYED_RETURNS, DEBARRED, EXPIRED
    expiry_date = Column(String, nullable=True)
    additional_fields_json = Column(Text, nullable=True) # Extra portal metadata


class VerificationResult(Base):
    __tablename__ = "verification_results"

    id = Column(Integer, primary_key=True, index=True)
    bidder_id = Column(Integer, ForeignKey("bidders.id"), nullable=False)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=True)
    check_type = Column(String, nullable=False) # UDYAM_CHECK, GSTN_CHECK, PAN_CHECK, MCA21_CHECK, STARTUP_CHECK, EPFO_ESIC_CHECK, MII_CHECK, OEM_AUTH_CHECK, BLACKLIST_CHECK, TENDER_ELIGIBILITY_CHECK
    portal_name = Column(String, nullable=False)
    status = Column(String, nullable=False) # VERIFIED, MISMATCH, MISSING, EXPIRED, DEBARRED, NEEDS_REVIEW
    weight = Column(Float, default=10.0) # Percentage weight in scoring
    points_earned = Column(Float, default=10.0) # Actual points credited
    badge_color = Column(String, default="emerald") # emerald, amber, rose, indigo, slate
    title = Column(String, nullable=False)
    details = Column(Text, nullable=False)
    ai_notes = Column(Text, nullable=True)
    claimed_data_json = Column(Text, nullable=True)
    matched_record_json = Column(Text, nullable=True)
    verified_at = Column(DateTime, default=datetime.utcnow)

    bidder = relationship("Bidder", back_populates="verification_results")


class ComplianceAssessment(Base):
    __tablename__ = "compliance_assessments"

    id = Column(Integer, primary_key=True, index=True)
    bidder_id = Column(Integer, ForeignKey("bidders.id"), nullable=False)
    score = Column(Float, default=0.0) # 0 to 100
    risk_level = Column(String, default="Low") # Low, Medium, High
    passed_checks_count = Column(Integer, default=0)
    warning_checks_count = Column(Integer, default=0)
    failed_checks_count = Column(Integer, default=0)
    ai_recommendation_status = Column(String, nullable=False) # RECOMMEND_QUALIFY, RECOMMEND_CLARIFICATION, RECOMMEND_DISQUALIFY
    ai_recommendation_summary = Column(Text, nullable=False)
    action_items_json = Column(Text, nullable=True) # JSON array of action bullet points
    timestamp = Column(DateTime, default=datetime.utcnow)

    bidder = relationship("Bidder", back_populates="assessments")


class ClarificationRequest(Base):
    __tablename__ = "clarification_requests"

    id = Column(Integer, primary_key=True, index=True)
    bidder_id = Column(Integer, ForeignKey("bidders.id"), nullable=False)
    tender_ref = Column(String, nullable=False)
    issues_referenced_json = Column(Text, nullable=False) # JSON list of selected issues
    template_type = Column(String, nullable=True)
    officer_note = Column(Text, nullable=True)
    generated_notice_text = Column(Text, nullable=False)
    sent_timestamp = Column(DateTime, default=datetime.utcnow)
    deadline_date = Column(String, nullable=False)
    deadline_days = Column(Integer, default=3)
    status = Column(String, default="SENT") # SENT, RESPONDED, EXPIRED

    bidder = relationship("Bidder", back_populates="clarification_requests")
    responses = relationship("BidderResponseLog", back_populates="clarification_request", cascade="all, delete-orphan")


class BidderResponseLog(Base):
    __tablename__ = "bidder_responses"

    id = Column(Integer, primary_key=True, index=True)
    clarification_request_id = Column(Integer, ForeignKey("clarification_requests.id"), nullable=False)
    bidder_id = Column(Integer, ForeignKey("bidders.id"), nullable=False)
    response_text = Column(Text, nullable=False)
    uploaded_doc_name = Column(String, nullable=True)
    received_timestamp = Column(DateTime, default=datetime.utcnow)
    score_before = Column(Float, default=0.0)
    score_after = Column(Float, default=0.0)

    clarification_request = relationship("ClarificationRequest", back_populates="responses")


class BidderDecision(Base):
    __tablename__ = "bidder_decisions"

    id = Column(Integer, primary_key=True, index=True)
    bidder_id = Column(Integer, ForeignKey("bidders.id"), nullable=False)
    tender_ref = Column(String, nullable=False)
    decision = Column(String, nullable=False) # MARK_QUALIFIED, MARK_DISQUALIFIED, REQUEST_CLARIFICATION
    decided_by = Column(String, default="Gov Procurement Officer")
    decided_at = Column(DateTime, default=datetime.utcnow)
    score_snapshot = Column(Float, default=0.0)
    risk_level_snapshot = Column(String, default="Low")
    checks_snapshot_json = Column(Text, nullable=False)
    notification_text = Column(Text, nullable=True)
    notification_sent_at = Column(DateTime, nullable=True)

    bidder = relationship("Bidder", back_populates="decisions")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    bidder_id = Column(Integer, ForeignKey("bidders.id"), nullable=False)
    action = Column(String, nullable=False) # VERIFICATION_RUN, OFFICER_DECISION, DOCUMENT_UPLOADED, CLARIFICATION_NOTICE_SENT, BIDDER_RESPONSE_RECEIVED, NOTIFICATION_SENT_TO_BIDDER
    performed_by = Column(String, default="Gov Procurement Officer")
    details_json = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    bidder = relationship("Bidder", back_populates="audit_logs")
