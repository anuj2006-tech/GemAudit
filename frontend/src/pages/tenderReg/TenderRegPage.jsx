import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TenderAnalystChatbot from '../../components/common/TenderAnalystChatbot';
import { BidDocumentGeneratorModal } from '../../components/documents/BidDocumentGeneratorModal';
import { 
  LayoutDashboard, 
  FileText, 
  Folder, 
  CheckSquare, 
  Bookmark, 
  CreditCard, 
  Share2, 
  HelpCircle, 
  XCircle, 
  CheckCircle2, 
  Info, 
  ChevronDown, 
  Video, 
  MessageSquare, 
  X, 
  Building2, 
  Link as LinkIcon,
  Check
} from 'lucide-react';

const INITIAL_LOGS = [
  'Starting analysis process for 6a93421fd0f66787b4dd16c9',
  'Estimating document complexity...',
  'Loading tender details...',
  'Tender loaded: 2026_IITDW_848886_1',
  'Reusing existing analysis metrics for tender 6a8a5d63602ca769992c8908: 12 pages, 70584 chars',
  'Analysis complexity assessment completed (reused)',
  'Analysis initiated — preparing document pipeline...',
  'Starting analysis process for 6a93421fd0f66787b4dd16c9',
  'Analysis request received initialising pipeline...'
];

const TenderRegPage = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('All Tenders');
  const [activeTab, setActiveTab] = useState('Eligibility'); // 'Eligibility' | 'Detailed Info' | 'Documents'
  const [logs, setLogs] = useState(INITIAL_LOGS);
  
  // Floating Actions State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [processCount, setProcessCount] = useState(1);
  
  // Edit Profile / Re-analysis modal
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [companyName, setCompanyName] = useState('Anuj Gangawane');
  const [companyTurnover, setCompanyTurnover] = useState('200');
  const [companyExperience, setCompanyExperience] = useState('4');
  const [companySector, setCompanySector] = useState('Electrical & Solar Energy');
  const [isEligibleState, setIsEligibleState] = useState(false);

  // Bid document generator
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);

  // Clear logs handler
  const handleClearLogs = () => {
    setLogs([]);
  };

  // Re-run simulation
  const handleSaveProfileAndRerun = (e) => {
    e.preventDefault();
    setIsProfileModalOpen(false);
    setLogs(prev => [
      `Starting analysis process for updated company profile: ${companyName}`,
      `Re-evaluating mandatory criteria against tender 2026_IITDW_848886_1...`,
      `Financial threshold verified: ₹${companyTurnover} Lakhs (Min req: ₹150 Lakhs)`,
      `Experience verified: ${companyExperience} Years (Min req: 3 Years)`,
      `Analysis completed — Status: ${Number(companyTurnover) >= 150 ? 'Eligible' : 'Not Eligible'}`,
      ...prev
    ]);
    setIsEligibleState(Number(companyTurnover) >= 150 && Number(companyExperience) >= 3);
  };

  const currentTender = {
    id: '2026_IITDW_848886_1',
    title: 'Supply, Installation, Testing & Commissioning of High-Efficiency Solar & Electrical Infrastructure',
    department: 'Indian Institute of Technology (IIT) Infrastructure Division',
    minTurnover: '₹150 Lakhs',
    minExperience: '3 Years',
    deadline: '15-Sep-2026 15:00 IST',
    emdAmount: '₹2,50,000 (Exempted for MSE/Startup)',
    documentsCount: 4
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#1f2937] font-sans flex flex-col antialiased selection:bg-pink-500 selection:text-white">
      
      <div className="flex flex-1">
        
        {/* ========================================================= */}
        {/* LEFT SIDEBAR (Matching Screenshot Exactly) */}
        {/* ========================================================= */}
        <aside className="w-64 bg-white border-r border-[#e5e7eb] flex flex-col shrink-0 min-h-screen py-5 px-4 select-none">
          
          {/* Logo with Stylized Type & Flare */}
          <div className="px-2 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => navigate('/')}>
              <span className="text-[26px] font-black tracking-tight text-[#111827] font-serif lowercase">
                minaions
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-[#e0007b] to-[#7b00ff] shadow-sm animate-pulse" />
            </div>
          </div>

          {/* User Account Card */}
          <div className="mb-6 bg-[#f9fafb] border border-[#e5e7eb] rounded-2xl p-2.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#ec008c] via-[#b800b8] to-[#7928ca] flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#111827] truncate leading-tight">{companyName}</p>
                <p className="text-[10px] text-[#6b7280] font-medium">Active Company</p>
              </div>
            </div>
            <button 
              onClick={() => setIsProfileModalOpen(true)}
              className="text-[#9ca3af] hover:text-[#4b5563] p-1 transition"
              title="Edit Profile"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 flex-1">
            {[
              { name: 'Dashboard', icon: LayoutDashboard, path: '/super-admin/dashboard' },
              { name: 'All Tenders', icon: FileText, path: '/tender-reg' },
              { name: 'My Companies', icon: Folder, path: '/company-brain' },
              { name: 'Processed Tenders', icon: CheckSquare, path: '/gem-compliance-fastapi' },
              { name: 'Bookmarks', icon: Bookmark, path: '/tender-reg' },
              { name: 'Plans', icon: CreditCard, path: '/bid-documents' },
              { name: 'Connect To OEM', icon: LinkIcon, path: '/tender-reg' },
              { name: 'Help', icon: HelpCircle, path: '/tender-reg' },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.name;

              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveNav(item.name);
                    if (item.path && item.path !== '/tender-reg') {
                      navigate(item.path);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 text-left ${
                    isActive
                      ? 'bg-gradient-to-r from-[#e6007a] via-[#b800b8] to-[#7b00ff] text-white shadow-[0_4px_14px_rgba(184,0,184,0.35)]'
                      : 'text-[#4b5563] hover:bg-[#f3f4f6] hover:text-[#111827]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#6b7280]'}`} />
                  <span className={isActive ? 'font-bold' : 'font-medium'}>{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Bottom helper */}
          <div className="pt-4 border-t border-[#f3f4f6] px-2">
            <p className="text-[11px] text-[#9ca3af] font-medium">TenderAI Intelligence v2.4</p>
          </div>
        </aside>

        {/* ========================================================= */}
        {/* MAIN BODY AREA */}
        {/* ========================================================= */}
        <main className="flex-1 flex flex-col p-6 lg:p-8 max-w-[1400px] mx-auto w-full gap-6">
          
          {/* Top Page Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-[26px] font-extrabold text-[#111827] tracking-tight">
              Tender Analysis Report
            </h1>
            <button 
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                alert('Tender report link copied to clipboard!');
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#e5e7eb] text-xs font-semibold text-[#374151] hover:bg-[#f9fafb] hover:border-[#d1d5db] shadow-xs transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Report</span>
            </button>
          </div>

          {/* Layout Columns: Main Report (Left) + Process Logs (Right) */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            
            {/* ------------------------------------------------------- */}
            {/* CENTER/LEFT: TABS & ASSESSMENT REPORT */}
            {/* ------------------------------------------------------- */}
            <div className="xl:col-span-8 space-y-6">
              
              {/* Segmented Top Tabs */}
              <div className="bg-[#f1f3f9] p-1.5 rounded-2xl flex items-center gap-1.5 shadow-inner">
                
                <button
                  onClick={() => setActiveTab('Eligibility')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'Eligibility'
                      ? 'bg-white text-[#111827] shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
                      : 'text-[#6b7280] hover:text-[#111827]'
                  }`}
                >
                  <XCircle className="w-4 h-4 text-[#ef4444]" />
                  <span>Eligibility</span>
                </button>

                <button
                  onClick={() => setActiveTab('Detailed Info')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'Detailed Info'
                      ? 'bg-white text-[#111827] shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
                      : 'text-[#6b7280] hover:text-[#111827]'
                  }`}
                >
                  <Info className="w-4 h-4 text-[#6b7280]" />
                  <span>Detailed Info</span>
                </button>

                <button
                  onClick={() => setActiveTab('Documents')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'Documents'
                      ? 'bg-white text-[#111827] shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
                      : 'text-[#6b7280] hover:text-[#111827]'
                  }`}
                >
                  <FileText className="w-4 h-4 text-[#6b7280]" />
                  <span>Documents</span>
                </button>

              </div>

              {/* TAB 1: ELIGIBILITY ASSESSMENT CARD */}
              {activeTab === 'Eligibility' && (
                <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-xs p-6 sm:p-8 space-y-6">
                  
                  {/* Header Row: Assessment Title + Update Company Profile CTA */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#f3f4f6] pb-5">
                    
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {isEligibleState ? (
                          <CheckCircle2 className="w-6 h-6 text-[#10b981]" />
                        ) : (
                          <XCircle className="w-6 h-6 text-[#ef4444]" />
                        )}
                      </div>
                      <div>
                        <h2 className="text-xl font-extrabold text-[#111827] tracking-tight leading-tight">
                          Eligibility<br className="hidden sm:block"/> Assessment
                        </h2>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-start">
                      <span className="text-xs font-bold text-[#111827]">
                        Think it's not correct?
                      </span>
                      <button
                        onClick={() => setIsProfileModalOpen(true)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d9007e] via-[#9e00d9] to-[#7000ff] hover:opacity-95 text-white text-xs font-bold shadow-[0_4px_12px_rgba(158,0,217,0.3)] transition-all transform active:scale-95"
                      >
                        Update Company Profile
                      </button>
                    </div>

                  </div>

                  {/* Red/Green Status Pill */}
                  <div>
                    {isEligibleState ? (
                      <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#10b981] text-white font-bold text-xs shadow-xs">
                        <Check className="w-3.5 h-3.5" />
                        <span>Eligible</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#dc2626] text-white font-bold text-xs shadow-xs">
                        <X className="w-3.5 h-3.5" />
                        <span>Not Eligible</span>
                      </span>
                    )}
                  </div>

                  {/* Prose Reason Paragraph (Matching Screenshot Exactly) */}
                  <div className="space-y-4 text-xs text-[#374151] leading-relaxed font-sans">
                    <p>
                      <strong className="text-[#111827]">Eligible:</strong> {isEligibleState ? 'Yes' : 'No'}
                    </p>

                    <p>
                      <strong className="text-[#111827]">Reason:</strong> {isEligibleState ? (
                        `The company, "${companyName}," has provided sufficient documented credentials satisfying the financial criteria (₹${companyTurnover} Lakhs >= ₹150 Lakhs) and minimum operating experience (${companyExperience} Years >= 3 Years).`
                      ) : (
                        `The company, "${companyName}," has provided no substantive information to demonstrate compliance with any of the mandatory eligibility criteria. The company information section is entirely incomplete — entity type is "Not Specified," registered address is "Please update your registered address," and no financial, legal, technical, or capacity details are provided.`
                      )}
                    </p>

                    <p className="text-[#111827] font-medium">
                      Specifically, the company fails to meet the following non-negotiable requirements:
                    </p>

                    {/* Numbered Criteria Breakdown */}
                    <div className="space-y-4 pt-1">
                      
                      <div className="space-y-1">
                        <p className="font-bold text-[#111827]">1. Financial Criteria:</p>
                        <p className="text-[#4b5563] pl-3">
                          - Must submit a complete financial quotation with original product catalogues duly signed by an authorized representative. → <span className="font-semibold italic text-[#dc2626]">*Not submitted*</span>.
                        </p>
                        <p className="text-[#4b5563] pl-3">
                          - Average Annual Financial Turnover of at least ₹150 Lakhs in the last 3 financial years. → <span className={`font-semibold italic ${Number(companyTurnover) >= 150 ? 'text-[#10b981]' : 'text-[#dc2626]'}`}>*{Number(companyTurnover) >= 150 ? 'Compliant' : 'Below Threshold'}*</span>.
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="font-bold text-[#111827]">2. Technical & Past Experience:</p>
                        <p className="text-[#4b5563] pl-3">
                          - Minimum 3 years of demonstrated operational history in executing similar government contracts. → <span className={`font-semibold italic ${Number(companyExperience) >= 3 ? 'text-[#10b981]' : 'text-[#dc2626]'}`}>*{Number(companyExperience) >= 3 ? 'Verified' : 'Insufficient'}*</span>.
                        </p>
                        <p className="text-[#4b5563] pl-3">
                          - Class A Electrical Contractor License issued by competent state licensing authority. → <span className="font-semibold italic text-[#dc2626]">*Document Missing*</span>.
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="font-bold text-[#111827]">3. Statutory & Quality Certifications:</p>
                        <p className="text-[#4b5563] pl-3">
                          - ISO 9001:2015 Quality Management Systems Accreditation. → <span className="font-semibold italic text-[#d97706]">*Pending Verification*</span>.
                        </p>
                        <p className="text-[#4b5563] pl-3">
                          - Valid GSTIN, PAN, and Non-Blacklisting Self-Declaration Affidavit. → <span className="font-semibold italic text-[#dc2626]">*Not submitted*</span>.
                        </p>
                      </div>

                    </div>

                  </div>

                  {/* Actions Footer */}
                  <div className="pt-4 border-t border-[#f3f4f6] flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsBidModalOpen(true)}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#111827] to-[#1f2937] hover:from-black hover:to-black text-white text-xs font-bold shadow-xs transition"
                      >
                        Generate Bid Documents
                      </button>
                      <button
                        onClick={() => setIsChatOpen(true)}
                        className="px-4 py-2.5 rounded-xl bg-[#f3f4f6] hover:bg-[#e5e7eb] text-[#111827] text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#9e00d9]" />
                        <span>Chat with AI Analyst</span>
                      </button>
                    </div>

                    <span className="text-[11px] font-mono text-[#9ca3af]">
                      Tender Ref: {currentTender.id}
                    </span>
                  </div>

                </div>
              )}

              {/* TAB 2: DETAILED INFO */}
              {activeTab === 'Detailed Info' && (
                <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-xs p-6 sm:p-8 space-y-6">
                  <div className="border-b border-[#f3f4f6] pb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-[#111827]">{currentTender.title}</h3>
                      <p className="text-xs text-[#6b7280] font-mono mt-0.5">{currentTender.department}</p>
                    </div>
                    <span className="text-xs font-mono bg-[#eff6ff] text-[#1d4ed8] px-3 py-1 rounded-lg border border-[#bfdbfe] font-bold">
                      LIVE TENDER
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-[#f9fafb] border border-[#e5e7eb] space-y-1">
                      <span className="text-[#9ca3af] font-semibold uppercase text-[10px] tracking-wider">Turnover Requirement</span>
                      <p className="text-sm font-bold text-[#111827]">{currentTender.minTurnover}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#f9fafb] border border-[#e5e7eb] space-y-1">
                      <span className="text-[#9ca3af] font-semibold uppercase text-[10px] tracking-wider">Experience Requirement</span>
                      <p className="text-sm font-bold text-[#111827]">{currentTender.minExperience}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#f9fafb] border border-[#e5e7eb] space-y-1">
                      <span className="text-[#9ca3af] font-semibold uppercase text-[10px] tracking-wider">Submission Deadline</span>
                      <p className="text-sm font-bold text-[#111827]">{currentTender.deadline}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#f9fafb] border border-[#e5e7eb] space-y-1">
                      <span className="text-[#9ca3af] font-semibold uppercase text-[10px] tracking-wider">EMD / Bid Security</span>
                      <p className="text-sm font-bold text-[#111827]">{currentTender.emdAmount}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: DOCUMENTS */}
              {activeTab === 'Documents' && (
                <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-xs p-6 sm:p-8 space-y-6">
                  <div className="border-b border-[#f3f4f6] pb-4">
                    <h3 className="text-base font-bold text-[#111827]">Tender Documentation Pack</h3>
                    <p className="text-xs text-[#6b7280]">Official RFP and technical specification documents</p>
                  </div>

                  <div className="space-y-3">
                    {[
                      { name: 'NIT_Solar_Plant_2026_Final.pdf', size: '3.4 MB', pages: 48, status: 'Verified' },
                      { name: 'Technical_Specification_Schedule_A.pdf', size: '1.8 MB', pages: 22, status: 'Analyzed' },
                      { name: 'BOQ_Financial_Bid_Template.xlsx', size: '420 KB', pages: 4, status: 'Template Ready' },
                      { name: 'Integrity_Pact_Format.pdf', size: '890 KB', pages: 8, status: 'Mandatory' }
                    ].map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl border border-[#e5e7eb] hover:border-[#d1d5db] bg-[#f9fafb] transition">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-[#9e00d9]" />
                          <div>
                            <p className="text-xs font-bold text-[#111827]">{doc.name}</p>
                            <p className="text-[10px] text-[#6b7280] font-mono">{doc.size} • {doc.pages} pages</p>
                          </div>
                        </div>
                        <span className="text-[11px] font-semibold text-[#059669] bg-[#ecfdf5] px-2.5 py-1 rounded-lg border border-[#a7f3d0]">
                          {doc.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* ------------------------------------------------------- */}
            {/* RIGHT SIDEBAR: PROCESS LOGS PANEL (Exact Match) */}
            {/* ------------------------------------------------------- */}
            <div className="xl:col-span-4">
              
              <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-xs p-5 space-y-4">
                
                {/* Header: Title + Clear Logs + Connected Badge */}
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-[#111827] tracking-tight">
                    Process Logs
                  </h3>
                  <button
                    onClick={handleClearLogs}
                    className="text-xs font-semibold text-[#4b5563] hover:text-[#111827] px-3 py-1 rounded-lg border border-[#e5e7eb] hover:bg-[#f9fafb] transition"
                  >
                    Clear Logs
                  </button>
                </div>

                {/* Connection Status Pill */}
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]">
                    <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                    <span>Connected</span>
                  </span>
                </div>

                {/* Logs Stream Box (Exact match to screenshot) */}
                <div className="bg-[#f8f9fa] rounded-2xl border border-[#e5e7eb] p-4 space-y-3 font-sans text-xs text-[#374151] max-h-[580px] overflow-y-auto leading-relaxed shadow-inner">
                  {logs.length === 0 ? (
                    <p className="text-[#9ca3af] text-xs italic py-4 text-center">No active process logs.</p>
                  ) : (
                    logs.map((log, index) => (
                      <p key={index} className="text-[11.5px] text-[#374151] leading-snug border-b border-[#e5e7eb]/60 pb-2 last:border-b-0 last:pb-0">
                        {log}
                      </p>
                    ))
                  )}
                </div>

              </div>

            </div>

          </div>

        </main>

      </div>

      {/* ========================================================= */}
      {/* FLOATING ACTION BUTTONS & WIDGETS (Fuchsia/Purple & Royal Blue) */}
      {/* ========================================================= */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-auto">
        
        {/* Floating Video Assistant Button (Fuchsia-Purple Gradient) */}
        <button
          onClick={() => setIsVideoModalOpen(true)}
          className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#ec008c] via-[#b800b8] to-[#7928ca] text-white flex items-center justify-center shadow-[0_4px_16px_rgba(184,0,184,0.4)] hover:scale-105 active:scale-95 transition-all"
          title="Video Briefing & Brief Generator"
        >
          <Video className="w-5 h-5" />
        </button>

        {/* Floating Chat Bubble Button (Pink-Violet Gradient) */}
        <button
          onClick={() => setIsChatOpen(prev => !prev)}
          className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#ff0080] via-[#c026d3] to-[#7928ca] text-white flex items-center justify-center shadow-[0_4px_16px_rgba(255,0,128,0.4)] hover:scale-105 active:scale-95 transition-all"
          title="Tender AI Chatbot"
        >
          <MessageSquare className="w-5 h-5" />
        </button>

        {/* Process Counter Badge (Vibrant Royal Blue) */}
        <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#3b82f6] to-[#4338ca] text-white text-xs font-bold shadow-[0_4px_14px_rgba(67,56,202,0.4)] cursor-pointer hover:opacity-95">
          <span>{processCount} Process</span>
        </div>

      </div>

      {/* ========================================================= */}
      {/* CHATBOT DRAWER MODAL */}
      {/* ========================================================= */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[92vw] sm:w-[420px] max-h-[600px] bg-white rounded-2xl shadow-2xl border border-[#e5e7eb] overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#e6007a] via-[#b800b8] to-[#7b00ff] text-white">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span className="text-xs font-bold">Tender AI Intelligence Chat</span>
            </div>
            <button 
              onClick={() => setIsChatOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-hidden p-2">
            <TenderAnalystChatbot 
              tenderId={currentTender.id}
              tenderTitle={currentTender.title}
            />
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* UPDATE COMPANY PROFILE MODAL */}
      {/* ========================================================= */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#111827]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#e5e7eb] max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#f3f4f6] pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#9e00d9]" />
                <h3 className="text-sm font-bold text-[#111827]">Update Company Profile</h3>
              </div>
              <button 
                onClick={() => setIsProfileModalOpen(false)}
                className="text-[#9ca3af] hover:text-[#4b5563] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfileAndRerun} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#374151] mb-1">Company / Bidder Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#d1d5db] focus:border-[#9e00d9] focus:ring-1 focus:ring-[#9e00d9] outline-none text-[#111827]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#374151] mb-1">Turnover (₹ Lakhs)</label>
                  <input
                    type="number"
                    value={companyTurnover}
                    onChange={(e) => setCompanyTurnover(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#d1d5db] focus:border-[#9e00d9] focus:ring-1 focus:ring-[#9e00d9] outline-none text-[#111827] font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#374151] mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    value={companyExperience}
                    onChange={(e) => setCompanyExperience(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#d1d5db] focus:border-[#9e00d9] focus:ring-1 focus:ring-[#9e00d9] outline-none text-[#111827] font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#374151] mb-1">Industry Sector</label>
                <select
                  value={companySector}
                  onChange={(e) => setCompanySector(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#d1d5db] focus:border-[#9e00d9] focus:ring-1 focus:ring-[#9e00d9] outline-none text-[#111827]"
                >
                  <option value="Electrical & Solar Energy">Electrical & Solar Energy</option>
                  <option value="IT & Software Services">IT & Software Services</option>
                  <option value="Construction & Infrastructure">Construction & Infrastructure</option>
                  <option value="Medical Equipment & Supplies">Medical Equipment & Supplies</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#f3f4f6] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#e5e7eb] text-[#4b5563] font-bold hover:bg-[#f9fafb]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d9007e] via-[#9e00d9] to-[#7000ff] text-white font-bold shadow-[0_4px_12px_rgba(158,0,217,0.3)] hover:opacity-95 transition"
                >
                  Save & Re-evaluate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIDEO BRIEFING MODAL */}
      {/* ========================================================= */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#111827]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#e5e7eb] max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#f3f4f6] pb-3">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-[#ec008c]" />
                <h3 className="text-sm font-bold text-[#111827]">AI Video Briefing & Executive Summary</h3>
              </div>
              <button 
                onClick={() => setIsVideoModalOpen(false)}
                className="text-[#9ca3af] hover:text-[#4b5563] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-xl bg-[#111827] aspect-video flex flex-col items-center justify-center text-white p-6 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#e0007b] to-[#7b00ff] flex items-center justify-center text-white shadow-lg animate-pulse">
                <Video className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold">2-Minute AI Audio/Video Breakdown</p>
              <p className="text-[11px] text-[#9ca3af]">Analyzing tender key risks, BOQ specifications, and milestone penalties.</p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#111827] text-white text-xs font-bold hover:bg-black transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* BID DOCUMENT GENERATOR MODAL */}
      {/* ========================================================= */}
      <BidDocumentGeneratorModal
        isOpen={isBidModalOpen}
        onClose={() => setIsBidModalOpen(false)}
        tender={currentTender}
        companyId="comp_101"
        documentId="doc_101"
      />

    </div>
  );
};

export default TenderRegPage;
