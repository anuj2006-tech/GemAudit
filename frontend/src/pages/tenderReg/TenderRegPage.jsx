import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/common/PageHeader';
import { 
  Sparkles, 
  UploadCloud, 
  Building2, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  Award, 
  Calendar, 
  TrendingUp, 
  ShieldCheck,
  RefreshCw,
  Sliders,
  Check
} from 'lucide-react';

const SECTORS = [
  'Electrical & Solar Energy',
  'IT Services & Software',
  'Construction & Infrastructure',
  'Medical Supplies & Equipment',
  'Defense & Heavy Machinery'
];

const DEFAULT_COMPANY = {
  name: 'Sunrise Solar & Electricals Ltd',
  sector: 'Electrical & Solar Energy',
  turnover_lakhs: '200',
  years_experience: '4',
  certifications: 'ISO 9001, Class A Electrical License, MNRE Registration'
};

const DEFAULT_DOC_TEXT = `OFFICIAL EXPERIENCE & ACCREDITATION CERTIFICATE
Company: Sunrise Solar & Electricals Ltd
Registration No: ELEC/2021/8849
Operating Experience: 4 Years (Established 2021)
Annual Financial Turnover (FY 2024-25): INR 200 Lakhs (₹2.0 Crore)

ACCORDED CERTIFICATIONS:
1. ISO 9001:2015 Quality Management Systems Accreditation
2. Class A Electrical Contractor License (State Inspectorate)
3. MNRE Approved Channel Partner for Rooftop Solar Projects

PROJECT EXECUTION RECORD:
- Completed 8.5MW Grid-Tied Rooftop Solar PV installation for Educational Campuses.
- High Voltage Substation erection & maintenance contracts completed across 3 districts.`;

const TenderRegPage = () => {
  // Step State: 1 = Profile & Upload, 2 = Processing, 3 = Results
  const [step, setStep] = useState(1);
  
  // Company Form State
  const [companyForm, setCompanyForm] = useState(DEFAULT_COMPANY);
  
  // Document Input State
  const [docFilename, setDocFilename] = useState('Sunrise_Experience_Cert.pdf');
  const [docText, setDocText] = useState(DEFAULT_DOC_TEXT);
  const [isDragOver, setIsDragOver] = useState(false);

  // Match Results State
  const [isMatching, setIsMatching] = useState(false);
  const [matchData, setMatchData] = useState(null);
  const [expandedTenderId, setExpandedTenderId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // ---------------------------------------------------------
  // Form Handlers
  // ---------------------------------------------------------
  const handleLoadPreset = () => {
    setCompanyForm(DEFAULT_COMPANY);
    setDocText(DEFAULT_DOC_TEXT);
    setDocFilename('Sunrise_Experience_Cert.pdf');
  };

  const handleFormChange = (e) => {
    setCompanyForm({ ...companyForm, [e.target.name]: e.target.value });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setDocFilename(file.name);
      const reader = new FileReader();
      reader.onload = (evt) => {
        setDocText(evt.target.result || `Extracted text from ${file.name}`);
      };
      reader.readAsText(file);
    }
  };

  // ---------------------------------------------------------
  // Run End-to-End AI Matching Engine
  // ---------------------------------------------------------
  const handleRunMatcher = async () => {
    if (!docText.trim()) {
      alert('Please enter or upload a company certificate document text.');
      return;
    }

    setIsMatching(true);
    setErrorMessage('');
    setStep(2);

    try {
      // 1. Create Company Profile
      const compRes = await fetch('/api/tender-reg/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(companyForm)
      });
      if (!compRes.ok) throw new Error('Failed to create company profile.');
      const company = await compRes.json();

      // 2. Synchronous Document Upload & AI Analysis Summary
      const docRes = await fetch(`/api/tender-reg/companies/${company.id}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: docFilename,
          text: docText
        })
      });
      if (!docRes.ok) throw new Error('Failed to analyze document.');
      const document = await docRes.json();

      // 3. AI Tender Matcher Call
      const matchRes = await fetch(`/api/tender-reg/companies/${company.id}/documents/${document.id}/match`, {
        method: 'POST'
      });
      if (!matchRes.ok) throw new Error('Failed to execute AI tender comparison.');
      const results = await matchRes.json();

      setMatchData(results);
      setStep(3);
      if (results.matches && results.matches.length > 0) {
        setExpandedTenderId(results.matches[0].tender_id);
      }
    } catch (err) {
      console.error('TenderReg Match Error:', err);
      setErrorMessage(err.message || 'An unexpected error occurred during matching.');
      setStep(1);
    } finally {
      setIsMatching(false);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader 
        title="TenderReg — AI Tender Matcher" 
        subtitle="Match company credentials and uploaded evidence against live government tenders using rule-based eligibility & LLM reasoning" 
      />

      <div className="space-y-8 max-w-6xl mx-auto pb-12">
        
        {/* Step Indicator Header */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:px-6 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 font-mono font-bold text-base shadow-sm">
              AI
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">TenderReg Autonomous Match Pipeline</h2>
              <p className="text-xs text-slate-400 font-mono">Instant single-stage eligibility evaluation & LLM scoring engine</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLoadPreset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20 transition"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Load Preset Sample</span>
            </button>
            {step === 3 && (
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>New Match Run</span>
              </button>
            )}
          </div>
        </div>

        {/* ---------------------------------------------------------
            STEP 1 & 2: COMPANY PROFILE & DOCUMENT UPLOAD FORM
           --------------------------------------------------------- */}
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Company Profile Form */}
            <div className="lg:col-span-6 rounded-3xl border border-slate-800 bg-slate-950/70 p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center gap-2.5 border-b border-slate-800/80 pb-4">
                <Building2 className="h-5 w-5 text-indigo-400" />
                <h3 className="text-base font-extrabold text-white tracking-tight">
                  Step 1: Company Profile Credentials
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={companyForm.name}
                    onChange={handleFormChange}
                    placeholder="e.g. Sunrise Electricals Ltd"
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Primary Industry Sector
                  </label>
                  <select
                    name="sector"
                    value={companyForm.sector}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition cursor-pointer"
                  >
                    {SECTORS.map(s => (
                      <option key={s} value={s} className="bg-slate-950 text-white">{s}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Annual Turnover (₹ Lakhs)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="turnover_lakhs"
                        value={companyForm.turnover_lakhs}
                        onChange={handleFormChange}
                        placeholder="200"
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-4 pr-10 py-2.5 text-sm text-white font-mono focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500">Lakhs</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Years Experience
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="years_experience"
                        value={companyForm.years_experience}
                        onChange={handleFormChange}
                        placeholder="4"
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-4 pr-10 py-2.5 text-sm text-white font-mono focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500">Yrs</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Certifications (Comma separated)
                  </label>
                  <input
                    type="text"
                    name="certifications"
                    value={companyForm.certifications}
                    onChange={handleFormChange}
                    placeholder="ISO 9001, Class A License, MNRE Registration"
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Company Document Upload */}
            <div className="lg:col-span-6 rounded-3xl border border-slate-800 bg-slate-950/70 p-6 sm:p-8 shadow-2xl space-y-6 flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-2.5">
                  <FileText className="h-5 w-5 text-indigo-400" />
                  <h3 className="text-base font-extrabold text-white tracking-tight">
                    Step 2: Upload Evidence Document
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                  {docFilename}
                </span>
              </div>

              {/* Drag & Drop Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                className={`rounded-2xl border-2 border-dashed p-4 text-center transition ${
                  isDragOver ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                  <UploadCloud className="h-4 w-4 text-indigo-400" />
                  <span>Drag & drop PDF/TXT file or paste document text below</span>
                </div>
              </div>

              {/* Text Area for Document Excerpt */}
              <div className="flex-1 space-y-1.5">
                <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
                  Extracted Document Text / Certificate Body
                </label>
                <textarea
                  rows={8}
                  value={docText}
                  onChange={(e) => setDocText(e.target.value)}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 p-4 text-xs font-mono text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition custom-scrollbar"
                  placeholder="Paste certificate or capability statement text here..."
                />
              </div>

              {errorMessage && (
                <p className="text-xs font-mono text-rose-400 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                  {errorMessage}
                </p>
              )}

              {/* CTA Action Button */}
              <button
                onClick={handleRunMatcher}
                className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-xl shadow-orange-500/20 active:scale-[0.99] transition"
              >
                <span>Run AI Tender Matcher</span>
                <Sparkles className="h-4.5 w-4.5" />
              </button>

            </div>

          </div>
        )}

        {/* ---------------------------------------------------------
            STEP 2: PROCESSING LOADING STATE
           --------------------------------------------------------- */}
        {step === 2 && (
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-12 text-center shadow-2xl space-y-6 max-w-xl mx-auto my-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 shadow-inner mx-auto animate-pulse">
              <RefreshCw className="h-8 w-8 animate-spin" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-extrabold text-white tracking-tight">Evaluating Tender Eligibility & LLM Fit</h3>
              <p className="text-xs text-slate-400 font-mono">
                Executing rule-based parameter check + OpenRouter LLM comparative analysis...
              </p>
            </div>

            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 animate-pulse w-3/4" />
            </div>
          </div>
        )}

        {/* ---------------------------------------------------------
            STEP 3: RESULTS SCREEN
           --------------------------------------------------------- */}
        {step === 3 && matchData && (
          <div className="space-y-8">
            
            {/* Top AI Document Summary Card */}
            <div className="rounded-3xl border border-indigo-500/40 bg-gradient-to-r from-slate-950 via-indigo-950/20 to-slate-950 p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-indigo-300 font-mono">
                    AI Document Analysis Summary
                  </h3>
                </div>

                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full font-bold">
                  {matchData.company?.name}
                </span>
              </div>

              <p className="text-sm text-slate-200 leading-relaxed font-sans bg-slate-900/80 p-4 rounded-2xl border border-slate-800/80">
                "{matchData.document?.analysis_summary}"
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-indigo-400" />
                  Sector: <strong className="text-white">{matchData.company?.sector}</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                  Turnover: <strong className="text-white">₹{matchData.company?.turnover_lakhs} Lakhs</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                  Experience: <strong className="text-white">{matchData.company?.years_experience} Years</strong>
                </span>
              </div>
            </div>

            {/* Ranked Tender Match Results List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
                  Ranked Government Tender Matches ({matchData.matches.length})
                </h3>
                <span className="text-[11px] font-mono text-slate-500">Sorted by AI Match Score</span>
              </div>

              <div className="space-y-4">
                {matchData.matches.map(matchItem => {
                  const tender = matchItem.tender;
                  const isExpanded = expandedTenderId === tender.id;

                  // Color Coding for Match Score
                  let scoreBadgeClass = 'bg-rose-500/15 text-rose-400 border-rose-500/30';
                  if (matchItem.eligibility_status === 'eligible' || matchItem.match_score >= 75) {
                    scoreBadgeClass = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
                  } else if (matchItem.eligibility_status === 'partial' || matchItem.match_score >= 40) {
                    scoreBadgeClass = 'bg-amber-500/15 text-amber-400 border-amber-500/30';
                  }

                  // Eligibility Stamp Badge
                  let eligBadgeClass = 'bg-slate-800 text-slate-400 border-slate-700';
                  let EligIcon = AlertTriangle;
                  let eligText = 'PARTIAL MATCH';

                  if (matchItem.eligibility_status === 'eligible') {
                    eligBadgeClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
                    EligIcon = CheckCircle2;
                    eligText = 'ELIGIBLE';
                  } else if (matchItem.eligibility_status === 'not_eligible') {
                    eligBadgeClass = 'bg-rose-500/20 text-rose-400 border-rose-500/40';
                    EligIcon = XCircle;
                    eligText = 'NOT ELIGIBLE';
                  }

                  return (
                    <div 
                      key={tender.id}
                      className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-xl hover:border-slate-700 transition space-y-4"
                    >
                      {/* Top Title & Badges Row */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded border border-indigo-500/20">
                              {tender.sector}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500 truncate">
                              {tender.department}
                            </span>
                          </div>
                          
                          <h4 className="text-base font-bold text-white tracking-tight leading-snug">
                            {tender.title}
                          </h4>
                        </div>

                        {/* Badges */}
                        <div className="flex items-center gap-3 shrink-0">
                          {/* Match Score Badge */}
                          <div className={`flex flex-col items-center px-4 py-2 rounded-2xl border ${scoreBadgeClass}`}>
                            <span className="text-lg font-extrabold font-mono leading-none">{matchItem.match_score}%</span>
                            <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 mt-1">Match Score</span>
                          </div>

                          {/* Eligibility Stamp */}
                          <div className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl border text-xs font-mono font-extrabold tracking-wider ${eligBadgeClass}`}>
                            <EligIcon className="h-4 w-4" />
                            <span>{eligText}</span>
                          </div>
                        </div>

                      </div>

                      {/* AI Reasoning Paragraph */}
                      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-400">
                          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                          <span>AI Fit Reasoning:</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans">
                          {matchItem.match_reasoning}
                        </p>
                      </div>

                      {/* Toggle Expandable Eligibility Criteria */}
                      <div className="pt-2">
                        <button
                          onClick={() => setExpandedTenderId(isExpanded ? null : tender.id)}
                          className="flex items-center gap-2 text-xs font-mono text-indigo-400 hover:text-indigo-300 font-semibold transition"
                        >
                          <span>{isExpanded ? 'Hide Eligibility Criteria' : 'View Mandatory Criteria & Source Excerpts'}</span>
                          {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                        </button>
                      </div>

                      {/* Expandable Criteria Details */}
                      {isExpanded && (
                        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4 animate-fadeIn">
                          <h5 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                            Tender Requirements & Source Excerpts
                          </h5>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                              <span className="text-slate-500 block text-[10px]">MIN TURNOVER</span>
                              <span className="text-white font-bold">₹{tender.min_turnover_lakhs} Lakhs</span>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                              <span className="text-slate-500 block text-[10px]">MIN EXPERIENCE</span>
                              <span className="text-white font-bold">{tender.min_years_experience} Years</span>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                              <span className="text-slate-500 block text-[10px]">DEADLINE</span>
                              <span className="text-white font-bold">{tender.submission_deadline}</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            {tender.eligibility_criteria?.map(crit => (
                              <div key={crit.id} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                                <p className="text-xs text-slate-200 font-medium">
                                  • {crit.description}
                                </p>
                                <p className="text-[11px] font-mono text-slate-400 italic">
                                  "{crit.source_excerpt}"
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default TenderRegPage;
