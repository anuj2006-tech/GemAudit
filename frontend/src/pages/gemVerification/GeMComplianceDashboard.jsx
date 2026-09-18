import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Building2, 
  FileText, 
  Search, 
  RefreshCw, 
  Check, 
  X, 
  HelpCircle, 
  Printer, 
  Sparkles, 
  Layers, 
  UserCheck, 
  History, 
  UploadCloud, 
  Database,
  Lock,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Calculator,
  Loader2,
  FileSpreadsheet,
  Send,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  CheckSquare,
  Square,
  Download,
  Bell,
  Eye,
  Menu
} from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import { 
  fetchTendersFastAPI,
  fetchBiddersFastAPI, 
  fetchBidderDashboardFastAPI, 
  uploadBidderDocumentFastAPI, 
  triggerVerificationFastAPI, 
  submitOfficerDecisionFastAPI, 
  sendBidderNotificationFastAPI,
  fetchAuditLogsFastAPI,
  fetchMockGovRecordsFastAPI,
  runBatchVerificationFastAPI,
  generateClarificationNoticeLLMFastAPI,
  sendClarificationNoticeFastAPI,
  simulateBidderResponseFastAPI
} from '../../services/gemFastapiService';

/**
 * Compliance Score Circular Gauge
 * Progress ring color strictly adheres to Risk Level colors:
 * - Low Risk = Emerald/Teal (#059669)
 * - Medium Risk = Amber/Gold (#D97706)
 * - High Risk = Red/Crimson (#DC2626)
 */
const CircularScoreGauge = ({ score, riskLevel, size = 68, strokeWidth = 6 }) => {
  const safeScore = Number.isFinite(score) ? score : 0;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, safeScore)) / 100) * circumference;

  let strokeColor = '#059669'; // Emerald (Low Risk)
  let labelColor = '#059669';
  
  if (riskLevel?.toLowerCase() === 'high' || safeScore < 50) {
    strokeColor = '#DC2626'; // Red (High Risk)
    labelColor = '#DC2626';
  } else if (riskLevel?.toLowerCase() === 'medium' || (safeScore >= 50 && safeScore < 80)) {
    strokeColor = '#D97706'; // Amber (Medium Risk)
    labelColor = '#D97706';
  }

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="font-['IBM_Plex_Mono'] font-bold text-xs leading-none" style={{ color: labelColor }}>
          {Math.round(safeScore)}%
        </span>
      </div>
    </div>
  );
};

// 10 Steps for Live Verification Sequence Animation
const VERIFICATION_ANIMATION_STEPS = [
  "Extracting document text & OCR parsing...",
  "Querying Udyam / MSME Statutory Portal...",
  "Querying GSTN Tax Network & Filing History...",
  "Querying Income Tax & PAN Database...",
  "Querying MCA21 Corporate Registry...",
  "Querying EPFO & ESIC Compliance Records...",
  "Querying Startup India & NSIC Portal...",
  "Cross-referencing DigiLocker & Blacklist Registry...",
  "Running AI cross-verification analysis & soft mismatch check...",
  "Calculating weighted compliance score & risk classification..."
];

// Quick Select Clarification Templates
const CLARIFICATION_TEMPLATES = [
  "Please clarify the discrepancy in [field name]",
  "Please resubmit [document name] — current version appears expired/invalid",
  "Please provide additional supporting proof for [specific claim]",
  "Please confirm continuity of [registration type] status during tender period"
];

export default function GeMComplianceDashboard() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [tenders, setTenders] = useState([]);
  const [selectedTenderRef, setSelectedTenderRef] = useState('GEM/2026/B/894120');
  const [bidders, setBidders] = useState([]);
  const [selectedBidderId, setSelectedBidderId] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [batchVerifying, setBatchVerifying] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Main View Mode: 'DASHBOARD' | 'MOCK_GOV_DB' | 'AUDIT_TRAIL'
  const [viewMode, setViewMode] = useState('DASHBOARD');

  // Score Calculation Breakdown Toggle
  const [showScoreBreakdown, setShowScoreBreakdown] = useState(false);

  // Live Verification Processing Animation Modal State
  const [animatingVerification, setAnimatingVerification] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Side-by-Side Inspector Modal State
  const [selectedResult, setSelectedResult] = useState(null);

  // Decision Lock Confirmation Toast State
  const [decisionToast, setDecisionToast] = useState(null);

  // Post-Decision Notification Modal State
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [activeDecisionId, setActiveDecisionId] = useState(null);
  const [notificationText, setNotificationText] = useState('');
  const [sendingNotification, setSendingNotification] = useState(false);

  // Qualification Summary Report Modal State
  const [showSummaryReportModal, setShowSummaryReportModal] = useState(false);

  // Clarification Request Workflow Modal State
  const [showClarificationModal, setShowClarificationModal] = useState(false);
  const [selectedIssueIds, setSelectedIssueIds] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [officerNote, setOfficerNote] = useState('');
  const [deadlineDays, setDeadlineDays] = useState(3);
  const [noticePreviewText, setNoticePreviewText] = useState('');
  const [generatingNotice, setGeneratingNotice] = useState(false);
  const [sendingNotice, setSendingNotice] = useState(false);

  // Simulated Bidder Response Modal State
  const [showSimulateModal, setShowSimulateModal] = useState(false);
  const [simulatedResponseText, setSimulatedResponseText] = useState('');
  const [simulatedDocName, setSimulatedDocName] = useState('GST_Clearance_Undertaking.pdf');
  const [submittingSimulation, setSubmittingSimulation] = useState(false);
  const [scoreUpdateResult, setScoreUpdateResult] = useState(null);

  // Document Upload Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadDocType, setUploadDocType] = useState('UDYAM');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Officer Decision Modal State
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [decisionType, setDecisionType] = useState('MARK_QUALIFIED');
  const [officerRemarks, setOfficerRemarks] = useState('');
  const [submittingDecision, setSubmittingDecision] = useState(false);

  // Mock Government Database inspection state
  const [mockGovRecords, setMockGovRecords] = useState([]);
  const [auditTrailLogs, setAuditTrailLogs] = useState([]);

  useEffect(() => {
    loadTendersAndBidders();
  }, []);

  const loadTendersAndBidders = async () => {
    try {
      setLoading(true);
      const tenderData = await fetchTendersFastAPI();
      setTenders(tenderData);
      const initialTender = tenderData.length > 0 ? tenderData[0].tender_ref : 'GEM/2026/B/894120';
      setSelectedTenderRef(initialTender);
      await loadBiddersForTender(initialTender);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadBiddersForTender = async (tenderRef) => {
    try {
      setLoading(true);
      const data = await fetchBiddersFastAPI(tenderRef);
      setBidders(data);
      if (data.length > 0) {
        setSelectedBidderId(data[0].id);
        await loadBidderDashboard(data[0].id);
      } else {
        setSelectedBidderId(null);
        setDashboardData(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTenderChange = async (tenderRef) => {
    setSelectedTenderRef(tenderRef);
    await loadBiddersForTender(tenderRef);
  };

  const loadBidderDashboard = async (bidderId) => {
    try {
      setLoading(true);
      const data = await fetchBidderDashboardFastAPI(bidderId);
      setDashboardData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBidder = async (bidderId) => {
    setSelectedBidderId(bidderId);
    await loadBidderDashboard(bidderId);
  };

  // Run Sequential 10-Step Verification Animation
  const startVerificationSequence = (onComplete) => {
    setAnimatingVerification(true);
    setCurrentStepIndex(0);

    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step < VERIFICATION_ANIMATION_STEPS.length) {
        setCurrentStepIndex(step);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setAnimatingVerification(false);
          if (onComplete) onComplete();
        }, 500);
      }
    }, 400);
  };

  const handleRunReVerification = async () => {
    if (!selectedBidderId) return;
    try {
      setVerifying(true);
      startVerificationSequence(async () => {
        await triggerVerificationFastAPI(selectedBidderId);
        await loadBidderDashboard(selectedBidderId);
        await loadBiddersForTender(selectedTenderRef);
        setVerifying(false);
      });
    } catch (err) {
      console.error(err);
      setVerifying(false);
    }
  };

  const handleBatchVerify = async () => {
    try {
      setBatchVerifying(true);
      startVerificationSequence(async () => {
        await runBatchVerificationFastAPI();
        await loadBiddersForTender(selectedTenderRef);
        if (selectedBidderId) {
          await loadBidderDashboard(selectedBidderId);
        }
        setBatchVerifying(false);
      });
    } catch (err) {
      console.error(err);
      setBatchVerifying(false);
    }
  };

  // Open Clarification Request Modal
  const handleOpenClarificationModal = () => {
    if (!dashboardData) return;
    const flagged = (dashboardData.verification_results || [])
      .filter(r => ['MISMATCH', 'NEEDS_REVIEW', 'EXPIRED', 'MISSING'].includes(r.status))
      .map(r => `${r.portal_name}: ${r.title} (${r.details})`);
    
    setSelectedIssueIds(flagged);
    setOfficerNote('');
    setSelectedTemplate('');
    setDeadlineDays(3);
    setNoticePreviewText('');
    setShowClarificationModal(true);
  };

  const handleToggleIssue = (issue) => {
    if (selectedIssueIds.includes(issue)) {
      setSelectedIssueIds(selectedIssueIds.filter(i => i !== issue));
    } else {
      setSelectedIssueIds([...selectedIssueIds, issue]);
    }
  };

  const handleSelectTemplate = (tpl) => {
    setSelectedTemplate(tpl);
    if (tpl) {
      setOfficerNote(prev => prev ? `${prev}\nNote: ${tpl}` : `Note: ${tpl}`);
    }
  };

  const handleGenerateLLMNotice = async () => {
    if (!selectedBidderId) return;
    try {
      setGeneratingNotice(true);
      const res = await generateClarificationNoticeLLMFastAPI(selectedBidderId, {
        selected_issues: selectedIssueIds,
        template_type: selectedTemplate || "CUSTOM",
        officer_note: officerNote,
        deadline_days: deadlineDays
      });
      setNoticePreviewText(res.notice_text);
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingNotice(false);
    }
  };

  const handleSendClarificationNotice = async () => {
    if (!selectedBidderId || !noticePreviewText) return;
    try {
      setSendingNotice(true);
      await sendClarificationNoticeFastAPI(selectedBidderId, {
        issues_referenced: selectedIssueIds,
        template_type: selectedTemplate || "CUSTOM",
        officer_note: officerNote,
        generated_notice_text: noticePreviewText,
        deadline_days: deadlineDays
      });
      setShowClarificationModal(false);
      await loadBidderDashboard(selectedBidderId);
      await loadBiddersForTender(selectedTenderRef);
    } catch (err) {
      console.error(err);
    } finally {
      setSendingNotice(false);
    }
  };

  const handleOpenSimulateModal = () => {
    setSimulatedResponseText("We have submitted the updated GST return filing undertaking and verified Udyam renewal certificate confirming continuous MSME eligibility.");
    setSimulatedDocName("GST_Undertaking_and_Udyam_Renewal.pdf");
    setShowSimulateModal(true);
  };

  const handleSubmitSimulation = async () => {
    if (!selectedBidderId) return;
    try {
      setSubmittingSimulation(true);
      const res = await simulateBidderResponseFastAPI(selectedBidderId, {
        response_text: simulatedResponseText,
        resolve_issues: true,
        uploaded_doc_name: simulatedDocName
      });
      setScoreUpdateResult(res);
      setShowSimulateModal(false);
      await loadBidderDashboard(selectedBidderId);
      await loadBiddersForTender(selectedTenderRef);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingSimulation(false);
    }
  };

  const handleOpenDecisionModal = (type) => {
    setDecisionType(type);
    setOfficerRemarks('');
    setShowDecisionModal(true);
  };

  const handleSubmitDecision = async () => {
    if (!selectedBidderId) return;
    try {
      setSubmittingDecision(true);
      const res = await submitOfficerDecisionFastAPI(selectedBidderId, decisionType, officerRemarks);
      setShowDecisionModal(false);

      setDecisionToast(`Decision ${decisionType.replace('MARK_', '')} recorded and snapshot logged at ${res.decided_at}`);

      if (res.decision_id && res.notification_text) {
        setActiveDecisionId(res.decision_id);
        setNotificationText(res.notification_text);
        setShowNotificationModal(true);
      }

      await loadBidderDashboard(selectedBidderId);
      await loadBiddersForTender(selectedTenderRef);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingDecision(false);
    }
  };

  const handleSendNotification = async () => {
    if (!activeDecisionId || !notificationText) return;
    try {
      setSendingNotification(true);
      await sendBidderNotificationFastAPI(activeDecisionId, notificationText);
      setShowNotificationModal(false);
      setDecisionToast("Notification dispatched & audit event created successfully.");
    } catch (err) {
      console.error(err);
    } finally {
      setSendingNotification(false);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBidderId || !uploadFile) return;
    try {
      setUploading(true);
      await uploadBidderDocumentFastAPI(selectedBidderId, uploadFile, uploadDocType);
      setShowUploadModal(false);
      setUploadFile(null);
      await handleRunReVerification();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const loadMockGovDB = async () => {
    try {
      setLoading(true);
      const data = await fetchMockGovRecordsFastAPI();
      setMockGovRecords(data);
      setViewMode('MOCK_GOV_DB');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadAuditTrail = async () => {
    try {
      setLoading(true);
      const data = await fetchAuditLogsFastAPI();
      setAuditTrailLogs(data);
      setViewMode('AUDIT_TRAIL');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Bidder Sorting & Filtering
  const riskOrder = { 'high': 0, 'medium': 1, 'low': 2 };
  const statusOrder = {
    'MARK_DISQUALIFIED': 0,
    'AWAITING_CLARIFICATION': 1,
    'PENDING': 2,
    'MARK_QUALIFIED': 3
  };

  const filteredBidders = bidders.filter(b => {
    const matchesSearch = b.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.gem_seller_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.gstin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (b.udyam_number && b.udyam_number.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRisk = riskFilter === 'ALL' || (b.risk_level.toUpperCase() === riskFilter.toUpperCase());

    let matchesStatus = true;
    if (statusFilter === 'QUALIFIED') matchesStatus = b.decision_status === 'MARK_QUALIFIED';
    else if (statusFilter === 'DISQUALIFIED') matchesStatus = b.decision_status === 'MARK_DISQUALIFIED';
    else if (statusFilter === 'AWAITING') matchesStatus = b.decision_status === 'AWAITING_CLARIFICATION';
    else if (statusFilter === 'PENDING') matchesStatus = b.decision_status === 'PENDING';

    return matchesSearch && matchesRisk && matchesStatus;
  }).sort((a, b) => {
    const riskA = riskOrder[a.risk_level?.toLowerCase()] ?? 2;
    const riskB = riskOrder[b.risk_level?.toLowerCase()] ?? 2;
    if (riskA !== riskB) return riskA - riskB;
    const statusA = statusOrder[a.decision_status] ?? 2;
    const statusB = statusOrder[b.decision_status] ?? 2;
    return statusA - statusB;
  });

  const bidder = dashboardData?.bidder;
  const assessment = dashboardData?.latest_assessment;
  const results = dashboardData?.verification_results || [];

  // Parse Action Items JSON
  let actionItems = [];
  if (assessment?.action_items_json) {
    try {
      actionItems = JSON.parse(assessment.action_items_json);
    } catch (e) {
      actionItems = [];
    }
  }

  // STATUS BADGES: Fully rounded pills (rounded-full) with solid contrast
  const renderDecisionBadge = (status, primaryReason) => {
    switch (status) {
      case 'MARK_QUALIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white bg-emerald-600 shadow-2xs" title="Forwarded for Technical & Financial Evaluation">
            <CheckCircle2 className="w-3 h-3 stroke-[2.5]" /> Qualified
          </span>
        );
      case 'MARK_DISQUALIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white bg-rose-600 shadow-2xs" title={primaryReason || "Technical Bid Disqualified"}>
            <XCircle className="w-3 h-3 stroke-[2.5]" /> Disqualified
          </span>
        );
      case 'AWAITING_CLARIFICATION':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white bg-amber-600 shadow-2xs">
            <Clock className="w-3 h-3 stroke-[2.5]" /> Awaiting
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-300">
            Pending
          </span>
        );
    }
  };

  // RISK LEVEL BADGES: High contrast jewel-tones
  const renderRiskBadge = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'low':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" /> Low Risk
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5]" /> Medium Risk
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-300">
            <XCircle className="w-3.5 h-3.5 stroke-[2.5]" /> High Risk
          </span>
        );
      default:
        return <span className="text-[10px] text-slate-500 font-semibold">Unverified</span>;
    }
  };

  // CARD LEFT-BORDER COLORS: Defined 5px solid jewel tones
  const getRiskBorderClass = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'low':
        return 'border-l-[5px] border-l-emerald-600';
      case 'medium':
        return 'border-l-[5px] border-l-amber-500';
      case 'high':
        return 'border-l-[5px] border-l-rose-600';
      default:
        return 'border-l-[5px] border-l-slate-400';
    }
  };

  const renderCheckBadge = (status) => {
    switch (status) {
      case 'VERIFIED':
        return <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700"><Check className="w-3.5 h-3.5 stroke-[3]" /> Verified</span>;
      case 'EXEMPTED':
        return <span className="flex items-center gap-1 text-[11px] font-bold text-indigo-700"><Sparkles className="w-3.5 h-3.5" /> Exempted</span>;
      case 'NEEDS_REVIEW':
        return <span className="flex items-center gap-1 text-[11px] font-bold text-amber-700"><AlertTriangle className="w-3.5 h-3.5" /> Review</span>;
      case 'MISMATCH':
        return <span className="flex items-center gap-1 text-[11px] font-bold text-amber-700"><AlertTriangle className="w-3.5 h-3.5" /> Mismatch</span>;
      case 'EXPIRED':
        return <span className="flex items-center gap-1 text-[11px] font-bold text-orange-700"><Clock className="w-3.5 h-3.5" /> Expired</span>;
      case 'DEBARRED':
      case 'MISSING':
        return <span className="flex items-center gap-1 text-[11px] font-bold text-rose-700"><X className="w-3.5 h-3.5 stroke-[3]" /> {status.charAt(0) + status.slice(1).toLowerCase()}</span>;
      default:
        return <span className="text-[11px] text-slate-400 font-medium">—</span>;
    }
  };

  const selectedTender = tenders.find(t => t.tender_ref === selectedTenderRef);

  return (
    <div className="flex h-screen bg-slate-100/80 text-slate-900 font-['IBM_Plex_Sans'] overflow-hidden selection:bg-indigo-600 selection:text-white">
      <Sidebar mobileOpen={mobileNavOpen} onMobileClose={() => setMobileNavOpen(false)} />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-slate-100/70">
        
        {/* Consolidated Executive Header with Live System Status */}
        <header className="bg-white border-b border-slate-200/90 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-20 gap-3 shadow-xs">
          <div className="flex items-center gap-3.5">
            {/* Hamburger Button for Mobile */}
            <button
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden p-2 -ml-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition shrink-0"
              aria-label="Open mobile navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white flex items-center justify-center shadow-md shadow-indigo-600/25 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-bold tracking-tight text-slate-900 truncate">
                GeM Bid Compliance Verification Console
              </h1>
            </div>
          </div>
        </header>

        {/* Active Tender Executive Toolbar */}
        <div className="bg-white/80 backdrop-blur-xs border-b border-slate-200/90 px-4 sm:px-8 py-3 flex flex-col md:flex-row items-start md:items-center justify-between text-xs gap-3 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3.5 w-full md:w-auto">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-200/70 text-indigo-700 font-bold text-[11px] uppercase tracking-wider shrink-0">
              <FileSpreadsheet className="w-3.5 h-3.5" /> Active Tender
            </div>

            <div className="relative flex-1 md:w-96">
              <select
                value={selectedTenderRef}
                onChange={(e) => handleTenderChange(e.target.value)}
                className="w-full appearance-none bg-slate-50 hover:bg-white border border-slate-300 hover:border-slate-400 rounded-lg pl-3 pr-8 py-1.5 text-xs font-['IBM_Plex_Mono'] font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-2xs outline-none transition cursor-pointer"
              >
                {tenders.map(t => (
                  <option key={t.tender_ref} value={t.tender_ref}>
                    [{t.tender_ref}] {t.tender_name} ({t.bidders_count} Bidders)
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-2 text-slate-500 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end w-full md:w-auto gap-3">
            {selectedTender && (
              <div className="flex items-center gap-2 text-[11px] font-['IBM_Plex_Mono']">
                <span className="hidden sm:inline-block px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                  {selectedTender.category}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-900 font-bold border border-indigo-200">
                  Budget: {selectedTender.budget}
                </span>
              </div>
            )}

            {/* Primary Action Button — Modern Gradient, Elevated */}
            <button
              onClick={handleBatchVerify}
              disabled={batchVerifying}
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-lg flex items-center gap-2 transition-all duration-150 shadow-md shadow-indigo-600/25 active:scale-95 disabled:opacity-50 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${batchVerifying ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{batchVerifying ? 'Verifying All Bidders...' : 'Re-Run Batch Triage'}</span>
              <span className="sm:hidden">{batchVerifying ? '...' : 'Triage'}</span>
            </button>
          </div>
        </div>

        {/* Decision Lock Confirmation Toast */}
        {decisionToast && (
          <div className="bg-indigo-50 border-b border-indigo-200 px-4 sm:px-8 py-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="font-medium text-indigo-900">{decisionToast}</span>
            </div>
            <button onClick={() => setDecisionToast(null)} className="text-indigo-600 hover:text-indigo-900">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Score Updated Banner */}
        {scoreUpdateResult && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 sm:px-8 py-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-900 font-bold">Score Updated:</span>
              <span className="font-['IBM_Plex_Mono'] text-slate-600">{scoreUpdateResult.score_before}%</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className="font-['IBM_Plex_Mono'] font-bold text-emerald-700">{scoreUpdateResult.score_after}%</span>
              <span className="text-emerald-700 text-[10px] font-bold">(+{scoreUpdateResult.score_diff}%)</span>
            </div>
            <button onClick={() => setScoreUpdateResult(null)} className="text-emerald-700 hover:text-emerald-900">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 space-y-6 max-w-[1700px] mx-auto w-full">
          
          {/* VIEW MODE 1: MAIN COMPLIANCE DASHBOARD */}
          {viewMode === 'DASHBOARD' && (
            <>
              {/* Multi-Bidder Triage Overview */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-5 shadow-sm">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-600" /> {selectedTender?.tender_name}
                    </h2>
                    <p className="text-[11px] font-['IBM_Plex_Mono'] text-slate-500 mt-0.5">
                      {filteredBidders.length} bids evaluated · Ref: <span className="text-slate-800 font-semibold">{selectedTenderRef}</span>
                    </p>
                  </div>

                  {/* Search + Micro-Labeled Segmented Risk & Status Filters */}
                  <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    <div className="relative flex-1 sm:w-56">
                      <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search bidder, GSTIN..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 font-['IBM_Plex_Mono'] font-medium placeholder:text-slate-400 shadow-2xs outline-none transition"
                      />
                    </div>

                    {/* Micro-labeled Risk Filter */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
                        RISK:
                      </span>
                      <div className="flex items-center border border-slate-300 bg-slate-100 p-0.5 rounded-xl shadow-2xs">
                        {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map(r => (
                          <button
                            key={r}
                            onClick={() => setRiskFilter(r)}
                            className={`px-2.5 py-1 text-[10px] transition rounded-lg ${
                              riskFilter === r 
                                ? 'bg-white text-slate-900 shadow-xs font-bold' 
                                : 'text-slate-600 hover:text-slate-900 font-semibold'
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Micro-labeled Decision Status Filter */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
                        STATUS:
                      </span>
                      <div className="flex items-center border border-slate-300 bg-slate-100 p-0.5 rounded-xl shadow-2xs">
                        {[
                          { label: 'All', value: 'ALL' },
                          { label: 'Qualified', value: 'QUALIFIED' },
                          { label: 'Disqualified', value: 'DISQUALIFIED' },
                          { label: 'Awaiting', value: 'AWAITING' }
                        ].map(s => (
                          <button
                            key={s.value}
                            onClick={() => setStatusFilter(s.value)}
                            className={`px-2.5 py-1 text-[10px] transition rounded-lg ${
                              statusFilter === s.value 
                                ? 'bg-white text-slate-900 shadow-xs font-bold' 
                                : 'text-slate-600 hover:text-slate-900 font-semibold'
                            }`}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Triage Grid & Persistent Tender Stats Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  
                  {/* Bidder Cards Grid (Left 8 or 9 cols on wide screens) */}
                  <div className="lg:col-span-8 xl:col-span-9 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredBidders.map(b => {
                      const isSelected = selectedBidderId === b.id;
                      const riskBorderClass = getRiskBorderClass(b.risk_level);
                      const isHighRisk = b.risk_level?.toLowerCase() === 'high';

                      return (
                        <div
                          key={b.id}
                          onClick={() => handleSelectBidder(b.id)}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 relative flex flex-col justify-between ${riskBorderClass} ${
                            isSelected
                              ? 'bg-gradient-to-b from-indigo-50/60 to-white border-indigo-400 ring-2 ring-indigo-500/30 shadow-lg shadow-indigo-500/10 -translate-y-1'
                              : isHighRisk
                                ? 'bg-gradient-to-b from-rose-50/40 to-white border-rose-200 hover:border-rose-300 hover:shadow-md hover:-translate-y-0.5'
                                : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5'
                          }`}
                        >
                          <div className="space-y-3.5">
                            <div className="flex items-start justify-between gap-2.5">
                              <div className="space-y-1 min-w-0">
                                <h3 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1 group-hover:text-indigo-600">
                                  {b.company_name}
                                </h3>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] font-mono text-slate-500 font-medium">
                                    {b.gem_seller_id}
                                  </span>
                                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded">
                                    {b.enterprise_type || 'General'}
                                  </span>
                                </div>
                              </div>

                              {/* Circular progress gauge */}
                              <CircularScoreGauge score={b.score} riskLevel={b.risk_level} size={50} strokeWidth={4.5} />
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-slate-100/80">
                              {renderRiskBadge(b.risk_level)}
                              {renderDecisionBadge(b.decision_status, b.officer_remarks)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Persistent Right-Side Tender Summary Panel on Wide Screens */}
                  <div className="lg:col-span-4 xl:col-span-3 bg-gradient-to-b from-slate-50 to-white border border-slate-200/90 rounded-2xl p-5 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                          <TrendingUp className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Tender Summary</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                        {bidders.length} Bidders
                      </span>
                    </div>

                    {/* Mini Stats Bar */}
                    <div className="grid grid-cols-2 gap-2.5 text-center font-['IBM_Plex_Mono'] text-xs">
                      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                        <span className="text-[9px] uppercase font-sans text-slate-500 font-bold block">Avg Score</span>
                        <span className="text-xl font-bold font-mono text-emerald-600 block mt-0.5">
                          {bidders.length > 0 ? Math.round(bidders.reduce((acc, b) => acc + (b.score || 0), 0) / bidders.length) : 0}%
                        </span>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                        <span className="text-[9px] uppercase font-sans text-slate-500 font-bold block">Pending</span>
                        <span className="text-xl font-bold font-mono text-amber-600 block mt-0.5">
                          {bidders.filter(b => b.decision_status === 'PENDING' || b.decision_status === 'AWAITING_CLARIFICATION').length}
                        </span>
                      </div>
                    </div>

                    {/* Risk Breakdown Progress Meters */}
                    <div className="space-y-3 pt-2 border-t border-slate-200/80">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Risk Distribution</span>
                      
                      <div className="space-y-2 text-[11px]">
                        {/* Low Risk Bar */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-emerald-700 flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" /> Low Risk
                            </span>
                            <span className="font-mono text-slate-800 font-bold">
                              {bidders.filter(b => b.risk_level?.toLowerCase() === 'low').length} ({bidders.length > 0 ? Math.round((bidders.filter(b => b.risk_level?.toLowerCase() === 'low').length / bidders.length) * 100) : 0}%)
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                              style={{ width: `${bidders.length > 0 ? (bidders.filter(b => b.risk_level?.toLowerCase() === 'low').length / bidders.length) * 100 : 0}%` }}
                            />
                          </div>
                        </div>

                        {/* Medium Risk Bar */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-amber-700 flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full bg-amber-500 inline-block" /> Medium Risk
                            </span>
                            <span className="font-mono text-slate-800 font-bold">
                              {bidders.filter(b => b.risk_level?.toLowerCase() === 'medium').length} ({bidders.length > 0 ? Math.round((bidders.filter(b => b.risk_level?.toLowerCase() === 'medium').length / bidders.length) * 100) : 0}%)
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-amber-500 h-full rounded-full transition-all duration-500" 
                              style={{ width: `${bidders.length > 0 ? (bidders.filter(b => b.risk_level?.toLowerCase() === 'medium').length / bidders.length) * 100 : 0}%` }}
                            />
                          </div>
                        </div>

                        {/* High Risk Bar */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-rose-700 flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full bg-rose-500 inline-block" /> High Risk
                            </span>
                            <span className="font-mono text-slate-800 font-bold">
                              {bidders.filter(b => b.risk_level?.toLowerCase() === 'high').length} ({bidders.length > 0 ? Math.round((bidders.filter(b => b.risk_level?.toLowerCase() === 'high').length / bidders.length) * 100) : 0}%)
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-rose-500 h-full rounded-full transition-all duration-500" 
                              style={{ width: `${bidders.length > 0 ? (bidders.filter(b => b.risk_level?.toLowerCase() === 'high').length / bidders.length) * 100 : 0}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Active Tender Meta */}
                    <div className="pt-3 border-t border-slate-200 text-[10px] font-['IBM_Plex_Mono'] text-slate-600 space-y-1 font-medium bg-slate-100/60 -mx-5 -mb-5 p-4 rounded-b-2xl">
                      <p className="flex justify-between">
                        <span className="text-slate-500">Category:</span>
                        <span className="text-slate-900 font-bold">{selectedTender?.category || 'General'}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-slate-500">Total Budget:</span>
                        <span className="text-slate-900 font-bold">{selectedTender?.budget || '—'}</span>
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* 2-Column Detailed Workspace Inspector */}
              {bidder && assessment && (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column */}
                  <div className="xl:col-span-5 space-y-4">
                    
                    {/* Bidder Summary Card */}
                    <div className={`bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-2xs ${getRiskBorderClass(assessment.risk_level)}`}>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <CircularScoreGauge score={assessment.score} riskLevel={assessment.risk_level} size={64} strokeWidth={6} />

                          <div className="space-y-1">
                            <h2 className="text-sm font-bold text-slate-900 leading-tight">{bidder.company_name}</h2>
                            <div className="flex items-center gap-2">
                              {renderRiskBadge(assessment.risk_level)}
                              {renderDecisionBadge(bidder.decision_status, bidder.officer_remarks)}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => setShowSummaryReportModal(true)}
                          className="bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-semibold p-2 rounded-lg border border-slate-300 transition flex items-center gap-1.5 shadow-2xs"
                          title="Download Qualification Summary Report"
                        >
                          <Download className="w-3.5 h-3.5 text-indigo-600" /> Report
                        </button>
                      </div>

                      {/* Key-Value Stats — Monospace */}
                      <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200 text-center font-['IBM_Plex_Mono']">
                        <div>
                          <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold block">GSTIN</span>
                          <span className="text-[11px] font-bold text-slate-900 truncate block mt-0.5">{bidder.gstin}</span>
                        </div>
                        <div className="border-x border-slate-200 px-1">
                          <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold block">PAN</span>
                          <span className="text-[11px] font-bold text-slate-900 block mt-0.5">{bidder.pan_number}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold block">Passed</span>
                          <span className="text-[11px] font-bold text-emerald-700 block mt-0.5">{assessment.passed_checks_count}/9</span>
                        </div>
                      </div>

                      {/* Score Breakdown */}
                      <div className="border-t border-slate-100 pt-3">
                        <button
                          onClick={() => setShowScoreBreakdown(!showScoreBreakdown)}
                          className="w-full flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 p-2.5 rounded-lg border border-slate-200 transition"
                        >
                          <span className="flex items-center gap-2">
                            <Calculator className="w-3.5 h-3.5 text-indigo-600" /> Score Breakdown
                          </span>
                          {showScoreBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>

                        {showScoreBreakdown && (
                          <div className="mt-2 p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                            <h4 className="text-[10px] font-bold text-slate-500 border-b border-slate-200 pb-2 uppercase tracking-wider">
                              Weighted Score Breakdown
                            </h4>

                            <div className="space-y-1.5">
                              {results.map((r, idx) => (
                                <div key={idx} className="flex items-center justify-between border-b border-slate-200/60 pb-1 text-[10px]">
                                  <span className="text-slate-700 font-medium">{r.portal_name}</span>
                                  <div className="flex items-center gap-3 font-['IBM_Plex_Mono']">
                                    <span className="text-slate-400 text-[9px]">wt:{r.weight}%</span>
                                    {renderCheckBadge(r.status)}
                                    <span className="font-bold text-emerald-700 w-10 text-right">+{r.points_earned}</span>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-200 font-['IBM_Plex_Mono'] text-xs">
                              <span className="font-bold text-slate-600">Total</span>
                              <span className="font-bold text-emerald-700">{assessment.score}%</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2 pt-1">
                        <button
                          onClick={() => setShowUploadModal(true)}
                          className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2"
                        >
                          <UploadCloud className="w-4 h-4 text-indigo-600" /> Upload Document (PDF Extractor)
                        </button>

                        <button
                          onClick={handleOpenSimulateModal}
                          className="w-full bg-amber-50 hover:bg-amber-100/80 text-amber-800 border border-amber-300 text-xs font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2"
                        >
                          <MessageSquare className="w-4 h-4 text-amber-600" /> Simulate Bidder Response
                        </button>
                      </div>
                    </div>

                    {/* Officer Action Card — Positioned above AI Risk Assessment */}
                    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3.5 shadow-2xs">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-indigo-600" />
                          <h3 className="text-xs font-bold text-slate-900">Officer Action</h3>
                        </div>
                        <span className="text-[9px] font-['IBM_Plex_Mono'] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          Human-in-the-loop
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600">
                        Review AI findings and select official action:
                      </p>

                      <div className="grid grid-cols-3 gap-2.5">
                        <button
                          onClick={() => handleOpenDecisionModal('MARK_QUALIFIED')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-2 rounded-lg transition flex items-center justify-center gap-1.5 shadow-2xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Qualify
                        </button>

                        <button
                          onClick={handleOpenClarificationModal}
                          className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2 px-2 rounded-lg transition flex items-center justify-center gap-1.5 shadow-2xs"
                        >
                          <HelpCircle className="w-3.5 h-3.5" /> Clarify
                        </button>

                        <button
                          onClick={() => handleOpenDecisionModal('MARK_DISQUALIFIED')}
                          className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-2 rounded-lg transition flex items-center justify-center gap-1.5 shadow-2xs"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Disqualify
                        </button>
                      </div>

                      {bidder.officer_remarks && (
                        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                          <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">Officer Remarks</span>
                          <p className="text-xs text-slate-700 italic font-['IBM_Plex_Mono']">{bidder.officer_remarks}</p>
                        </div>
                      )}
                    </div>

                    {/* AI Risk Assessment Panel */}
                    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3.5 shadow-2xs">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2 text-indigo-700 font-bold">
                          <Sparkles className="w-4 h-4 text-indigo-600" />
                          <span className="text-xs">AI Risk Assessment</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded text-[9px] font-['IBM_Plex_Mono'] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200">
                          {assessment.ai_recommendation_status?.replace('RECOMMEND_', '').charAt(0) + assessment.ai_recommendation_status?.replace('RECOMMEND_', '').slice(1).toLowerCase()}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {assessment.ai_recommendation_summary}
                      </p>

                      {actionItems.length > 0 && (
                        <div className="space-y-1.5 pt-2 border-t border-slate-100">
                          <span className="text-[9px] text-slate-400 block uppercase tracking-wider font-bold">Findings</span>
                          {actionItems.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Right Column: Statutory Portal Matrix */}
                  <div className="xl:col-span-7 space-y-4">
                    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-2xs">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div>
                          <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                            <Layers className="w-4 h-4 text-indigo-600" /> Statutory Portal Compliance Matrix
                          </h3>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            Click any portal to inspect side-by-side claim details
                          </p>
                        </div>
                        <span className="text-[10px] font-['IBM_Plex_Mono'] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          {results.filter(r => r.status === 'VERIFIED').length}/{results.length} verified
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {results.map((res, i) => (
                          <div
                            key={i}
                            onClick={() => setSelectedResult(res)}
                            className={`p-3.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-2xs transition cursor-pointer flex flex-col justify-between space-y-2 group bg-slate-50/60 ${
                              res.status === 'NEEDS_REVIEW' ? 'border-amber-300 bg-amber-50/40' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-semibold text-slate-700 group-hover:text-slate-900 transition">
                                {res.portal_name}
                              </span>
                              {renderCheckBadge(res.status)}
                            </div>

                            <p className="text-xs font-bold text-slate-900 leading-tight line-clamp-1">
                              {res.title}
                            </p>

                            <div className="text-[10px] font-['IBM_Plex_Mono'] text-slate-500 flex items-center justify-between pt-1">
                              <span className="truncate max-w-[200px]">{res.details}</span>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0 ml-1 transition" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </>
          )}

          {/* VIEW MODE 2: MOCK GOVERNMENT PORTAL DATABASE RECORDS */}
          {viewMode === 'MOCK_GOV_DB' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Database className="w-4 h-4 text-indigo-600" /> Government Databases (Simulated)
                  </h2>
                  <p className="text-[10px] font-['IBM_Plex_Mono'] text-slate-500 mt-0.5">
                    Udyam · GSTN · Income Tax · MCA21 · EPFO · ESIC · DigiLocker · CPPP Blacklist
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-700 border-collapse">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 text-[10px] uppercase tracking-wider">
                    <tr>
                      <th className="p-3">Portal</th>
                      <th className="p-3">Reg. No</th>
                      <th className="p-3">Bidder Name</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Expiry</th>
                      <th className="p-3">Metadata</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {mockGovRecords.map((rec, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-indigo-700">{rec.portal_name}</td>
                        <td className="p-3 font-['IBM_Plex_Mono'] text-slate-900">{rec.registration_number}</td>
                        <td className="p-3 font-semibold text-slate-900">{rec.bidder_name}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                            rec.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            rec.status === 'DEBARRED' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {rec.status}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500 font-['IBM_Plex_Mono'] text-[11px]">{rec.expiry_date || '—'}</td>
                        <td className="p-3 font-['IBM_Plex_Mono'] text-[10px] text-slate-500 max-w-xs truncate">{rec.additional_fields_json}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW MODE 3: AUDIT TRAIL LOGS */}
          {viewMode === 'AUDIT_TRAIL' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <History className="w-4 h-4 text-indigo-600" /> Audit Trail & Event Log
                  </h2>
                  <p className="text-[10px] font-['IBM_Plex_Mono'] text-slate-500 mt-0.5">
                    Immutable log of every verification, decision, and officer action
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {auditTrailLogs.map((log, i) => (
                  <div key={i} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start justify-between text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-indigo-700">{log.action}</span>
                        <span className="text-slate-300">·</span>
                        <span className="text-slate-600 font-medium">{log.performed_by}</span>
                      </div>
                      <p className="font-['IBM_Plex_Mono'] text-[11px] text-slate-500">{log.details_json}</p>
                    </div>

                    <span className="text-[10px] font-['IBM_Plex_Mono'] text-slate-500 shrink-0 bg-white px-2.5 py-1 rounded border border-slate-200">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Feature 2: Post-Decision Bidder Notification Dispatch Modal */}
      {showNotificationModal && bidder && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-indigo-600">
                <Bell className="w-5 h-5" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Auto-Generated Bidder Notification Preview
                </h3>
              </div>
              <button onClick={() => setShowNotificationModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-600 font-medium">
                Auto-drafted formal decision notice for: <strong className="text-slate-900">{bidder.company_name}</strong> (Tender Ref: {bidder.tender_ref}).
              </p>

              <textarea
                rows={8}
                value={notificationText}
                onChange={(e) => setNotificationText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 text-[11px] font-mono text-slate-900 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNotificationModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Skip Dispatch
              </button>
              <button
                onClick={handleSendNotification}
                disabled={sendingNotification}
                className="px-5 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs flex items-center gap-1.5"
              >
                {sendingNotification && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <Send className="w-3.5 h-3.5" /> Dispatch Official Notice & Log Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feature 4: Printable Qualification Summary Report Modal */}
      {showSummaryReportModal && bidder && assessment && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full p-8 shadow-2xl space-y-6 my-8 print:bg-white print:text-black">
            
            {/* Header Toolbar */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 print:hidden">
              <div className="flex items-center gap-2 text-indigo-600">
                <FileText className="w-5 h-5" />
                <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider">
                  Qualification Summary Report (Audit Copy)
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-2xs"
                >
                  <Printer className="w-3.5 h-3.5" /> Print / Export PDF Report
                </button>
                <button onClick={() => setShowSummaryReportModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Document Content Block */}
            <div className="space-y-6 font-sans">
              <div className="border-b-2 border-indigo-600 pb-4 flex justify-between items-start">
                <div>
                  <h1 className="text-lg font-bold text-slate-900 uppercase tracking-tight">GOVERNMENT e-MARKETPLACE (GeM)</h1>
                  <h2 className="text-sm font-semibold text-indigo-700">TECHNICAL BID COMPLIANCE AUDIT REPORT</h2>
                  <p className="text-xs text-slate-500 font-mono mt-1">Generated by AI Compliance Verification Engine</p>
                </div>
                <div className="text-right text-xs font-mono text-slate-500">
                  <p>Date: {new Date().toLocaleDateString()}</p>
                  <p>Ref: GEM/2026/AUDIT/{bidder.gem_seller_id}</p>
                </div>
              </div>

              {/* Key Details Grid */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="font-bold text-slate-500 uppercase block text-[10px]">Tender Details</span>
                  <p className="font-bold text-slate-900 mt-0.5">Ref: {bidder.tender_ref}</p>
                  <p className="text-slate-600">{bidder.tender_name}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-500 uppercase block text-[10px]">Bidder Information</span>
                  <p className="font-bold text-slate-900 mt-0.5">{bidder.company_name}</p>
                  <p className="text-slate-600 font-mono">GSTIN: {bidder.gstin} | PAN: {bidder.pan_number}</p>
                </div>
              </div>

              {/* Score & Risk Summary */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase">Compliance Score & Risk Rating</span>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-2xl font-bold text-emerald-700 font-mono">{assessment.score}%</span>
                    {renderRiskBadge(assessment.risk_level)}
                    {renderDecisionBadge(bidder.decision_status, bidder.officer_remarks)}
                  </div>
                </div>
                <div className="text-xs text-right font-mono text-slate-500">
                  <p>Passed Checks: <strong className="text-emerald-700">{assessment.passed_checks_count}</strong></p>
                  <p>Warning / Mismatches: <strong className="text-amber-700">{assessment.warning_checks_count}</strong></p>
                  <p>Failed / Debarred: <strong className="text-red-700">{assessment.failed_checks_count}</strong></p>
                </div>
              </div>

              {/* 10 Statutory Checklist Matrix */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase text-slate-900 tracking-wider">10 Statutory Portal Verification Matrix</h3>
                <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">Portal Name</th>
                        <th className="p-2.5">Check Title</th>
                        <th className="p-2.5">Status</th>
                        <th className="p-2.5">Weight</th>
                        <th className="p-2.5 text-right">Points</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {results.map((r, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold text-indigo-700">{r.portal_name}</td>
                          <td className="p-2.5 font-semibold text-slate-800">{r.title}</td>
                          <td className="p-2.5">{renderCheckBadge(r.status)}</td>
                          <td className="p-2.5 font-mono text-slate-500">{r.weight}%</td>
                          <td className="p-2.5 font-mono font-bold text-emerald-700 text-right">+{r.points_earned}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* AI Suggestion Summary */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                <span className="font-bold text-indigo-700 uppercase block">AI Verification Summary:</span>
                <p className="text-slate-700">{assessment.ai_recommendation_summary}</p>
              </div>

              {/* Officer Official Decision Signoff */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs font-mono">
                <div>
                  <span className="text-slate-500 uppercase font-bold block">Procurement Officer Final Call:</span>
                  <span className="font-bold text-slate-900 text-sm">{bidder.decision_status?.replace('MARK_', '')}</span>
                  {bidder.officer_remarks && <p className="text-slate-600 font-sans italic mt-1">{bidder.officer_remarks}</p>}
                </div>
                <div className="text-right text-slate-500">
                  <p>Decided By: Gov Procurement Officer</p>
                  <p>Timestamp: {new Date().toLocaleString()}</p>
                </div>
              </div>

              {/* Disclosure Footer */}
              <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-400 font-mono text-center leading-relaxed">
                Disclosure: This report was generated by the AI Compliance Verification Engine using simulated government portal data.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feature 1: Clarification Request Modal */}
      {showClarificationModal && bidder && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-amber-700 font-bold">
                <HelpCircle className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Request Official Clarification from Bidder
                </h3>
              </div>
              <button onClick={() => setShowClarificationModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-slate-600 font-medium">
                Drafting official clarification notice for: <strong className="text-slate-900">{bidder.company_name}</strong> (GSTIN: {bidder.gstin}).
              </p>

              {/* Pre-filled Flagged Issues Checkboxes */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900 block">Select Flagged Issues to Include in Notice:</label>
                <div className="space-y-2 max-h-48 overflow-y-auto p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                  {results.filter(r => ['MISMATCH', 'NEEDS_REVIEW', 'EXPIRED', 'MISSING'].includes(r.status)).map((res, idx) => {
                    const issueKey = `${res.portal_name}: ${res.title} (${res.details})`;
                    const isChecked = selectedIssueIds.includes(issueKey);
                    return (
                      <div
                        key={idx}
                        onClick={() => handleToggleIssue(issueKey)}
                        className={`p-2.5 rounded-lg border cursor-pointer transition flex items-start gap-2.5 ${
                          isChecked ? 'bg-indigo-50 border-indigo-300 text-slate-900' : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <span className="font-bold text-indigo-700">{res.portal_name}: </span>
                          <span className="font-semibold text-slate-900">{res.title}</span>
                          <p className="text-[10px] font-mono text-slate-500 mt-0.5">{res.details}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Select Template & Deadline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">Quick Select Template</label>
                  <select
                    value={selectedTemplate}
                    onChange={(e) => handleSelectTemplate(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 outline-none"
                  >
                    <option value="">-- Choose Template --</option>
                    {CLARIFICATION_TEMPLATES.map((tpl, i) => (
                      <option key={i} value={tpl}>{tpl}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">Response Deadline (Working Days)</label>
                  <select
                    value={deadlineDays}
                    onChange={(e) => setDeadlineDays(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 outline-none"
                  >
                    <option value={3}>3 Working Days (Default)</option>
                    <option value={5}>5 Working Days</option>
                    <option value={7}>7 Working Days</option>
                  </select>
                </div>
              </div>

              {/* Officer Note */}
              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">Officer Custom Note / Specific Instructions</label>
                <textarea
                  rows={2}
                  value={officerNote}
                  onChange={(e) => setOfficerNote(e.target.value)}
                  placeholder="Enter specific instructions or document resubmission guidelines..."
                  className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs font-medium text-slate-900 focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>

              {/* Generate Notice Action */}
              <button
                onClick={handleGenerateLLMNotice}
                disabled={generatingNotice}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-lg transition flex items-center justify-center gap-2 shadow-2xs disabled:opacity-50"
              >
                {generatingNotice ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Generate Official Notice via LLM Engine
              </button>

              {/* Notice Letter Preview Pane */}
              {noticePreviewText && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Notice Letter Preview (Editable):</span>
                    <span className="text-[10px] font-mono text-slate-500">Official Correspondence Format</span>
                  </div>

                  <textarea
                    rows={7}
                    value={noticePreviewText}
                    onChange={(e) => setNoticePreviewText(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-4 text-[11px] font-mono text-slate-900 focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowClarificationModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSendClarificationNotice}
                disabled={sendingNotice || !noticePreviewText}
                className="px-5 py-2 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-2xs flex items-center gap-1.5"
              >
                {sendingNotice && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <Send className="w-3.5 h-3.5" /> Send Notice & Set Awaiting Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feature 3: Demo Tool Simulate Bidder Response Modal */}
      {showSimulateModal && bidder && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-amber-700 font-bold">
                <MessageSquare className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Simulate Bidder Response (Demo Tool)
                </h3>
              </div>
              <button onClick={() => setShowSimulateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-600 font-medium">
                Simulating bidder submission from: <strong className="text-slate-900">{bidder.company_name}</strong>.
              </p>

              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">Bidder Clarification Response Text</label>
                <textarea
                  rows={3}
                  value={simulatedResponseText}
                  onChange={(e) => setSimulatedResponseText(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs font-medium text-slate-900 focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">Upload Corrected Document (Simulated PDF)</label>
                <input
                  type="text"
                  value={simulatedDocName}
                  onChange={(e) => setSimulatedDocName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-mono outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowSimulateModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitSimulation}
                disabled={submittingSimulation}
                className="px-5 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs flex items-center gap-1.5"
              >
                {submittingSimulation && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Submit Response & Re-Verify AI Engine
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Processing Animation Modal */}
      {animatingVerification && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-indigo-600">
                <Loader2 className="w-5 h-5 animate-spin" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Live AI Statutory Verification Pipeline
                </h3>
              </div>
              <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md border border-indigo-200 font-bold">
                {currentStepIndex + 1} / {VERIFICATION_ANIMATION_STEPS.length}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
              <div
                className="bg-indigo-600 h-full transition-all duration-300 ease-out"
                style={{ width: `${((currentStepIndex + 1) / VERIFICATION_ANIMATION_STEPS.length) * 100}%` }}
              />
            </div>

            {/* 10 Animated Step List */}
            <div className="space-y-2 text-xs font-mono">
              {VERIFICATION_ANIMATION_STEPS.map((stepText, idx) => {
                const isDone = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-2.5 rounded-lg transition-all ${
                      isCurrent ? 'bg-indigo-50 border border-indigo-200 text-indigo-900 font-bold' :
                      isDone ? 'text-emerald-700 font-semibold' : 'text-slate-400 opacity-60'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-indigo-600 animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                    )}
                    <span className="truncate">{stepText}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Claim vs Portal Inspection Modal */}
      {selectedResult && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Eye className="w-4 h-4 text-indigo-600" /> Side-by-Side Claim vs Govt Database Record
              </h3>
              <button onClick={() => setSelectedResult(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-xs font-bold text-indigo-700">{selectedResult.portal_name}</span>
                {renderCheckBadge(selectedResult.status)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Left Column: Submitted Claim */}
                <div className="p-4 rounded-xl bg-indigo-50/40 border border-indigo-100 space-y-2">
                  <div className="border-b border-indigo-100/80 pb-2">
                    <span className="text-xs font-bold uppercase text-indigo-900 tracking-wider flex items-center gap-1.5 font-mono">
                      📄 Submitted Bidder Claim
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200 min-h-[90px] shadow-xs">
                    {(() => {
                      const raw = selectedResult.claimed_data_json;
                      if (!raw || raw === 'null' || raw === '{}' || raw === '""' || raw === '{"oem_auth": false}') {
                        return (
                          <div className="space-y-1.5 text-xs text-slate-700">
                            <p className="font-semibold text-rose-700 flex items-center gap-1">
                              ⚠️ Certificate / Document Not Attached
                            </p>
                            <p className="text-slate-600">• Submitted Bid PDF contains no OEM Authorization (MAF) letter.</p>
                            <p className="text-slate-600">• Declaration: Incomplete under Tender Clause 4.2.</p>
                          </div>
                        );
                      }
                      try {
                        const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
                        if (typeof parsed === 'object' && parsed !== null) {
                          return (
                            <div className="space-y-1 text-xs">
                              {Object.entries(parsed).map(([k, v]) => {
                                const label = k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                                const displayVal = v === false ? 'Not Provided / Missing' : v === true ? 'Yes / Declared' : String(v);
                                return (
                                  <div key={k} className="flex items-start gap-1.5 text-slate-700">
                                    <span className="text-indigo-600 font-semibold">• {label}:</span>
                                    <span className="font-medium text-slate-900">{displayVal}</span>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        }
                        return <p className="text-xs text-slate-800">{String(parsed)}</p>;
                      } catch {
                        return <p className="text-xs text-slate-800">{raw}</p>;
                      }
                    })()}
                  </div>
                </div>

                {/* Right Column: Official Registry Record */}
                <div className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-100 space-y-2">
                  <div className="border-b border-emerald-100/80 pb-2">
                    <span className="text-xs font-bold uppercase text-emerald-900 tracking-wider flex items-center gap-1.5 font-mono">
                      🏛️ Official Govt Registry Record
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200 min-h-[90px] shadow-xs">
                    {(() => {
                      const raw = selectedResult.matched_record_json;
                      if (!raw || raw === 'null' || raw === '{}' || raw === '""') {
                        return (
                          <div className="space-y-1.5 text-xs text-slate-700">
                            <p className="font-semibold text-slate-800 flex items-center gap-1">
                              🔍 National Registry Search:
                            </p>
                            <p className="text-slate-600">• No verified OEM Authorization record found in DigiLocker / OEM database.</p>
                            <p className="text-slate-600">• Direct Manufacturer Status: Unverified / Nil.</p>
                          </div>
                        );
                      }
                      try {
                        const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
                        if (typeof parsed === 'object' && parsed !== null) {
                          return (
                            <div className="space-y-1 text-xs">
                              {Object.entries(parsed).map(([k, v]) => {
                                const label = k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                                return (
                                  <div key={k} className="flex items-start gap-1.5 text-slate-700">
                                    <span className="text-emerald-700 font-semibold">• {label}:</span>
                                    <span className="font-medium text-slate-900">{String(v)}</span>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        }
                        return <p className="text-xs text-slate-800">{String(parsed)}</p>;
                      } catch {
                        return <p className="text-xs text-slate-800">{raw}</p>;
                      }
                    })()}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                  AI Statutory Finding & Clause Reference:
                </span>
                <p className="text-xs text-slate-900 font-semibold leading-relaxed">{selectedResult.details}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedResult(null)}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-900 text-white hover:bg-black"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-indigo-600" /> Upload Compliance Document (PDF)
              </h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Document Category</label>
                <select
                  value={uploadDocType}
                  onChange={(e) => setUploadDocType(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 outline-none"
                >
                  <option value="UDYAM">Udyam Registration Certificate</option>
                  <option value="GST">GST Registration Certificate</option>
                  <option value="PAN">PAN Card</option>
                  <option value="EPFO_ESIC">EPFO / ESIC Registration</option>
                  <option value="STARTUP_INDIA">Startup India Recognition Cert</option>
                  <option value="NSIC">NSIC Single Point Cert</option>
                  <option value="OEM_AUTH">OEM Authorization Letter (MAF)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Select PDF File</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-700 focus:outline-none"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !uploadFile}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs flex items-center gap-1.5"
                >
                  {uploading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  Upload & Extract Claims
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Procurement Officer Decision Modal */}
      {showDecisionModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-amber-600" /> Confirm Procurement Officer Decision
              </h3>
              <button onClick={() => setShowDecisionModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-600 font-medium">
                Submitting officer decision for: <strong className="text-slate-900">{bidder?.company_name}</strong>.
              </p>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Decision Action</label>
                <select
                  value={decisionType}
                  onChange={(e) => setDecisionType(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 outline-none"
                >
                  <option value="MARK_QUALIFIED">MARK QUALIFIED - Permit to Financial Opening</option>
                  <option value="REQUEST_CLARIFICATION">REQUEST CLARIFICATION - Issue GeM Notice</option>
                  <option value="MARK_DISQUALIFIED">MARK DISQUALIFIED - Reject Technical Submission</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Officer Justification / Remarks</label>
                <textarea
                  rows={3}
                  value={officerRemarks}
                  onChange={(e) => setOfficerRemarks(e.target.value)}
                  placeholder="Enter official audit remarks or statutory rules referenced..."
                  className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs font-medium text-slate-900 focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDecisionModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitDecision}
                disabled={submittingDecision}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-2xs flex items-center gap-1.5"
              >
                {submittingDecision && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                Confirm & Log Decision
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
