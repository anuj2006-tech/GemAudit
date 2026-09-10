import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { 
  GitFork, 
  Zap, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowRight, 
  Play, 
  RotateCcw, 
  FileText, 
  Users, 
  Lock, 
  Server, 
  Search, 
  Sparkles, 
  FileSpreadsheet, 
  Award, 
  Layers, 
  Menu,
  ChevronDown,
  ChevronUp,
  Download,
  Copy,
  Check,
  Send,
  HelpCircle,
  TrendingDown,
  TrendingUp,
  Flame
} from 'lucide-react';

export default function GeMWorkflowPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('interactive'); // 'interactive' | 'pillars' | 'comparison' | 'mermaid'
  const [simulating, setSimulating] = useState(false);
  const [simStep, setSimStep] = useState(0);
  const [selectedNode, setSelectedNode] = useState(null);
  const [copiedMermaid, setCopiedMermaid] = useState(false);

  // Workflow steps definition
  const WORKFLOW_STEPS = [
    {
      id: 'step-1',
      number: '01',
      title: 'Officer Ingestion & Tender Batching',
      category: 'Intake',
      time: '< 2 sec',
      statusColor: 'indigo',
      badge: 'Zero Manual Entry',
      icon: Layers,
      summary: 'Officer logs in and selects the active tender. All submitted bids and raw PDF attachments are ingested into the processing queue.',
      efficiencyGain: 'Replaces manual portal sign-ins & file-by-file downloads with 1-click batch ingestion.',
      details: [
        'Ingests all vendor bids, EMD instruments, and technical schedules simultaneously.',
        'Extracts vendor IDs, GSTIN, PAN, and Udyam registrations automatically.',
        'Queues parallel verification workers across 10 statutory microservices.'
      ]
    },
    {
      id: 'step-2',
      number: '02',
      title: 'Parallel 10-Portal API Triangulation',
      category: 'Statutory Verification',
      time: '3.2 sec',
      statusColor: 'cyan',
      badge: '10x Speed',
      icon: Server,
      summary: 'Automated engine queries 10 statutory databases simultaneously (GSTN, PAN, MCA21, Udyam, CPPP Debarment, EPFO, DigiLocker, etc.).',
      efficiencyGain: 'Reduces 4-6 hours of manual officer web browsing per bidder to 3.2 seconds total.',
      details: [
        'Cross-checks live active status against GSTN & GSTR-3B filing frequencies.',
        'Verifies MSME turnover & plant/machinery thresholds against Udyam portal.',
        'Scans CPPP Debarment Registry for active bans, blacklisting, or vigilance suspensions.'
      ]
    },
    {
      id: 'step-3',
      number: '03',
      title: 'AI Forensics & Tamper Heatmap Scan',
      category: 'Document Integrity',
      time: '1.8 sec',
      statusColor: 'purple',
      badge: 'Sub-Pixel OCR',
      icon: ShieldCheck,
      summary: 'Computer Vision models analyze uploaded certificates for font splicing, pixel anomalies, Photoshop alterations, and digital signature validity.',
      efficiencyGain: 'Eliminates fake/altered experience certificates that bypass traditional visual spot-checks.',
      details: [
        'Generates sub-pixel alteration heatmaps on financial turnover and completion certificates.',
        'Validates Adobe PKCS#7 / DSC cryptographic timestamps against CCA root registry.',
        'Detects mismatched entity names across different uploaded documents.'
      ]
    },
    {
      id: 'step-4',
      number: '04',
      title: 'Dynamic Smart Triage Matrix',
      category: 'Risk Ranking',
      time: 'Instant',
      statusColor: 'amber',
      badge: 'Weighted AI Score',
      icon: Zap,
      summary: 'Bidders are categorized into 3 actionable risk tiers based on calculated statutory compliance scores (0-100%).',
      efficiencyGain: 'Zero-effort sorting allows the officer to focus 90% of review time on edge-cases and high-risk flags.',
      details: [
        '🟢 Low Risk (Score ≥ 85%): All 10/10 portal checks passed, zero tamper anomalies.',
        '🟡 Medium Risk (Score 60-84%): Minor discrepancy, delayed GST return, or unverified sub-clause.',
        '🔴 High Risk (Score < 60% / Fatal Flag): Debarred entity, forged document, or suspended GSTIN.'
      ]
    },
    {
      id: 'step-5',
      number: '05',
      title: '1-Click Batch Qualification (Low Risk)',
      category: 'Adjudication',
      time: '< 1 sec',
      statusColor: 'emerald',
      badge: '80% Time Saved',
      icon: CheckCircle2,
      summary: 'Officer executes 1-click batch clearance for all clean Low-Risk bids, advancing them straight to financial evaluation.',
      efficiencyGain: 'No repetitive clicks or individual forms needed for vendors with 100% statutory clearance.',
      details: [
        'Applies bulk qualification endorsement with officer cryptographic signature.',
        'Generates automated qualification note with attached portal verification receipts.',
        'Transitions compliant vendors to Commercial/Financial bid opening phase.'
      ]
    },
    {
      id: 'step-6',
      number: '06',
      title: 'Closed-Loop 48h Clarification Bot (Medium Risk)',
      category: 'Auto-Clarification',
      time: 'Autonomous',
      statusColor: 'blue',
      badge: 'Self-Healing Loop',
      icon: Send,
      summary: 'System auto-generates statutory deficiency queries citing GFR Rule 173(iv), provides vendor a 48h upload link, and auto-re-scores.',
      efficiencyGain: 'Replaces manual emails, diary registers, and follow-ups with automated self-healing loop.',
      details: [
        'Pre-fills specific deficiency text (e.g., "GSTR-3B return missing for Nov 2024").',
        'Vendor uploads queried document directly into isolated validation sandbox.',
        'Engine re-runs targeted verification and auto-upgrades score upon valid submission.'
      ]
    },
    {
      id: 'step-7',
      number: '07',
      title: 'Statutory Rejection Memo (High Risk)',
      category: 'Legal Defense',
      time: 'Instant',
      statusColor: 'rose',
      badge: 'Litigation-Proof',
      icon: XCircle,
      summary: 'Produces non-rebuttable rejection order backed by live API timestamps and debarment proof to withstand legal challenges.',
      efficiencyGain: 'Eliminates vendor court stay orders and vigilance disputes by securing hard statutory evidence.',
      details: [
        'Attaches CPPP blacklist gazette ID, tampered document forensics, and GST cancellation notice.',
        'Auto-applies GFR Rule 151 / GeM General Terms disqualification clause.',
        'Generates formal rejection order signed by officer in 1 click.'
      ]
    },
    {
      id: 'step-8',
      number: '08',
      title: 'Committee e-Sign & SHA-256 Audit Lock',
      category: 'Final Audit',
      time: '2 min',
      statusColor: 'slate',
      badge: 'CVC / CAG Sealed',
      icon: Lock,
      summary: 'Auto-compiles Technical Evaluation Committee (TEC) Minutes of Meeting (MOM), captures multi-member e-signatures, and hashes audit log.',
      efficiencyGain: 'Cuts committee paperwork from 2 days to under 2 minutes with complete audit immunity.',
      details: [
        'Pre-fills complete comparative evaluation tables and compliance summary.',
        'Supports Aadhaar OTP / DSC multi-member digital signing.',
        'Locks entire review trail in SHA-256 immutable cryptographic hash.'
      ]
    }
  ];

  // Simulation runner
  const handleStartSimulation = () => {
    setSimulating(true);
    setSimStep(1);
    setSelectedNode('step-1');
  };

  const handleResetSimulation = () => {
    setSimulating(false);
    setSimStep(0);
    setSelectedNode(null);
  };

  useEffect(() => {
    if (!simulating) return;
    if (simStep < WORKFLOW_STEPS.length) {
      const timer = setTimeout(() => {
        setSimStep(prev => prev + 1);
        setSelectedNode(WORKFLOW_STEPS[simStep]?.id);
      }, 1200);
      return () => clearTimeout(timer);
    } else {
      const finishTimer = setTimeout(() => {
        setSimulating(false);
      }, 1500);
      return () => clearTimeout(finishTimer);
    }
  }, [simulating, simStep]);

  const mermaidCode = `flowchart TD
    %% Styling Classes
    classDef startEnd fill:#0F172A,stroke:#334155,stroke-width:2px,color:#FFFFFF,font-weight:700;
    classDef autoProcess fill:#EEF2FF,stroke:#6366F1,stroke-width:2px,color:#1E1B4B;
    classDef decision fill:#FEF3C7,stroke:#D97706,stroke-width:2px,color:#78350F,font-weight:700;
    classDef lowRisk fill:#ECFDF5,stroke:#10B981,stroke-width:2px,color:#064E3B;
    classDef medRisk fill:#FFFBEB,stroke:#F59E0B,stroke-width:2px,color:#78350F;
    classDef highRisk fill:#FEF2F2,stroke:#EF4444,stroke-width:2px,color:#7F1D1D;
    classDef audit fill:#F8FAFC,stroke:#64748B,stroke-width:2px,color:#0F172A;

    %% Workflow Steps
    Start(["🔑 1. Officer Logs into GeM Console"]):::startEnd --> SelectTender["📂 2. Select Active Tender & Batch Ingest"]:::autoProcess
    SelectTender --> AutoEngine["⚡ 3. Automated 10-Portal API Engine (3.2s)<br/>• GSTN, PAN, MCA21, Udyam, EPFO, DigiLocker<br/>• AI Document Forensics & Tamper Heatmaps<br/>• CPPP Debarment & Blacklist Scanning"]:::autoProcess

    AutoEngine --> DashboardTriage["📊 4. Smart Triage Matrix<br/>Bidders auto-ranked into Risk Tiers by Compliance Score"]:::autoProcess
    DashboardTriage --> CheckRisk{"⚖️ 5. Officer Triage Decision"}:::decision

    %% Branches
    CheckRisk -->|Score ≥ 85%| GreenPath["🟢 Low Risk Bidder<br/>10/10 Portal Checks Passed"]:::lowRisk
    GreenPath --> ActQualify["✅ 6A. 1-Click Batch Qualify<br/>Immediate Clearance to Financials"]:::lowRisk

    CheckRisk -->|Score 60% - 84%| YellowPath["🟡 Medium Risk Bidder<br/>Minor Discrepancy / Late Filing"]:::medRisk
    YellowPath --> ActNotice["📩 6B. Auto 48h Clarification Bot<br/>Self-healing query & auto-re-scoring"]:::medRisk

    CheckRisk -->|Score < 60%| RedPath["🔴 High Risk / Defaulter<br/>Debarred / Altered Docs / Shell Co"]:::highRisk
    RedPath --> ActReject["🚫 6C. Statutory Rejection Order<br/>Citing GFR Rule 151 with API Proof"]:::highRisk

    %% Committee & Audit Lock
    ActQualify --> MOMSign["👥 7. Tender Committee e-Sign Off<br/>Pre-filled Minutes of Meeting (MOM)"]:::audit
    ActNotice --> MOMSign
    ActReject --> MOMSign

    MOMSign --> ExportAudit["📑 8. SHA-256 Tamper-Proof Audit Lock & CAG Report"]:::audit
    ExportAudit --> End(["🏆 9. Publish Technical Evaluation on GeM"]):::startEnd`;

  const handleCopyMermaid = () => {
    navigator.clipboard.writeText(mermaidCode);
    setCopiedMermaid(true);
    setTimeout(() => setCopiedMermaid(false), 2000);
  };

  const activeNodeData = WORKFLOW_STEPS.find(s => s.id === selectedNode) || WORKFLOW_STEPS[0];

  return (
    <div className="flex h-screen bg-slate-100/70 text-slate-900 font-['IBM_Plex_Sans'] overflow-hidden selection:bg-indigo-600 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar mobileOpen={mobileNavOpen} onMobileClose={() => setMobileNavOpen(false)} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200/90 bg-white/95 px-4 sm:px-6 backdrop-blur-md shadow-xs z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-xl shadow-md shadow-indigo-500/20">
                <GitFork className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  Officer Efficiency & Workflow Engine
                  <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold font-mono">
                    96% FASTER
                  </span>
                </h1>
                <p className="text-xs text-slate-500 hidden sm:block">
                  Automated intelligence pipeline, zero-touch triage, and CVC-compliant audit architecture
                </p>
              </div>
            </div>
          </div>

          {/* Quick Simulation Trigger & Tabs */}
          <div className="flex items-center gap-2">
            {!simulating ? (
              <button
                onClick={handleStartSimulation}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-600/20 transition-all active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Simulate Flow</span>
              </button>
            ) : (
              <button
                onClick={handleResetSimulation}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </header>

        {/* View Mode Switcher Strip */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2 flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('interactive')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'interactive'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Interactive Pipeline
            </button>
            <button
              onClick={() => setActiveTab('pillars')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'pillars'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              4 Efficiency Pillars
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'comparison'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Before vs. After ROI
            </button>
            <button
              onClick={() => setActiveTab('mermaid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'mermaid'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Mermaid & PPT Code
            </button>
          </div>

          <div className="hidden md:flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1 font-semibold text-emerald-600">
              <Sparkles className="w-3.5 h-3.5" /> 8 Minutes Cycle Time
            </span>
            <span className="text-slate-300">•</span>
            <span className="font-semibold text-indigo-600">10 Statutory APIs Active</span>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: INTERACTIVE PIPELINE */}
          {activeTab === 'interactive' && (
            <div className="space-y-6">
              {/* Simulation Banner if running */}
              {simulating && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-center justify-between shadow-xs animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-600 text-white rounded-lg">
                      <Zap className="w-5 h-5 animate-bounce" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-indigo-900">
                        Running Active Simulation: Step {simStep} of {WORKFLOW_STEPS.length}
                      </p>
                      <p className="text-xs text-indigo-700">
                        {WORKFLOW_STEPS[simStep - 1]?.title || 'Executing automated verification sequence...'}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs font-mono font-bold text-indigo-600 bg-white px-3 py-1.5 rounded-lg border border-indigo-200">
                    {Math.round((simStep / WORKFLOW_STEPS.length) * 100)}% Complete
                  </div>
                </div>
              )}

              {/* 2-Column Layout: Pipeline Steps on Left, Deep-Dive Inspector on Right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Step List / Visual Timeline */}
                <div className="lg:col-span-7 space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                      End-to-End Execution Sequence
                    </h2>
                    <span className="text-xs text-slate-500 font-medium">
                      Click any node to inspect efficiency mechanics
                    </span>
                  </div>

                  {WORKFLOW_STEPS.map((step, idx) => {
                    const isSelected = selectedNode === step.id || (!selectedNode && idx === 0);
                    const isPassedInSim = simStep >= idx + 1;
                    const Icon = step.icon;

                    return (
                      <div
                        key={step.id}
                        onClick={() => setSelectedNode(step.id)}
                        className={`group relative rounded-xl border p-4 transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-white border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                            : isPassedInSim
                            ? 'bg-emerald-50/50 border-emerald-300 shadow-xs'
                            : 'bg-white/80 border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold ${
                              isSelected
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : isPassedInSim
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {isPassedInSim ? <Check className="w-4 h-4" /> : step.number}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                                  {step.category}
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                  step.statusColor === 'emerald' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                  step.statusColor === 'amber' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                  step.statusColor === 'rose' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                  step.statusColor === 'cyan' ? 'bg-cyan-50 text-cyan-700 border-cyan-200' :
                                  step.statusColor === 'purple' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                  step.statusColor === 'blue' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                  'bg-indigo-50 text-indigo-700 border-indigo-200'
                                }`}>
                                  {step.badge}
                                </span>
                              </div>
                              <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                {step.title}
                              </h3>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                              {step.time}
                            </span>
                          </div>
                        </div>

                        {/* Summary Line */}
                        <p className="mt-2.5 text-xs text-slate-600 leading-relaxed pl-12">
                          {step.summary}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Right Inspector: Deep Node Insights */}
                <div className="lg:col-span-5">
                  <div className="sticky top-6 space-y-4">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
                            <activeNodeData.icon className="w-4 h-4" />
                          </span>
                          <div>
                            <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase">
                              Node Deep-Dive
                            </span>
                            <h3 className="text-sm font-bold text-slate-900">
                              {activeNodeData.title}
                            </h3>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                          {activeNodeData.time}
                        </span>
                      </div>

                      {/* Efficiency Multiplier Box */}
                      <div className="bg-gradient-to-br from-indigo-50 to-slate-50 border border-indigo-100 rounded-xl p-3.5 mb-4">
                        <div className="flex items-start gap-2.5">
                          <Flame className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold text-indigo-950">Efficiency Multiplier</p>
                            <p className="text-xs text-indigo-800/90 mt-0.5 leading-relaxed">
                              {activeNodeData.efficiencyGain}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Execution Details Checklist */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono mb-2">
                          Core Automation Mechanics
                        </h4>
                        <ul className="space-y-2">
                          {activeNodeData.details.map((detail, dIdx) => (
                            <li key={dIdx} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Quick Action Simulator */}
                      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-500">
                          Status: <span className="font-bold text-emerald-600">Production Ready</span>
                        </span>
                        <a
                          href="/gem-compliance-fastapi"
                          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
                        >
                          <span>Open in Tender Board</span>
                          <ArrowRight className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    {/* Quick Stat Card */}
                    <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-slate-400 font-bold uppercase">
                          System Throughput
                        </span>
                        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                          <p className="text-[10px] text-slate-400 uppercase font-mono font-semibold">Tender Cycle</p>
                          <p className="text-base font-bold text-white mt-0.5">8.5 Mins</p>
                          <p className="text-[10px] text-emerald-400 font-medium">96% reduction</p>
                        </div>
                        <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                          <p className="text-[10px] text-slate-400 uppercase font-mono font-semibold">Statutory APIs</p>
                          <p className="text-base font-bold text-white mt-0.5">10 Active</p>
                          <p className="text-[10px] text-indigo-400 font-medium">Parallel query</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 4 EFFICIENCY PILLARS */}
          {activeTab === 'pillars' && (
            <div className="space-y-6">
              <div className="max-w-3xl">
                <h2 className="text-lg font-bold text-slate-900">
                  The 4 Architectural Pillars of Procurement Efficiency
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  How the system replaces manual officer friction with intelligent, asynchronous automation loops.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pillar 1 */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-indigo-300 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
                      <Server className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase">Pillar 01</span>
                      <h3 className="text-sm font-bold text-slate-900">Zero-Touch Parallel Engine</h3>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Simultaneously hits 10 statutory endpoints (GSTN, PAN, MCA21, Udyam, CPPP Debarment, EPFO, DigiLocker, etc.) in non-blocking async threads.
                  </p>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs space-y-1.5 font-mono">
                    <div className="flex justify-between text-slate-500">
                      <span>Manual Portal Browsing:</span>
                      <span className="text-rose-600 font-bold">4-6 Hours</span>
                    </div>
                    <div className="flex justify-between text-slate-700 font-bold">
                      <span>Automated Parallel Engine:</span>
                      <span className="text-emerald-600">3.2 Seconds</span>
                    </div>
                  </div>
                </div>

                {/* Pillar 2 */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-indigo-300 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-emerald-600 uppercase">Pillar 02</span>
                      <h3 className="text-sm font-bold text-slate-900">Smart Batch Auto-Routing</h3>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Clean bids with 100% statutory clearance (Score ≥ 85%) are approved via 1-click batch clearance, freeing officers to focus only on flagged bidders.
                  </p>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs space-y-1.5 font-mono">
                    <div className="flex justify-between text-slate-500">
                      <span>Individual Bid Triage:</span>
                      <span className="text-rose-600 font-bold">15 Mins / Bid</span>
                    </div>
                    <div className="flex justify-between text-slate-700 font-bold">
                      <span>Batch Auto-Qualification:</span>
                      <span className="text-emerald-600">&lt; 1 Second</span>
                    </div>
                  </div>
                </div>

                {/* Pillar 3 */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-indigo-300 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
                      <Send className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-amber-600 uppercase">Pillar 03</span>
                      <h3 className="text-sm font-bold text-slate-900">Closed-Loop 48h Clarification Bot</h3>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Auto-detects document deficiencies, auto-drafts the official clarification notice under GFR Rule 173(iv), provides vendor portal, and auto-re-scores upon upload.
                  </p>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs space-y-1.5 font-mono">
                    <div className="flex justify-between text-slate-500">
                      <span>Manual Email & Registry Log:</span>
                      <span className="text-rose-600 font-bold">3-5 Days</span>
                    </div>
                    <div className="flex justify-between text-slate-700 font-bold">
                      <span>Self-Healing Bot Cycle:</span>
                      <span className="text-emerald-600">Automated 48h</span>
                    </div>
                  </div>
                </div>

                {/* Pillar 4 */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-indigo-300 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl border border-purple-100">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-purple-600 uppercase">Pillar 04</span>
                      <h3 className="text-sm font-bold text-slate-900">Zero-Friction Committee & Audit Lock</h3>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    System pre-fills the Technical Evaluation Committee (TEC) Minutes of Meeting (MOM), collects Aadhaar/DSC e-Signatures, and generates a SHA-256 sealed audit trail.
                  </p>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs space-y-1.5 font-mono">
                    <div className="flex justify-between text-slate-500">
                      <span>Committee Paper Drafting:</span>
                      <span className="text-rose-600 font-bold">1-2 Days</span>
                    </div>
                    <div className="flex justify-between text-slate-700 font-bold">
                      <span>Digital MOM & e-Sign:</span>
                      <span className="text-emerald-600">2 Minutes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BEFORE VS AFTER COMPARISON */}
          {activeTab === 'comparison' && (
            <div className="space-y-6">
              <div className="max-w-3xl">
                <h2 className="text-lg font-bold text-slate-900">
                  Quantifiable Operational Impact (Before vs. After)
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Demonstrated metrics comparing conventional manual tender verification against the automated GeM Compliance Engine.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <p className="text-xs font-mono font-bold text-slate-500 uppercase">Evaluation Time</p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-bold text-emerald-600">8.5 min</span>
                    <span className="text-xs line-through text-slate-400">4-7 days</span>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-emerald-600">
                    <TrendingDown className="w-3.5 h-3.5" /> 96% Time Saved
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <p className="text-xs font-mono font-bold text-slate-500 uppercase">Officer Effort / Bid</p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-bold text-indigo-600">30 sec</span>
                    <span className="text-xs line-through text-slate-400">45 mins</span>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-emerald-600">
                    <TrendingDown className="w-3.5 h-3.5" /> 98% Effort Reduction
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <p className="text-xs font-mono font-bold text-slate-500 uppercase">Fraud & Debarment Detection</p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-bold text-purple-600">100%</span>
                    <span className="text-xs line-through text-slate-400">~68%</span>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-emerald-600">
                    <TrendingUp className="w-3.5 h-3.5" /> Zero Slip-Throughs
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <p className="text-xs font-mono font-bold text-slate-500 uppercase">Litigation & Stay Order Risk</p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-bold text-emerald-600">&lt; 0.01%</span>
                    <span className="text-xs line-through text-slate-400">12.4%</span>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-emerald-600">
                    <TrendingDown className="w-3.5 h-3.5" /> Cryptographic Proof
                  </div>
                </div>
              </div>

              {/* Detailed Comparison Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                    Detailed Process Matrix
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-100/60 text-slate-700 font-mono">
                        <th className="py-3 px-4 font-bold">Workflow Step</th>
                        <th className="py-3 px-4 font-bold text-rose-700">Traditional Manual Method</th>
                        <th className="py-3 px-4 font-bold text-emerald-700">Automated GeM Verification Engine</th>
                        <th className="py-3 px-4 font-bold">Efficiency Multiplier</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      <tr>
                        <td className="py-3 px-4 font-bold text-slate-900">Portal Cross-Checking</td>
                        <td className="py-3 px-4">Officer logs into 10 separate websites manually copying PAN/GST.</td>
                        <td className="py-3 px-4 text-emerald-900 font-medium">Parallel asynchronous API queries executed in 3.2 seconds.</td>
                        <td className="py-3 px-4 font-bold text-emerald-600 font-mono">99.9% Faster</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-bold text-slate-900">Document Authenticity</td>
                        <td className="py-3 px-4">Visual inspection only; altered numbers in PDFs easily missed.</td>
                        <td className="py-3 px-4 text-emerald-900 font-medium">Sub-pixel alteration heatmaps & DSC root key verification.</td>
                        <td className="py-3 px-4 font-bold text-emerald-600 font-mono">Zero Fraud Risk</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-bold text-slate-900">Deficiency Clarifications</td>
                        <td className="py-3 px-4">Manual email drafting, physical dispatch register, spreadsheet tracking.</td>
                        <td className="py-3 px-4 text-emerald-900 font-medium">Automated 48h loop bot with pre-filled GFR clauses & auto-re-scoring.</td>
                        <td className="py-3 px-4 font-bold text-emerald-600 font-mono">85% Less Overhead</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-bold text-slate-900">Vendor Rejections</td>
                        <td className="py-3 px-4">Subjective rejection notes leading to vendor court appeals.</td>
                        <td className="py-3 px-4 text-emerald-900 font-medium">Statutory rejection order citing live API evidence & GFR Rule 151.</td>
                        <td className="py-3 px-4 font-bold text-emerald-600 font-mono">100% Dispute-Proof</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-bold text-slate-900">Audit Compliance (CVC/CAG)</td>
                        <td className="py-3 px-4">Weeks of document collation when vigilance inquiry is initiated.</td>
                        <td className="py-3 px-4 text-emerald-900 font-medium">One-click export of SHA-256 sealed digital audit report.</td>
                        <td className="py-3 px-4 font-bold text-emerald-600 font-mono">Instant Audit Readiness</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MERMAID & PPT CODE */}
          {activeTab === 'mermaid' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Mermaid Diagram Code & Presentation Export
                  </h2>
                  <p className="text-xs text-slate-500">
                    Use this code in Markdown docs, GitHub, or Mermaid Live Editor for your presentations.
                  </p>
                </div>
                <button
                  onClick={handleCopyMermaid}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                >
                  {copiedMermaid ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedMermaid ? 'Copied Code!' : 'Copy Mermaid'}</span>
                </button>
              </div>

              <div className="bg-slate-950 text-slate-200 rounded-2xl p-4 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed shadow-inner">
                <pre>{mermaidCode}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
