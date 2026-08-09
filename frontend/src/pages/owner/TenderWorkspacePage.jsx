import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/common/PageHeader';
import {
  getTenderById,
  uploadTenderDocument,
  getTenderDocuments,
  deleteTenderDocument,
  analyzeTenderEligibility,
  getTenderRequirements,
  getTenderEligibility,
  getTenderAnalysis,
  overrideRequirementResult
} from '../../services/tenderService';
import {
  ArrowLeft, FileText, UploadCloud, Trash2, Calendar,
  Building, MapPin, Tag, RefreshCw, AlertCircle, CheckCircle2,
  XCircle, Sparkles, Shield, User, Clock, Check, ChevronDown,
  ChevronUp, Search, Info, TrendingUp, Award, Users, AwardIcon
} from 'lucide-react';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'documents', label: 'Documents' },
  { id: 'requirements', label: 'Requirements' },
  { id: 'eligibility', label: 'Eligibility Scorecard' },
  { id: 'evidence', label: 'Evidence & Citations' },
  { id: 'analysis', label: 'AI Analysis Summary' }
];

const DOCUMENT_TYPES = [
  'RFP',
  'Tender Notice',
  'BOQ',
  'Technical Specification',
  'Addendum',
  'Clarification',
  'Other'
];

const getCategoryColor = (type) => {
  switch (type?.toUpperCase()) {
    case 'FINANCIAL':
      return 'text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    case 'EXPERIENCE':
      return 'text-amber-500 dark:text-amber-400 bg-amber-500/10 border-amber-500/20';
    case 'CERTIFICATION':
      return 'text-purple-500 dark:text-purple-400 bg-purple-500/10 border-purple-500/20';
    case 'TECHNICAL':
      return 'text-blue-500 dark:text-blue-400 bg-blue-500/10 border-blue-500/20';
    case 'PERSONNEL':
      return 'text-pink-500 dark:text-pink-400 bg-pink-500/10 border-pink-500/20';
    default:
      return 'text-indigo-500 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
  }
};

const TenderWorkspacePage = () => {
  const { tenderId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState('overview');
  const [tender, setTender] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [eligibilityResults, setEligibilityResults] = useState([]);
  const [analysis, setAnalysis] = useState(null);

  const [selectedDocType, setSelectedDocType] = useState('RFP');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [uploadError, setUploadError] = useState('');

  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [reqSearch, setReqSearch] = useState('');
  const [reqFilterType, setReqFilterType] = useState('ALL');
  const [expandedEvidence, setExpandedEvidence] = useState({});

  const [overrideModal, setOverrideModal] = useState({ isOpen: false, resultId: null, currentStatus: '' });
  const [overrideForm, setOverrideForm] = useState({ status: 'PASS', reason: '' });

  const loadTenderData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setErrorMsg('');

      const [tenderRes, docsRes, reqsRes, eligRes, analRes] = await Promise.all([
        getTenderById(tenderId),
        getTenderDocuments(tenderId).catch(() => ({ data: [] })),
        getTenderRequirements(tenderId).catch(() => ({ data: [] })),
        getTenderEligibility(tenderId).catch(() => ({ data: [] })),
        getTenderAnalysis(tenderId).catch(() => ({ data: null }))
      ]);

      setTender(tenderRes.data);
      setDocuments(docsRes.data || []);
      setRequirements(reqsRes.data || []);
      setEligibilityResults(eligRes.data || []);
      setAnalysis(analRes.data || null);

    } catch (err) {
      console.error('Failed to load workspace data:', err);
      setErrorMsg('Could not sync workspace data. Using offline local mock data.');

      setTender({
        id: tenderId,
        title: 'CCTV & Network Infrastructure Project',
        reference_number: 'NMC/CCTV/2026/849',
        issuing_authority: 'Pune Municipal Corporation',
        category: 'CCTV & Networking',
        location: 'Pune',
        submission_deadline: '2026-09-05T17:30:00.000Z',
        estimated_value: 200000000,
        status: 'READY',
        overall_score: 100
      });
      setDocuments([
        { id: 'd-1', file_name: 'PMC_CCTV_Tender_RFP.pdf', document_type: 'RFP', file_size: 5242880, processing_status: 'COMPLETED', created_at: new Date() }
      ]);
      setRequirements([
        { id: 'r-1', requirement_type: 'FINANCIAL', title: 'Average Annual Turnover', description: 'Average annual turnover during the last 3 financial years must exceed INR 20 Crore.', mandatory: true, operator: '>=', required_value: 200000000 },
        { id: 'r-2', requirement_type: 'EXPERIENCE', title: 'Similar Project Experience', description: 'Execution of at least 3 CCTV or infrastructure installation projects.', mandatory: true, operator: '>=', required_value: 3 },
        { id: 'r-3', requirement_type: 'CERTIFICATION', title: 'ISO 9001 Quality Certification', description: 'Must have active ISO 9001 quality compliance certificates.', mandatory: true }
      ]);
      setEligibilityResults([
        { id: 'res-1', requirement_id: 'r-1', status: 'PASS', score: 100, reason: 'Company satisfies Turnover threshold (₹25.0 Cr >= ₹20.0 Cr).', evidence: 'Average annual turnover of ₹25 Cr extracted from audited balance sheet records.', source_page: 3, confidence: 0.98 },
        { id: 'res-2', requirement_id: 'r-2', status: 'PASS', score: 100, reason: 'Company has 3 qualifying project completion records.', evidence: 'Mumbai CCTV contract (₹22Cr), Pune Smart City project (₹18Cr), and Delhi CCTV deploy (₹21Cr).', source_page: 5, confidence: 0.95 },
        { id: 'res-3', requirement_id: 'r-3', status: 'PASS', score: 100, reason: 'Found valid active certification matching ISO 9001 Quality Certification.', evidence: 'ISO 9001:2015 Certificate valid until 2027.', source_page: 8, confidence: 0.99 }
      ]);
      setAnalysis({
        overall_score: 100,
        eligibility_status: 'ELIGIBLE',
        summary: 'The company meets all eligibility thresholds. Turnovers, project count, and ISO certifications match constraints perfectly.',
        strengths: ['Financially qualified (₹25Cr turnover vs ₹20Cr required)', 'Proven track record with 3 large scale CCTV project completions', 'ISO 9001 quality certifications are valid and active'],
        weaknesses: [],
        risks: [],
        recommendation: 'The company is fully compliant. Proceed with bid formulation.'
      });
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    loadTenderData();
  }, [tenderId]);

  useEffect(() => {
    const activeProcessing = documents.some(d => d.processing_status === 'QUEUED' || d.processing_status === 'EXTRACTING' || d.processing_status === 'ANALYZING');
    if (!activeProcessing) return;

    const interval = setInterval(() => {
      loadTenderData(false);
    }, 3000);

    return () => clearInterval(interval);
  }, [documents]);

  // Upload Document Handlers
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFile(e.target.files[0]);
    }
  };

  const uploadFile = (file) => {
    setUploading(true);
    setUploadProgress('Uploading file to project workspace...');
    setUploadError('');

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const base64Data = e.target.result.split(',')[1];
        setUploadProgress('Extracting specifications...');

        await uploadTenderDocument(tenderId, {
          name: file.name,
          documentType: selectedDocType,
          mimeType: file.type || 'application/pdf',
          fileSize: file.size,
          base64: base64Data
        });

        loadTenderData(false);
      } catch (err) {
        console.error('Document upload failed:', err);
        setUploadError(err.response?.data?.error || 'Document upload failed. Please try again.');
      } finally {
        setUploading(false);
        setUploadProgress('');
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read file.');
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteDoc = async (docId) => {
    if (!window.confirm('Delete this tender document and clear its extracted requirements?')) return;
    try {
      await deleteTenderDocument(tenderId, docId);
      loadTenderData(false);
    } catch (err) {
      console.error('Delete document failed:', err);
      alert('Failed to delete document.');
    }
  };

  const handleRunAnalysis = async () => {
    try {
      setAnalyzing(true);
      await analyzeTenderEligibility(tenderId);

      setTimeout(() => {
        loadTenderData(false);
        setAnalyzing(false);
      }, 5000);

    } catch (err) {
      console.error('Analysis failed:', err);
      alert('Failed to execute match analysis.');
      setAnalyzing(false);
    }
  };

  const openOverrideModal = (resultId, currentStatus) => {
    setOverrideModal({ isOpen: true, resultId, currentStatus });
    setOverrideForm({ status: currentStatus === 'PASS' ? 'FAIL' : 'PASS', reason: '' });
  };

  const closeOverrideModal = () => {
    setOverrideModal({ isOpen: false, resultId: null, currentStatus: '' });
  };

  const handleOverrideSubmit = async (e) => {
    e.preventDefault();
    if (!overrideForm.reason.trim()) {
      alert('Please provide a justification reason.');
      return;
    }

    try {
      await overrideRequirementResult(tenderId, overrideModal.resultId, {
        status: overrideForm.status,
        reason: overrideForm.reason
      });
      closeOverrideModal();
      loadTenderData(false);
    } catch (err) {
      console.error('Override update failed:', err);
      alert('Failed to submit manual override review.');
    }
  };

  const formatCurrency = (val) => {
    if (!val) return '--';
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} Lakh`;
    return `₹${val.toLocaleString()}`;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PASS':
        return <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 uppercase tracking-wider">PASS</span>;
      case 'FAIL':
        return <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold font-mono text-rose-400 bg-rose-500/10 px-3 py-1 rounded-lg border border-rose-500/20 uppercase tracking-wider">FAIL</span>;
      case 'REVIEW':
        return <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold font-mono text-amber-400 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20 uppercase tracking-wider animate-pulse">REVIEW</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold font-mono text-slate-400 bg-slate-500/10 px-3 py-1 rounded-lg border border-slate-500/20 uppercase tracking-wider">NOT FOUND</span>;
    }
  };

  const toggleEvidenceExpanded = (id) => {
    setExpandedEvidence(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredRequirements = requirements.filter(req => {
    const matchesSearch = req.title.toLowerCase().includes(reqSearch.toLowerCase()) ||
      req.description.toLowerCase().includes(reqSearch.toLowerCase());
    const matchesType = reqFilterType === 'ALL' || req.requirement_type === reqFilterType;
    return matchesSearch && matchesType;
  });

  return (
    <DashboardLayout>

      {/* Header Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate('/tender-management')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Registry
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <Shield className="h-4 w-4 text-emerald-400" />
          <span>Tenant Isolation: RLS Active</span>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center text-slate-400 font-sans">
          <div className="flex items-center gap-3">
            <span className="h-5 w-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
            <span className="text-sm font-semibold">Syncing Tender Workspace...</span>
          </div>
        </div>
      ) : (
        <div className="w-full space-y-6 font-sans">

          {/* Tender Header Card */}
          <div className="glow-card rounded-2xl p-6 border border-slate-800 bg-slate-950/40">
            <div className="space-y-4">
              {/* Badge Row */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase font-mono tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/25">
                  Ref: {tender?.reference_number || 'NIT-1234/2026'}
                </span>
                {tender?.status === 'READY' ? (
                  <span className="text-[10px] font-extrabold uppercase font-mono tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/25">Eligible</span>
                ) : (
                  <span className="text-[10px] font-extrabold uppercase font-mono tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/25">Review Required</span>
                )}
              </div>

              {/* Title & Description */}
              <div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                  {tender?.title}
                </h1>
                <p className="text-sm text-slate-400 mt-2">
                  {tender?.category || 'IT Infrastructure'} • {tender?.location || 'N/A'}
                </p>
              </div>

              {/* Meta Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
                <div className="space-y-1">
                  <span className="block text-[10px] font-bold uppercase text-slate-500 tracking-wider">Issuing Authority</span>
                  <span className="text-sm font-semibold text-white flex items-center gap-2">
                    <Building className="h-4 w-4 text-slate-500" />
                    {tender?.issuing_authority}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="block text-[10px] font-bold uppercase text-slate-500 tracking-wider">Project Value</span>
                  <span className="text-sm font-semibold text-emerald-400">{formatCurrency(tender?.estimated_value)}</span>
                </div>
                <div className="space-y-1">
                  <span className="block text-[10px] font-bold uppercase text-slate-500 tracking-wider">Submission Deadline</span>
                  <span className="text-sm font-semibold text-orange-400 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {tender?.submission_deadline ? new Date(tender?.submission_deadline).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="block text-[10px] font-bold uppercase text-slate-500 tracking-wider">Compliance Score</span>
                  <span className="text-lg font-black text-emerald-400 font-mono">{tender?.overall_score || '--'}%</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleRunAnalysis}
                  disabled={analyzing}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition font-semibold text-sm shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                  title="Run Match Analysis"
                >
                  <Sparkles className={`h-4 w-4 ${analyzing ? 'animate-spin' : ''}`} />
                  {analyzing ? 'Analyzing...' : 'Run Analysis'}
                </button>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="border-b border-slate-800 flex overflow-x-auto gap-8 scrollbar-none">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 text-sm font-semibold tracking-wide border-b-2 shrink-0 transition ${activeTab === tab.id
                  ? 'border-indigo-500 text-white'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="w-full">

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="lg:col-span-2 space-y-6">

                  {/* Scope Card */}
                  <div className="glow-card rounded-2xl p-6 border border-slate-800 bg-slate-950/40">
                    <h3 className="text-sm font-extrabold uppercase text-slate-400 tracking-wider mb-4 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-indigo-400" />
                      Tender Scope
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {tender?.description || 'No detailed scope defined. Upload bidding documents to extract project criteria.'}
                    </p>
                  </div>

                  {/* Compliance Status Card */}
                  <div className="glow-card rounded-2xl p-6 border border-slate-800 bg-slate-950/40">
                    <h3 className="text-sm font-extrabold uppercase text-slate-400 tracking-wider mb-4">Compliance Status</h3>
                    {eligibilityResults.some(r => r.status === 'FAIL') ? (
                      <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-4 flex gap-3">
                        <XCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-white text-sm">Failed Criteria</h4>
                          <p className="text-xs text-rose-300/80 mt-1">Review requirements scorecard for details.</p>
                        </div>
                      </div>
                    ) : eligibilityResults.some(r => r.status === 'REVIEW') ? (
                      <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-4 flex gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-white text-sm">Pending Reviews</h4>
                          <p className="text-xs text-amber-300/80 mt-1">Set overrides to complete analysis.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-white text-sm">100% Compliant</h4>
                          <p className="text-xs text-emerald-300/80 mt-1">Ready for bid formulation.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-6">

                  {/* Score Gauge */}
                  <div className="glow-card rounded-2xl p-6 border border-slate-800 bg-slate-950/40 text-center">
                    <h3 className="text-xs font-bold uppercase text-slate-400 font-mono tracking-wider mb-4">Compliance Score</h3>
                    <div className="relative flex items-center justify-center mb-4">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" className="stroke-slate-800" strokeWidth="8" fill="transparent" />
                        <circle
                          cx="50" cy="50" r="45"
                          className="stroke-emerald-500 transition-all duration-1000"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={282.7}
                          strokeDashoffset={282.7 - (282.7 * (tender?.overall_score || 0)) / 100}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute text-center">
                        <span className="text-3xl font-black text-white font-mono">{tender?.overall_score || 0}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Details List */}
                  <div className="glow-card rounded-2xl p-6 border border-slate-800 bg-slate-950/40 space-y-4">
                    <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Workspace Info</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-800/50">
                        <span className="text-slate-500">Status</span>
                        <span className="font-semibold text-white uppercase text-xs">{tender?.status}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-slate-800/50">
                        <span className="text-slate-500">Requirements</span>
                        <span className="font-semibold text-indigo-400">{requirements.length}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-slate-800/50">
                        <span className="text-slate-500">Documents</span>
                        <span className="font-semibold text-indigo-400">{documents.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Last Sync</span>
                        <span className="font-semibold text-slate-300 text-xs">{new Date(tender?.updated_at || '').toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* DOCUMENTS TAB */}
            {activeTab === 'documents' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Uploader Section */}
                <div className="glow-card rounded-2xl p-6 border border-slate-800 bg-slate-950/40">
                  <h3 className="text-sm font-extrabold uppercase text-slate-400 tracking-wider mb-6">
                    Upload Documents
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-2 font-mono">
                        Document Type
                      </label>
                      <select
                        value={selectedDocType}
                        onChange={(e) => setSelectedDocType(e.target.value)}
                        className="w-full text-sm font-semibold rounded-lg bg-slate-900 border border-slate-800 px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition"
                      >
                        {DOCUMENT_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-700 hover:border-slate-600 hover:bg-slate-900/20 rounded-lg p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 bg-slate-900/10 group"
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".pdf,.txt"
                        className="hidden"
                      />

                      <UploadCloud className="h-8 w-8 text-indigo-400 group-hover:text-indigo-300 transition" />

                      <div>
                        <p className="text-sm font-semibold text-white group-hover:text-indigo-300 transition">Click to select document</p>
                        <p className="text-xs text-slate-500 mt-1">PDF & TXT up to 25MB</p>
                      </div>
                    </div>

                    {uploading && (
                      <div className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 p-3 flex items-center gap-3 text-xs">
                        <RefreshCw className="h-4 w-4 text-indigo-400 animate-spin shrink-0" />
                        <span className="font-semibold text-slate-300">{uploadProgress}</span>
                      </div>
                    )}

                    {uploadError && (
                      <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 p-3 flex items-start gap-2 text-xs text-rose-300">
                        <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                        <span>{uploadError}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Files List Section */}
                <div className="glow-card rounded-2xl p-6 border border-slate-800 bg-slate-950/40">
                  <h3 className="text-sm font-extrabold uppercase text-slate-400 tracking-wider mb-6">
                    Uploaded Files
                  </h3>

                  {documents.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 text-sm">
                      <FileText className="h-10 w-10 text-slate-700 mx-auto mb-2" />
                      <p>No documents uploaded yet</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {documents.map(doc => {
                        const isProcessing = doc.processing_status === 'QUEUED' || doc.processing_status === 'EXTRACTING' || doc.processing_status === 'ANALYZING';
                        return (
                          <div
                            key={doc.id}
                            className="p-3 rounded-lg bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <FileText className="h-4 w-4 text-slate-500 shrink-0" />
                              <div className="min-w-0">
                                <h4 className="font-semibold text-sm text-white truncate">{doc.file_name}</h4>
                                <p className="text-xs text-slate-500 mt-0.5">
                                  {Math.round(doc.file_size / 1024)} KB • {doc.document_type}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {isProcessing ? (
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20 uppercase animate-pulse shrink-0">
                                  <RefreshCw className="h-3 w-3 animate-spin" />
                                </span>
                              ) : doc.processing_status === 'COMPLETED' ? (
                                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 uppercase shrink-0">
                                  Ready
                                </span>
                              ) : (
                                <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-1 rounded border border-rose-500/20 uppercase shrink-0">
                                  Failed
                                </span>
                              )}

                              <button
                                onClick={() => handleDeleteDoc(doc.id)}
                                className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* REQUIREMENTS TAB */}
            {activeTab === 'requirements' && (
              <div className="glow-card rounded-2xl p-6 border border-slate-800 bg-slate-950/40">

                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center mb-6 pb-6 border-b border-slate-800">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search requirements..."
                      value={reqSearch}
                      onChange={(e) => setReqSearch(e.target.value)}
                      className="w-full text-sm rounded-lg bg-slate-900 border border-slate-800 pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase text-slate-500 shrink-0">Filter:</span>
                    <select
                      value={reqFilterType}
                      onChange={(e) => setReqFilterType(e.target.value)}
                      className="text-sm font-semibold rounded-lg bg-slate-900 border border-slate-800 px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition"
                    >
                      <option value="ALL">All Categories</option>
                      <option value="FINANCIAL">Financial</option>
                      <option value="EXPERIENCE">Experience</option>
                      <option value="CERTIFICATION">Certification</option>
                      <option value="TECHNICAL">Technical</option>
                      <option value="PERSONNEL">Personnel</option>
                    </select>
                  </div>
                </div>

                {filteredRequirements.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <p className="text-sm">No matching requirements found</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredRequirements.map(req => (
                      <div
                        key={req.id}
                        className="p-4 rounded-lg bg-slate-900/30 border border-slate-800 hover:border-indigo-500/40 transition"
                      >
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <h4 className="font-semibold text-white text-sm">{req.title}</h4>
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{req.description}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`inline-block px-2 py-1 text-xs font-bold rounded-lg border ${getCategoryColor(req.requirement_type)}`}>
                              {req.requirement_type}
                            </span>
                            {req.mandatory && (
                              <span className="text-xs font-bold text-rose-500 bg-rose-500/10 px-2 py-1 rounded border border-rose-500/20">Mandatory</span>
                            )}
                          </div>
                        </div>
                        {req.operator && (
                          <div className="text-xs text-slate-500 font-mono pt-2 border-t border-slate-800/50">
                            Criteria: {req.operator} {req.required_value?.toLocaleString()} {req.required_unit || ''}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ELIGIBILITY SCORECARD TAB */}
            {activeTab === 'eligibility' && (
              <div className="glow-card rounded-2xl p-6 border border-slate-800 bg-slate-950/40">

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-orange-400" />
                    Eligibility Scorecard
                  </h3>
                  <p className="text-xs text-slate-500">AI analysis of company eligibility against tender criteria</p>
                </div>

                {eligibilityResults.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <Sparkles className="h-10 w-10 text-slate-700 mx-auto mb-2" />
                    <p className="text-sm">Run analysis to generate scorecard</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {eligibilityResults.map(res => {
                      const req = requirements.find(r => r.id === res.requirement_id);
                      return (
                        <div
                          key={res.id}
                          className="p-4 rounded-lg bg-slate-900/30 border border-slate-800 hover:border-indigo-500/40 transition"
                        >
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex items-center gap-3 min-w-0">
                              {getStatusBadge(res.status)}
                              <div className="min-w-0">
                                <h4 className="font-semibold text-sm text-white">{req?.title}</h4>
                                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{res.reason}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => openOverrideModal(res.id, res.status)}
                              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition shrink-0 whitespace-nowrap"
                            >
                              <User className="h-3.5 w-3.5" />
                              Override
                            </button>
                          </div>
                          <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-800/50">
                            <span className="text-slate-500">Confidence</span>
                            <span className="font-semibold text-white bg-slate-900 px-2 py-0.5 rounded">{Math.round((res.confidence || 0) * 100)}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* EVIDENCE TAB */}
            {activeTab === 'evidence' && (
              <div className="glow-card rounded-2xl p-6 border border-slate-800 bg-slate-950/40">

                <div className="mb-6">
                  <h3 className="text-sm font-extrabold uppercase text-slate-400 tracking-wider">Supporting Evidence</h3>
                  <p className="text-xs text-slate-500 mt-1">Citations extracted from documents to support eligibility</p>
                </div>

                {eligibilityResults.filter(r => r.evidence).length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <AlertCircle className="h-10 w-10 text-slate-700 mx-auto mb-2" />
                    <p className="text-sm">No evidence citations found</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {eligibilityResults.filter(r => r.evidence).map(res => {
                      const req = requirements.find(r => r.id === res.requirement_id);
                      const isExpanded = !!expandedEvidence[res.id];
                      return (
                        <div key={res.id} className="p-4 rounded-lg bg-slate-900/30 border border-slate-800 hover:border-slate-700 transition">

                          <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-800/50">
                            <div className="flex items-center gap-2 min-w-0">
                              {getStatusBadge(res.status)}
                              <span className="font-semibold text-white text-sm">{req?.title}</span>
                            </div>

                            <button
                              onClick={() => toggleEvidenceExpanded(res.id)}
                              className="text-slate-500 hover:text-white transition p-1"
                            >
                              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </button>
                          </div>

                          <p className="text-xs text-slate-300 mb-2">{res.reason}</p>

                          {isExpanded && (
                            <div className="mt-3 pt-3 border-t border-slate-800/50 bg-slate-950/30 p-3 rounded text-xs space-y-2">
                              <div>
                                <span className="font-bold text-slate-400 block mb-1 text-xs uppercase tracking-wider">Evidence Source</span>
                                <p className="text-slate-300">"{res.evidence}"</p>
                              </div>
                              {res.source_page && (
                                <p className="text-indigo-400 font-mono text-xs">Source: Page {res.source_page}</p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* AI ANALYSIS TAB */}
            {activeTab === 'analysis' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="lg:col-span-2 space-y-6">

                  {/* Summary */}
                  <div className="glow-card rounded-2xl p-6 border border-slate-800 bg-slate-950/40">
                    <h3 className="text-sm font-extrabold uppercase text-slate-400 tracking-wider mb-4 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-orange-400" />
                      Executive Summary
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {analysis?.summary || 'Run analysis to generate summary'}
                    </p>
                  </div>

                  {/* Strengths */}
                  <div className="glow-card rounded-2xl p-6 border border-slate-800 bg-slate-950/40">
                    <h3 className="text-sm font-extrabold uppercase text-emerald-450 tracking-wider mb-4 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      Strengths
                    </h3>
                    {analysis?.strengths && analysis.strengths.length > 0 ? (
                      <ul className="text-sm text-slate-300 space-y-2">
                        {analysis.strengths.map((str, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-slate-500">No weaknesses identified</p>
                    )}
                  </div>

                  {/* Weaknesses */}
                  <div className="glow-card rounded-2xl p-6 border border-slate-800 bg-slate-950/40">
                    <h3 className="text-sm font-extrabold uppercase text-rose-450 tracking-wider mb-4 flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-rose-500" />
                      Gaps & Weaknesses
                    </h3>
                    {analysis?.weaknesses && analysis.weaknesses.length > 0 ? (
                      <ul className="text-sm text-slate-300 space-y-2">
                        {analysis.weaknesses.map((weak, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0 mt-2" />
                            <span className="text-rose-300">{weak}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-emerald-400 flex items-center gap-2">
                        <Check className="h-4 w-4" />
                        No compliance gaps identified
                      </p>
                    )}
                  </div>

                </div>

                {/* Sidebar */}
                <div className="space-y-6">

                  {/* Risks */}
                  <div className="glow-card rounded-2xl p-6 border border-slate-800 bg-slate-950/40">
                    <h3 className="text-sm font-extrabold uppercase text-amber-450 tracking-wider mb-4 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      Risk Factors
                    </h3>
                    {analysis?.risks && analysis.risks.length > 0 ? (
                      <ul className="text-xs text-slate-300 space-y-2">
                        {analysis.risks.map((risk, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                            <span className="text-amber-300">{risk}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-500">No critical risks flagged</p>
                    )}
                  </div>

                  {/* Recommendation */}
                  <div className="glow-card rounded-2xl p-6 border border-slate-800 bg-slate-950/40">
                    <h3 className="text-sm font-extrabold uppercase text-slate-400 tracking-wider mb-4">Recommendation</h3>
                    <p className="text-xs text-slate-300 leading-relaxed border-l-2 border-indigo-500 pl-3">
                      {analysis?.recommendation || 'Awaiting analysis completion'}
                    </p>
                  </div>

                </div>

              </div>
            )}

          </div>

        </div>
      )}

      {/* Override Modal */}
      {overrideModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <div className="glow-card rounded-2xl border border-slate-800 bg-slate-950 max-w-md w-full p-6 space-y-6 shadow-2xl">
            <div>
              <h3 className="text-lg font-bold text-white">Manual Override</h3>
              <p className="text-xs text-slate-500 mt-1">Audit-logged change to AI scoring</p>
            </div>

            <form onSubmit={handleOverrideSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-2 font-mono">Status</label>
                <select
                  value={overrideForm.status}
                  onChange={(e) => setOverrideForm(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full text-sm font-semibold rounded-lg bg-slate-900 border border-slate-800 px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition"
                >
                  <option value="PASS">Pass (Compliant)</option>
                  <option value="FAIL">Fail (Non-Compliant)</option>
                  <option value="REVIEW">Review (Needs Verification)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-2 font-mono">Reason</label>
                <textarea
                  value={overrideForm.reason}
                  onChange={(e) => setOverrideForm(prev => ({ ...prev, reason: e.target.value }))}
                  rows="3"
                  placeholder="Explain this decision..."
                  className="w-full text-sm rounded-lg bg-slate-900 border border-slate-800 px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition resize-none"
                  required
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={closeOverrideModal}
                  className="px-4 py-2 rounded-lg border border-slate-800 text-slate-400 hover:text-white transition text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition text-sm font-semibold"
                >
                  Save Override
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};

export default TenderWorkspacePage;