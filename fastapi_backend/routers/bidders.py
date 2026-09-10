import os
import json
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from pypdf import PdfReader

from database import get_db
from models import (
    Bidder, Document, VerificationResult, ComplianceAssessment, AuditLog, MockGovRecord,
    ClarificationRequest, BidderResponseLog, BidderDecision
)
from schemas import (
    BidderResponse, 
    BidderDashboardResponse, 
    DecisionRequest, 
    AuditLogResponse, 
    VerificationResultResponse,
    ClarificationNoticeGenerateRequest,
    ClarificationNoticeSendRequest,
    SimulateResponseRequest,
    ClarificationRequestResponse,
    BidderResponseLogResponse,
    BidderDecisionResponse,
    SendNotificationRequest
)
from services.verification_engine import execute_full_verification, run_llm_claims_extraction, OPENROUTER_API_KEY, OPENROUTER_URL
import requests

router = APIRouter(prefix="/api", tags=["Bidders Compliance API"])

UPLOAD_DIR = "./uploaded_documents"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.get("/tenders")
def get_all_tenders(db: Session = Depends(get_db)):
    """
    Fetch all active GeM Tenders and their summary metrics
    """
    tenders = [
        {"tender_ref": "GEM/2026/B/894120", "tender_name": "Supply of Office Furniture", "category": "Furniture & Infrastructure", "budget": "₹ 45.0 Lakhs"},
        {"tender_ref": "GEM/2026/B/894287", "tender_name": "IT Hardware & Networking Equipment Procurement", "category": "IT & Telecom", "budget": "₹ 1.25 Crores"},
        {"tender_ref": "GEM/2026/B/895011", "tender_name": "Facility Management Services - Annual Contract", "category": "Services & Maintenance", "budget": "₹ 85.0 Lakhs"}
    ]
    result = []
    for t in tenders:
        bidders_count = db.query(Bidder).filter(Bidder.tender_ref == t["tender_ref"]).count()
        result.append({
            **t,
            "bidders_count": bidders_count
        })
    return result


@router.get("/bidders", response_model=List[dict])
def get_all_bidders(tender_ref: Optional[str] = None, db: Session = Depends(get_db)):
    """
    Fetch all bidders for Multi-Bidder Triage Overview table (filtered optionally by tender_ref)
    """
    query = db.query(Bidder)
    if tender_ref:
        query = query.filter(Bidder.tender_ref == tender_ref)
    
    bidders = query.all()
    result = []
    for b in bidders:
        assessment = db.query(ComplianceAssessment).filter(ComplianceAssessment.bidder_id == b.id).order_by(ComplianceAssessment.timestamp.desc()).first()
        if not assessment:
            assessment = execute_full_verification(db, b.id)

        # Get latest decision if any
        latest_decision = db.query(BidderDecision).filter(BidderDecision.bidder_id == b.id).order_by(BidderDecision.decided_at.desc()).first()

        result.append({
            "id": b.id,
            "gem_seller_id": b.gem_seller_id,
            "company_name": b.company_name,
            "tender_ref": b.tender_ref,
            "tender_name": b.tender_name,
            "gstin": b.gstin,
            "pan_number": b.pan_number,
            "udyam_number": b.udyam_number,
            "enterprise_type": b.enterprise_type,
            "local_content_percent": b.local_content_percent,
            "decision_status": b.decision_status,
            "officer_remarks": b.officer_remarks,
            "score": assessment.score if assessment else 0.0,
            "risk_level": assessment.risk_level if assessment else "Low",
            "passed_checks": assessment.passed_checks_count if assessment else 0,
            "warning_checks": assessment.warning_checks_count if assessment else 0,
            "failed_checks": assessment.failed_checks_count if assessment else 0,
            "ai_recommendation_status": assessment.ai_recommendation_status if assessment else "RECOMMEND_QUALIFY",
            "latest_decision": latest_decision.decision if latest_decision else None,
            "notification_sent_at": latest_decision.notification_sent_at if latest_decision else None
        })
    return result


@router.get("/bidders/{bidder_id}/dashboard", response_model=BidderDashboardResponse)
def get_bidder_dashboard(bidder_id: int, db: Session = Depends(get_db)):
    """
    Fetch complete compliance dashboard data for a single bidder
    """
    bidder = db.query(Bidder).filter(Bidder.id == bidder_id).first()
    if not bidder:
        raise HTTPException(status_code=404, detail="Bidder not found")

    assessment = db.query(ComplianceAssessment).filter(ComplianceAssessment.bidder_id == bidder_id).order_by(ComplianceAssessment.timestamp.desc()).first()
    if not assessment:
        assessment = execute_full_verification(db, bidder_id)

    verification_results = db.query(VerificationResult).filter(VerificationResult.bidder_id == bidder_id).all()
    documents = db.query(Document).filter(Document.bidder_id == bidder_id).all()
    audit_logs = db.query(AuditLog).filter(AuditLog.bidder_id == bidder_id).order_by(AuditLog.timestamp.desc()).all()
    clarification_requests = db.query(ClarificationRequest).filter(ClarificationRequest.bidder_id == bidder_id).order_by(ClarificationRequest.sent_timestamp.desc()).all()
    decisions = db.query(BidderDecision).filter(BidderDecision.bidder_id == bidder_id).order_by(BidderDecision.decided_at.desc()).all()

    return {
        "bidder": bidder,
        "latest_assessment": assessment,
        "verification_results": verification_results,
        "documents": documents,
        "audit_logs": audit_logs,
        "clarification_requests": clarification_requests,
        "decisions": decisions
    }


@router.post("/bidders/{bidder_id}/documents/upload")
async def upload_bidder_document(
    bidder_id: int,
    doc_type: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload compliance document (PDF), extract text using pypdf + LLM claims extraction, and run re-verification
    """
    bidder = db.query(Bidder).filter(Bidder.id == bidder_id).first()
    if not bidder:
        raise HTTPException(status_code=404, detail="Bidder not found")

    file_filename = f"bidder_{bidder_id}_{int(datetime.utcnow().timestamp())}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, file_filename)

    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    extracted_text = ""
    try:
        reader = PdfReader(file_path)
        for page in reader.pages:
            t = page.extract_text()
            if t:
                extracted_text += t + "\n"
    except Exception as e:
        extracted_text = f"Simulated OCR Text from PDF upload {file.filename} for doc type {doc_type}"

    # Extract claims via LLM Engine
    extracted_claims = run_llm_claims_extraction(doc_type, extracted_text)

    doc = Document(
        bidder_id=bidder_id,
        doc_type=doc_type,
        file_name=file.filename,
        file_path=file_path,
        extracted_text=extracted_text,
        extracted_claims_json=json.dumps(extracted_claims)
    )
    db.add(doc)
    
    # Audit log
    audit = AuditLog(
        bidder_id=bidder_id,
        action="DOCUMENT_UPLOADED",
        performed_by="Officer / Bidder Upload",
        details_json=json.dumps({
            "doc_type": doc_type,
            "file_name": file.filename,
            "file_path": file_path
        })
    )
    db.add(audit)
    db.commit()
    db.refresh(doc)

    # Trigger re-verification after document upload
    assessment = execute_full_verification(db, bidder_id)

    return {
        "success": True,
        "message": f"Document {file.filename} uploaded and parsed successfully.",
        "document_id": doc.id,
        "claims": extracted_claims,
        "assessment": assessment
    }


@router.post("/bidders/{bidder_id}/verify")
def trigger_verification(bidder_id: int, db: Session = Depends(get_db)):
    """
    Trigger AI verification engine & update assessment
    """
    assessment = execute_full_verification(db, bidder_id)
    return {"success": True, "assessment": assessment}


@router.post("/bidders/{bidder_id}/decision")
def record_officer_decision(
    bidder_id: int, 
    body: DecisionRequest, 
    db: Session = Depends(get_db)
):
    """
    Record Procurement Officer decision (MARK_QUALIFIED, MARK_DISQUALIFIED, REQUEST_CLARIFICATION),
    freeze check snapshot, auto-generate LLM bidder notification, and log AuditLog
    """
    bidder = db.query(Bidder).filter(Bidder.id == bidder_id).first()
    if not bidder:
        raise HTTPException(status_code=404, detail="Bidder not found")

    if body.decision_status not in ["MARK_QUALIFIED", "MARK_DISQUALIFIED", "REQUEST_CLARIFICATION", "AWAITING_CLARIFICATION"]:
        raise HTTPException(status_code=400, detail="Invalid decision status provided.")

    bidder.decision_status = body.decision_status
    bidder.officer_remarks = body.officer_remarks

    # Fetch current assessment and results to freeze snapshot
    assessment = db.query(ComplianceAssessment).filter(ComplianceAssessment.bidder_id == bidder_id).order_by(ComplianceAssessment.timestamp.desc()).first()
    results = db.query(VerificationResult).filter(VerificationResult.bidder_id == bidder_id).all()

    checks_snapshot = [
        {
            "portal_name": r.portal_name,
            "check_type": r.check_type,
            "status": r.status,
            "weight": r.weight,
            "points_earned": r.points_earned,
            "title": r.title,
            "details": r.details
        }
        for r in results
    ]

    decided_at = datetime.utcnow()

    # Generate Notification via LLM
    flagged_reasons = [f"- {r.portal_name}: {r.details}" for r in results if r.status in ["MISMATCH", "EXPIRED", "DEBARRED", "MISSING"]]
    reasons_str = "\n".join(flagged_reasons) if flagged_reasons else "- Statutory eligibility criteria not fully met."

    notification_text = ""
    if body.decision_status == "MARK_QUALIFIED":
        notification_text = f"""GOVERNMENT e-MARKETPLACE (GeM) - OFFICIAL COMPLIANCE DECISION NOTICE
Ref: GeM/COMP/2026/QUAL/{bidder.gem_seller_id}
Date: {decided_at.strftime('%d-%b-%Y')}

To,
M/s {bidder.company_name}
GSTIN: {bidder.gstin} | PAN: {bidder.pan_number}

Subject: Technical Bid Compliance Verification Outcome - QUALIFIED

Dear Bidder,

We are pleased to inform you that your bid submitted for GeM Tender Ref: {bidder.tender_ref} ({bidder.tender_name}) has successfully cleared the automated AI statutory compliance verification with a score of {assessment.score}%.

Your technical submission will now proceed to the next stage of technical and financial evaluation.

Yours faithfully,
Procurement Officer, GeM Evaluation Committee
Government e-Marketplace (GeM)
"""
    elif body.decision_status == "MARK_DISQUALIFIED":
        notification_text = f"""GOVERNMENT e-MARKETPLACE (GeM) - OFFICIAL COMPLIANCE DECISION NOTICE
Ref: GeM/COMP/2026/DISQ/{bidder.gem_seller_id}
Date: {decided_at.strftime('%d-%b-%Y')}

To,
M/s {bidder.company_name}
GSTIN: {bidder.gstin} | PAN: {bidder.pan_number}

Subject: Technical Bid Compliance Verification Outcome - DISQUALIFIED

Dear Bidder,

This is to inform you that your bid submitted for GeM Tender Ref: {bidder.tender_ref} ({bidder.tender_name}) has been evaluated as DISQUALIFIED during preliminary statutory compliance verification.

Specific Reason(s) for Disqualification:
{reasons_str}

Officer Remarks: {body.officer_remarks or 'Verification failed statutory requirements.'}

Note: In accordance with GeM Procurement Guidelines, if you believe this evaluation contains factual error, you may file a formal representation on the GeM portal within 5 working days of this notice.

Yours faithfully,
Procurement Officer, GeM Evaluation Committee
Government e-Marketplace (GeM)
"""
    else:
        notification_text = f"Notice: Clarification required for Tender {bidder.tender_ref}. Please refer to official notice."

    decision_entity = BidderDecision(
        bidder_id=bidder_id,
        tender_ref=bidder.tender_ref,
        decision=body.decision_status,
        decided_by="Gov Procurement Officer",
        decided_at=decided_at,
        score_snapshot=assessment.score if assessment else 0.0,
        risk_level_snapshot=assessment.risk_level if assessment else "Low",
        checks_snapshot_json=json.dumps(checks_snapshot),
        notification_text=notification_text
    )
    db.add(decision_entity)

    # Immutable Audit Log
    audit = AuditLog(
        bidder_id=bidder_id,
        action=f"PROCUREMENT_OFFICER_DECISION_{body.decision_status}",
        performed_by="Gov Procurement Officer",
        details_json=json.dumps({
            "decision": body.decision_status,
            "remarks": body.officer_remarks,
            "score_at_decision": assessment.score if assessment else 0.0,
            "risk_level_at_decision": assessment.risk_level if assessment else "Low",
            "timestamp": decided_at.strftime("%d-%b-%Y %H:%M:%S UTC"),
            "passed_checks": assessment.passed_checks_count if assessment else 0,
            "failed_checks": assessment.failed_checks_count if assessment else 0
        })
    )
    db.add(audit)
    db.commit()
    db.refresh(decision_entity)

    return {
        "success": True,
        "message": f"Decision {body.decision_status} recorded and logged at {decided_at.strftime('%d-%b-%Y %H:%M:%S UTC')}",
        "decision_id": decision_entity.id,
        "decided_at": decided_at.strftime("%d-%b-%Y %H:%M:%S UTC"),
        "notification_text": notification_text,
        "bidder": bidder
    }


@router.post("/bidders/{bidder_id}/send-notification")
def send_bidder_notification(
    bidder_id: int, 
    body: SendNotificationRequest, 
    db: Session = Depends(get_db)
):
    """
    Send official decision notification to bidder & log AuditLog
    """
    decision = db.query(BidderDecision).filter(BidderDecision.id == body.decision_id).first()
    if not decision:
        raise HTTPException(status_code=404, detail="Decision record not found")

    decision.notification_text = body.notification_text
    decision.notification_sent_at = datetime.utcnow()

    # Log Audit Event
    audit = AuditLog(
        bidder_id=bidder_id,
        action="NOTIFICATION_SENT_TO_BIDDER",
        performed_by="Gov Procurement Officer",
        details_json=json.dumps({
            "decision": decision.decision,
            "sent_at": decision.notification_sent_at.strftime("%d-%b-%Y %H:%M:%S UTC"),
            "ref_no": f"GeM/COMP/2026/{decision.decision[:4]}/{decision.bidder_id}"
        })
    )
    db.add(audit)
    db.commit()

    return {"success": True, "message": "Notification dispatched to Bidder successfully.", "sent_at": decision.notification_sent_at}


@router.get("/audit-logs", response_model=List[AuditLogResponse])
def get_all_audit_logs(db: Session = Depends(get_db)):
    """
    Fetch global audit trail timeline
    """
    return db.query(AuditLog).order_by(AuditLog.timestamp.desc()).all()


@router.get("/mock-gov-records")
def get_mock_gov_records(db: Session = Depends(get_db)):
    """
    Inspect official 10 simulated government database records
    """
    records = db.query(MockGovRecord).all()
    return {"count": len(records), "records": records}


@router.post("/batch-verify")
def run_batch_verification(db: Session = Depends(get_db)):
    """
    Re-evaluate all bidders in batch for live triage updates
    """
    bidders = db.query(Bidder).all()
    assessments = []
    for b in bidders:
        a = execute_full_verification(db, b.id)
        assessments.append({"bidder_id": b.id, "score": a.score, "risk_level": a.risk_level})
    
    return {"success": True, "count": len(assessments), "assessments": assessments}


@router.post("/bidders/{bidder_id}/generate-clarification-notice")
def generate_llm_clarification_notice(
    bidder_id: int, 
    body: ClarificationNoticeGenerateRequest, 
    db: Session = Depends(get_db)
):
    """
    Generate formal LLM compliance clarification notice using OpenRouter Gemini API
    """
    bidder = db.query(Bidder).filter(Bidder.id == bidder_id).first()
    if not bidder:
        raise HTTPException(status_code=404, detail="Bidder not found")

    deadline_date = (datetime.utcnow() + timedelta(days=body.deadline_days)).strftime("%d-%b-%Y")
    issues_str = "\n".join([f"- {issue}" for issue in body.selected_issues]) if body.selected_issues else "- General statutory document clarification required"

    prompt = f"""Draft a formal compliance clarification notice for a government tender bidder.
Tender ID: {bidder.tender_ref} ({bidder.tender_name}).
Bidder Name: M/s {bidder.company_name} (GSTIN: {bidder.gstin}, PAN: {bidder.pan_number}).
Issues requiring clarification:
{issues_str}

Officer's note: {body.officer_note or 'None'}
Response deadline: {deadline_date} ({body.deadline_days} working days).

Keep tone formal, clear, and specific to each issue. Do not make accusatory statements — request clarification/documentation only in official government correspondence format.
"""
    try:
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "google/gemini-2.5-flash",
            "messages": [{"role": "user", "content": prompt}]
        }
        response = requests.post(OPENROUTER_URL, headers=headers, json=payload, timeout=8)
        if response.status_code == 200:
            res_json = response.json()
            notice_text = res_json['choices'][0]['message']['content']
        else:
            raise Exception(f"LLM API returned {response.status_code}")
    except Exception as e:
        print(f"[Clarification Engine] LLM prompt fallback used: {e}")
        notice_text = f"""GOVERNMENT e-MARKETPLACE (GeM) - OFFICIAL CLARIFICATION NOTICE
Ref No: GEM/2026/NOT/{bidder.gem_seller_id}
Date: {datetime.utcnow().strftime('%d-%b-%Y')}

To,
M/s {bidder.company_name}
GSTIN: {bidder.gstin} | PAN: {bidder.pan_number}

Subject: Clarification Notice regarding Technical Bid Compliance under GeM Tender {bidder.tender_ref} ({bidder.tender_name})

Dear Sir/Madam,

During preliminary automated AI statutory verification of your submitted bid, the following compliance discrepancies/gaps were flagged for Procurement Officer review:

{issues_str}

{f"Procurement Officer Special Note: {body.officer_note}" if body.officer_note else ""}

You are requested to submit your point-wise clarification along with supporting documents on the GeM portal by {deadline_date} ({body.deadline_days} working days), failing which your bid shall be evaluated based on available records.

Yours faithfully,
Procurement Officer, GeM Evaluation Committee
Government e-Marketplace (GeM)
"""

    return {
        "success": True,
        "notice_text": notice_text,
        "deadline_date": deadline_date,
        "issues_count": len(body.selected_issues)
    }


@router.post("/bidders/{bidder_id}/send-clarification-notice")
def send_clarification_notice(
    bidder_id: int, 
    body: ClarificationNoticeSendRequest, 
    db: Session = Depends(get_db)
):
    """
    Save ClarificationRequest, update bidder status to AWAITING_CLARIFICATION, and log AuditLog
    """
    bidder = db.query(Bidder).filter(Bidder.id == bidder_id).first()
    if not bidder:
        raise HTTPException(status_code=404, detail="Bidder not found")

    deadline_date = (datetime.utcnow() + timedelta(days=body.deadline_days)).strftime("%d-%b-%Y")

    request_entity = ClarificationRequest(
        bidder_id=bidder_id,
        tender_ref=bidder.tender_ref,
        issues_referenced_json=json.dumps(body.issues_referenced),
        template_type=body.template_type,
        officer_note=body.officer_note,
        generated_notice_text=body.generated_notice_text,
        deadline_date=deadline_date,
        deadline_days=body.deadline_days,
        status="SENT"
    )
    db.add(request_entity)

    # Update Bidder Status to AWAITING_CLARIFICATION
    bidder.decision_status = "AWAITING_CLARIFICATION"
    bidder.officer_remarks = f"Official Clarification Notice issued on {datetime.utcnow().strftime('%d-%b-%Y')}. Awaiting response by {deadline_date}."

    # Audit Log Entry
    audit = AuditLog(
        bidder_id=bidder_id,
        action="CLARIFICATION_NOTICE_SENT",
        performed_by="Gov Procurement Officer",
        details_json=json.dumps({
            "deadline": deadline_date,
            "deadline_days": body.deadline_days,
            "issues_count": len(body.issues_referenced),
            "notice_ref": f"GEM/2026/NOT/{bidder.gem_seller_id}"
        })
    )
    db.add(audit)
    db.commit()
    db.refresh(request_entity)

    return {
        "success": True,
        "message": f"Clarification Notice sent to {bidder.company_name}. Status set to AWAITING_CLARIFICATION.",
        "clarification_request_id": request_entity.id,
        "deadline_date": deadline_date
    }


@router.post("/bidders/{bidder_id}/simulate-bidder-response")
def simulate_bidder_response(
    bidder_id: int, 
    body: SimulateResponseRequest, 
    db: Session = Depends(get_db)
):
    """
    Simulate bidder submitting response + document: re-verify, calculate score before & after, update status, & log AuditLog
    """
    bidder = db.query(Bidder).filter(Bidder.id == bidder_id).first()
    if not bidder:
        raise HTTPException(status_code=404, detail="Bidder not found")

    assessment_before = db.query(ComplianceAssessment).filter(ComplianceAssessment.bidder_id == bidder_id).order_by(ComplianceAssessment.timestamp.desc()).first()
    score_before = assessment_before.score if assessment_before else 0.0

    # If resolve_issues is True, resolve MISMATCH/NEEDS_REVIEW/EXPIRED checks in SQLite for demo
    if body.resolve_issues:
        results = db.query(VerificationResult).filter(VerificationResult.bidder_id == bidder_id).all()
        for r in results:
            if r.status in ["MISMATCH", "NEEDS_REVIEW", "EXPIRED"]:
                r.status = "VERIFIED"
                r.badge_color = "emerald"
                r.points_earned = r.weight
                r.details = f"Clarified & Verified via bidder submission on {datetime.utcnow().strftime('%d-%b-%Y')}: {body.response_text[:120]}..."
                r.title = f"Resolved: {r.portal_name} Compliance Verified"
                r.ai_notes = "Resolved via Bidder Clarification Response & Document Re-verification."

    # Re-run full verification calculation
    assessment_after = execute_full_verification(db, bidder_id)
    score_after = assessment_after.score

    # Save BidderResponseLog
    req = db.query(ClarificationRequest).filter(ClarificationRequest.bidder_id == bidder_id).order_by(ClarificationRequest.sent_timestamp.desc()).first()
    if req:
        req.status = "RESPONDED"

    resp_log = BidderResponseLog(
        clarification_request_id=req.id if req else 1,
        bidder_id=bidder_id,
        response_text=body.response_text,
        uploaded_doc_name=body.uploaded_doc_name or "Clarification_Document_Response.pdf",
        score_before=score_before,
        score_after=score_after
    )
    db.add(resp_log)

    # Change bidder status back to PENDING (ready for officer decision)
    bidder.decision_status = "PENDING"
    bidder.officer_remarks = f"Bidder response received on {datetime.utcnow().strftime('%d-%b-%Y')}. Score updated: {score_before}% → {score_after}%."

    # Audit Log Entry
    audit = AuditLog(
        bidder_id=bidder_id,
        action="BIDDER_RESPONSE_RECEIVED",
        performed_by=f"Bidder ({bidder.company_name})",
        details_json=json.dumps({
            "response_snippet": body.response_text[:150],
            "score_before": score_before,
            "score_after": score_after,
            "score_diff": round(score_after - score_before, 1)
        })
    )
    db.add(audit)
    db.commit()

    return {
        "success": True,
        "score_before": score_before,
        "score_after": score_after,
        "score_diff": round(score_after - score_before, 1),
        "new_status": bidder.decision_status,
        "assessment": assessment_after
    }
