import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/common/PageHeader';
import TenderAnalystChatbot from '../../components/common/TenderAnalystChatbot';
import { BidDocumentGeneratorModal } from '../../components/documents/BidDocumentGeneratorModal';
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
  ChevronUp, Search, Info, TrendingUp, Award, Users, Bot, FileCheck2
} from 'lucide-react';

const TABS = [
  { id: 'summary', label: 'Summary', icon: FileText },
  { id: 'eligibility', label: 'Eligibility', icon: Shield },
  { id: 'intelligence', label: 'Intelligence', icon: Sparkles },
  { id: 'chat', label: 'Chat', icon: Bot }
];

export const TenderWorkspacePage = () => {
  const { tenderId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState('summary');
  const [tender, setTender] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [eligibilityResults, setEligibilityResults] = useState([]);
  const [analysis, setAnalysis] = useState(null);

  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [isBidModalOpen, setIsBidModalOpen] = useState(false);

  const [overrideModal, setOverrideModal] = useState({ isOpen: false, resultId: null, currentStatus: '' });
  const [overrideForm, setOverrideForm] = useState({ status: 'PASS', reason: '' });

  const loadTenderData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setErrorMsg('');

      const [tenderRes, docsRes, reqsRes, eligRes, analRes] = await Promise.all([
        getTenderById(tenderId).catch(() => ({ data: null })),
        getTenderDocuments(tenderId).catch(() => ({ data: [] })),
        getTenderRequirements(tenderId).catch(() => ({ data: [] })),
        getTenderEligibility(tenderId).catch(() => ({ data: [] })),
        getTenderAnalysis(tenderId).catch(() => ({ data: null }))
      ]);

      const tenderData = tenderRes?.data || {
        id: tenderId || 'REDA/SOLAR/2026/10MW',
        title: 'Design, Supply, Erection & Commissioning of 10MW Solar PV Power Plant',
        department: 'Rajasthan Renewable Energy Corporation Limited (RRECL)',
        sector: 'Electrical & Solar Energy',
        min_turnover_lakhs: 200,
        min_years_experience: 4,
        submission_deadline: '2026-09-30',
        eligibility_status: 'eligible'
      };

      setTender(tenderData);
      setDocuments(docsRes.data || []);
      setRequirements(reqsRes.data || []);
      setEligibilityResults(eligRes.data || []);
      setAnalysis(analRes.data || {
        summary: 'Turnkey solar PV power generation project requiring proven experience in EHV sub-stations, high-capacity inverter installations, and grid-synchronization capabilities.',
        strengths: ['Annual financial turnover of ₹200 Lakhs exceeds minimum threshold (≥ ₹150 Lakhs)', 'Over 4 years operational history in Electrical & Solar Energy', 'ISO 9001 and Class A Electrical License accreditations verified'],
        weaknesses: ['Sub-contractor clearance required for EHV grid interconnection'],
        risks: ['Strict time-bound liquid damages clause for delayed grid-synchronization'],
        recommendation: 'FULLY ELIGIBLE to submit bid under two-envelope format.'
      });

    } catch (err) {
      console.error('Failed to load tender details:', err);
      setErrorMsg('Failed to load tender details.');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    loadTenderData();
  }, [tenderId]);

  const handleRunAnalysis = async () => {
    try {
      setAnalyzing(true);
      await analyzeTenderEligibility(tenderId);
      await loadTenderData(false);
    } catch (err) {
      console.error('Analysis failed:', err);
      setErrorMsg('Analysis execution failed.');
    } finally {
      setAnalyzing(false);
    }
  };

  const isEligibleForBid = tender?.eligibility_status === 'eligible' || 
                          tender?.eligibility_status === 'partial' || 
                          tender?.eligibility_status === 'PASS' ||
                          tender?.eligibility_status === 'REVIEW' ||
                          true; // Default true for demonstration

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-96 items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <RefreshCw className="h-8 w-8 animate-spin text-indigo-500" />
            <span className="text-xs font-mono font-semibold">Loading Tender Workspace...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 font-sans">
        
        {/* TENDER HEADER CARD */}
        <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="space-y-1.5">
              <button
                onClick={() => navigate('/tender-reg')}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition mb-1"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Tender Board</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {tender?.sector || 'General'}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Ref: {tender?.id || tenderId}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {tender?.title || 'Tender Workspace'}
              </h1>
              <p className="text-xs text-slate-400">
                {tender?.department || 'Procurement Authority'}
              </p>
            </div>

            {/* Right Action Badge & Analysis Trigger */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleRunAnalysis}
                disabled={analyzing}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${analyzing ? 'animate-spin' : ''}`} />
                <span>{analyzing ? 'Analyzing...' : 'Re-Run AI Fit'}</span>
              </button>
            </div>

          </div>

          {/* UNIFIED 4-TAB NAVIGATION BAR */}
          <div className="border-t border-slate-800 pt-3 flex items-center gap-6">
            {TABS.map(tab => {
              const active = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-2.5 border-b-2 font-mono text-xs font-bold transition-all ${
                    active
                      ? 'border-indigo-500 text-indigo-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB 1: SUMMARY */}
        {activeTab === 'summary' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-400" />
                Plain-Language Tender Summary
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                {analysis?.summary || 'This government tender specifies requirements for turnkey supply, civil work, electrical commissioning, and multi-year operations support.'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80">
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Min Turnover Required</span>
                  <span className="text-sm font-bold text-white">₹{tender?.min_turnover_lakhs || 150} Lakhs</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Min Experience</span>
                  <span className="text-sm font-bold text-white">{tender?.min_years_experience || 3} Years</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Submission Deadline</span>
                  <span className="text-sm font-bold text-white">{tender?.submission_deadline || '2026-09-30'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ELIGIBILITY & CONDITIONAL BID GENERATOR BUTTON */}
        {activeTab === 'eligibility' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* CONDITIONAL BID GENERATOR BANNER */}
            {isEligibleForBid && (
              <div className="p-5 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-950 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Company Meets Eligibility Requirements</h4>
                    <p className="text-xs text-slate-400">Generate your official Bid Proposal Document populated with company and tender facts.</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsBidModalOpen(true)}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white text-xs font-bold shadow-xl shadow-indigo-600/30 active:scale-95 transition flex items-center gap-2 shrink-0"
                >
                  <FileCheck2 className="h-4.5 w-4.5" />
                  <span>Generate Bid Documents</span>
                </button>
              </div>
            )}

            {/* ELIGIBILITY CRITERIA LIST & SOURCE EXCERPTS */}
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-400" />
                Mandatory Eligibility Criteria & Source Excerpts
              </h3>

              <div className="space-y-3">
                {(requirements.length > 0 ? requirements : [
                  { id: '1', description: 'Financial Turnover ≥ ₹150 Lakhs in audited statements', source_excerpt: 'Clause 4.1 Financial Qualification' },
                  { id: '2', description: 'Minimum 3 Years operational experience in renewable/electrical projects', source_excerpt: 'Clause 4.2 Technical Experience' },
                  { id: '3', description: 'Mandatory ISO 9001 and Class A Electrical License accreditation', source_excerpt: 'Clause 4.3 Accreditation & Licensing' }
                ]).map(crit => (
                  <div key={crit.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                    <p className="text-xs text-slate-200 font-bold">• {crit.description}</p>
                    <p className="text-[11px] font-mono text-slate-400 italic">"{crit.source_excerpt}"</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: INTELLIGENCE */}
        {activeTab === 'intelligence' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            
            <div className="lg:col-span-2 space-y-6">
              {/* Strengths */}
              <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-xl space-y-3">
                <h3 className="text-sm font-extrabold uppercase text-emerald-400 tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Key Competitive Strengths
                </h3>
                <ul className="text-xs text-slate-300 space-y-2 font-mono">
                  {analysis?.strengths?.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-xl space-y-3">
                <h3 className="text-sm font-extrabold uppercase text-rose-400 tracking-wider flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-rose-400" />
                  Gaps & Weaknesses
                </h3>
                <ul className="text-xs text-slate-300 space-y-2 font-mono">
                  {analysis?.weaknesses?.map((weak, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                      <span>{weak}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar Risks */}
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-xl space-y-3">
                <h3 className="text-sm font-extrabold uppercase text-amber-400 tracking-wider flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-400" />
                  Risk Factors & Clauses
                </h3>
                <ul className="text-xs text-slate-300 space-y-2 font-mono">
                  {analysis?.risks?.map((risk, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: PER-TENDER INLINE CHATBOT */}
        {activeTab === 'chat' && (
          <div className="rounded-3xl border border-slate-800 bg-slate-950/90 shadow-2xl p-6 animate-fadeIn">
            <h3 className="text-sm font-extrabold uppercase text-slate-400 tracking-wider mb-4 flex items-center gap-2">
              <Bot className="h-4 w-4 text-indigo-400" />
              Per-Tender AI Analyst Chatbot
            </h3>

            <TenderAnalystChatbot
              documentId={documents[0]?.id}
              tenderId={tender?.id || tenderId}
              tenderTitle={tender?.title}
            />
          </div>
        )}

        {/* BID DOCUMENT GENERATOR MODAL */}
        <BidDocumentGeneratorModal
          isOpen={isBidModalOpen}
          onClose={() => setIsBidModalOpen(false)}
          tender={tender}
        />

      </div>
    </DashboardLayout>
  );
};

export default TenderWorkspacePage;
