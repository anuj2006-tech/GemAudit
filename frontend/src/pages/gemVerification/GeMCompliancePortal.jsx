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
  Filter, 
  RefreshCw, 
  ChevronRight, 
  Award, 
  ExternalLink, 
  Check, 
  X, 
  HelpCircle, 
  Download, 
  Printer, 
  Info,
  Sparkles,
  Zap,
  Lock,
  Layers,
  FileCheck,
  UserCheck
} from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import { 
  fetchGeMTenders, 
  fetchBiddersForTender, 
  triggerBidderVerification, 
  submitOfficerDecision 
} from '../../services/gemService';

export default function GeMCompliancePortal() {
  const [tenders, setTenders] = useState([]);
  const [selectedTender, setSelectedTender] = useState(null);
  const [bidders, setBidders] = useState([]);
  const [selectedBidder, setSelectedBidder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');

  // Decision Modal State
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [decisionType, setDecisionType] = useState('QUALIFIED');
  const [officerRemarks, setOfficerRemarks] = useState('');
  const [submittingDecision, setSubmittingDecision] = useState(false);

  // Certificate Modal State
  const [showCertModal, setShowCertModal] = useState(false);

  useEffect(() => {
    loadTenders();
  }, []);

  const loadTenders = async () => {
    try {
      setLoading(true);
      const fetchedTenders = await fetchGeMTenders();
      setTenders(fetchedTenders);
      if (fetchedTenders.length > 0) {
        const firstTender = fetchedTenders[0];
        setSelectedTender(firstTender);
        await loadBidders(firstTender.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadBidders = async (tenderId) => {
    try {
      setLoading(true);
      const fetchedBidders = await fetchBiddersForTender(tenderId);
      setBidders(fetchedBidders);
      if (fetchedBidders.length > 0) {
        setSelectedBidder(fetchedBidders[0]);
      } else {
        setSelectedBidder(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTenderChange = async (e) => {
    const tId = e.target.value;
    const found = tenders.find(t => t.id === tId);
    if (found) {
      setSelectedTender(found);
      await loadBidders(found.id);
    }
  };

  const handleReVerify = async (bidderId) => {
    try {
      setVerifyingId(bidderId);
      const updatedVerification = await triggerBidderVerification(bidderId);
      setBidders(prev => prev.map(b => b.id === bidderId ? {
        ...b,
        latestVerification: updatedVerification,
        verifiedAt: new Date().toISOString()
      } : b));
      if (selectedBidder && selectedBidder.id === bidderId) {
        setSelectedBidder(prev => ({
          ...prev,
          latestVerification: updatedVerification,
          verifiedAt: new Date().toISOString()
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setVerifyingId(null);
    }
  };

  const handleOpenDecisionModal = (type) => {
    setDecisionType(type);
    setOfficerRemarks('');
    setShowDecisionModal(true);
  };

  const handleSubmitDecision = async () => {
    if (!selectedBidder) return;
    try {
      setSubmittingDecision(true);
      const updatedBidder = await submitOfficerDecision(selectedBidder.id, decisionType, officerRemarks);
      setBidders(prev => prev.map(b => b.id === updatedBidder.id ? updatedBidder : b));
      setSelectedBidder(updatedBidder);
      setShowDecisionModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingDecision(false);
    }
  };

  // Filter Bidders
  const filteredBidders = bidders.filter(b => {
    const matchesSearch = b.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.gstin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (b.udyamNumber && b.udyamNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (riskFilter === 'ALL') return matchesSearch;
    return matchesSearch && (b.latestVerification?.riskLevel === riskFilter);
  });

  const activeVerification = selectedBidder?.latestVerification;
  const portalChecks = activeVerification?.portalChecks;

  // Render Risk Badge
  const renderRiskBadge = (riskLevel) => {
    switch (riskLevel) {
      case 'LOW':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"><ShieldCheck className="w-3.5 h-3.5" /> LOW RISK</span>;
      case 'MEDIUM':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800"><AlertTriangle className="w-3.5 h-3.5" /> MEDIUM RISK</span>;
      case 'HIGH':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-300 dark:border-orange-800"><AlertTriangle className="w-3.5 h-3.5" /> HIGH RISK</span>;
      case 'CRITICAL':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800 animate-pulse"><XCircle className="w-3.5 h-3.5" /> CRITICAL RISK</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">UNVERIFIED</span>;
    }
  };

  // Render Portal Check Status Badge
  const renderCheckStatusBadge = (status) => {
    switch (status) {
      case 'VERIFIED':
        return <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1"><Check className="w-3 h-3" /> VERIFIED</span>;
      case 'EXEMPTED':
        return <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1"><Sparkles className="w-3 h-3" /> EXEMPTED</span>;
      case 'WARNING':
      case 'PARTIAL':
        return <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> WARNING</span>;
      case 'FAILED':
      case 'DEBARRED':
        return <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center gap-1"><X className="w-3 h-3" /> NON-COMPLIANT</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">N/A</span>;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Procurement Officer Bar */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 py-5 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  GeM Bid Compliance Verification Engine
                </h1>
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                  GOVT PROCUREMENT AI
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Automated multi-portal statutory verification & decision support for Procurement Officers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 rounded-xl px-3.5 py-2 flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">Evaluation Efficiency</span>
                <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">78% Effort Time Reduced</span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-6 max-w-[1700px] mx-auto w-full">
          {/* Active Tender Selector & Global Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tender Selector Card */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4" /> Active Procurement Tender
                  </span>
                  <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg text-slate-600 dark:text-slate-300 font-semibold">
                    GeM ID: {selectedTender?.id}
                  </span>
                </div>

                <select 
                  value={selectedTender?.id || ''} 
                  onChange={handleTenderChange}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                >
                  {tenders.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.id} - {t.title}
                    </option>
                  ))}
                </select>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  <strong className="text-slate-900 dark:text-white">Department:</strong> {selectedTender?.department}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Est. Value: <strong className="text-slate-900 dark:text-white font-mono">₹{(selectedTender?.estimatedValue/10000000).toFixed(2)} Cr</strong></span>
                <span>Req. Local Content: <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{selectedTender?.miiRequirementPercent}% (Class-I)</strong></span>
                <span>Closing Date: <strong className="text-slate-900 dark:text-white">{selectedTender?.closingDate}</strong></span>
              </div>
            </div>

            {/* Quick Metrics Banner */}
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-5 text-white shadow-xl border border-indigo-800/50 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-400" /> Bidder Verification Overview
                </span>
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              </div>

              <div className="grid grid-cols-2 gap-4 my-2">
                <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/10">
                  <span className="text-[10px] font-bold text-indigo-200 uppercase">Total Bids</span>
                  <div className="text-2xl font-black">{bidders.length}</div>
                </div>
                <div className="bg-emerald-500/20 rounded-xl p-3 backdrop-blur-sm border border-emerald-500/30">
                  <span className="text-[10px] font-bold text-emerald-200 uppercase">Compliant Bids</span>
                  <div className="text-2xl font-black text-emerald-300">
                    {bidders.filter(b => b.latestVerification?.riskLevel === 'LOW').length}
                  </div>
                </div>
                <div className="bg-amber-500/20 rounded-xl p-3 backdrop-blur-sm border border-amber-500/30">
                  <span className="text-[10px] font-bold text-amber-200 uppercase">Under Warnings</span>
                  <div className="text-2xl font-black text-amber-300">
                    {bidders.filter(b => b.latestVerification?.riskLevel === 'MEDIUM' || b.latestVerification?.riskLevel === 'HIGH').length}
                  </div>
                </div>
                <div className="bg-rose-500/20 rounded-xl p-3 backdrop-blur-sm border border-rose-500/30">
                  <span className="text-[10px] font-bold text-rose-200 uppercase">Critical Risks</span>
                  <div className="text-2xl font-black text-rose-300">
                    {bidders.filter(b => b.latestVerification?.riskLevel === 'CRITICAL').length}
                  </div>
                </div>
              </div>

              <span className="text-[11px] text-indigo-300 font-medium">
                Automated check active for Udyam, GSTN, PAN, MCA21, Startup India, EPFO, ESIC, DigiLocker, CPPP.
              </span>
            </div>
          </div>

          {/* Main 2-Column Evaluation Workspace */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Left Column: Bidder List & Quick Stats (5 Cols) */}
            <div className="xl:col-span-4 space-y-4">
              {/* Search & Filter Toolbar */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="Search by Bidder Name, GSTIN, URN..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {['ALL', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(r => (
                    <button
                      key={r}
                      onClick={() => setRiskFilter(r)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition shrink-0 ${
                        riskFilter === r 
                          ? 'bg-indigo-600 text-white shadow-sm' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {r === 'ALL' ? 'All Risks' : r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bidder List Cards */}
              <div className="space-y-3">
                {filteredBidders.map(bidder => {
                  const isSelected = selectedBidder?.id === bidder.id;
                  const v = bidder.latestVerification;
                  const isVerifying = verifyingId === bidder.id;

                  return (
                    <div
                      key={bidder.id}
                      onClick={() => setSelectedBidder(bidder)}
                      className={`bg-white dark:bg-slate-900 rounded-2xl border p-4 cursor-pointer transition-all duration-200 relative overflow-hidden ${
                        isSelected 
                          ? 'border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-500/20 shadow-md' 
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
                      }`}
                    >
                      {isSelected && <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-indigo-600" />}

                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white line-clamp-1">
                            {bidder.companyName}
                          </h3>
                          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500">
                            <span>{bidder.gemSellerId}</span>
                            <span>•</span>
                            <span>{bidder.enterpriseType || 'General'}</span>
                          </div>
                        </div>

                        {renderRiskBadge(v?.riskLevel)}
                      </div>

                      {/* Score Bar & Local Content Badge */}
                      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-slate-500">Score:</span>
                          <span className={`font-mono font-black ${
                            (v?.complianceScore || 0) >= 80 ? 'text-emerald-600 dark:text-emerald-400' :
                            (v?.complianceScore || 0) >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'
                          }`}>
                            {v?.complianceScore || 0}%
                          </span>
                        </div>

                        <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-800">
                          MII: {bidder.localContentDeclaredPercent}%
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReVerify(bidder.id);
                          }}
                          disabled={isVerifying}
                          className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          title="Run Live Re-Verification"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin text-indigo-600' : ''}`} />
                        </button>
                      </div>

                      {/* Officer Decision Tag if present */}
                      {bidder.decisionStatus && bidder.decisionStatus !== 'PENDING' && (
                        <div className={`mt-2 py-1 px-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center justify-between ${
                          bidder.decisionStatus === 'QUALIFIED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                          bidder.decisionStatus === 'DISQUALIFIED' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                          'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          <span>Officer Decision: {bidder.decisionStatus}</span>
                          <UserCheck className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Multi-Portal Compliance Inspector & AI Decision Support (7 Cols) */}
            <div className="xl:col-span-8 space-y-6">
              {selectedBidder ? (
                <>
                  {/* Bidder Header Card */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-black text-slate-900 dark:text-white">
                          {selectedBidder.companyName}
                        </h2>
                        {renderRiskBadge(activeVerification?.riskLevel)}
                      </div>
                      <p className="text-xs text-slate-500 font-mono flex items-center gap-3">
                        <span>GSTIN: <strong className="text-slate-700 dark:text-slate-300">{selectedBidder.gstin}</strong></span>
                        <span>PAN: <strong className="text-slate-700 dark:text-slate-300">{selectedBidder.panNumber}</strong></span>
                        <span>CIN: <strong className="text-slate-700 dark:text-slate-300">{selectedBidder.cinNumber}</strong></span>
                      </p>
                    </div>

                    {/* Procurement Officer Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setShowCertModal(true)}
                        className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
                      >
                        <Printer className="w-4 h-4" /> Audit Cert
                      </button>

                      <button
                        onClick={() => handleOpenDecisionModal('QUALIFIED')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold px-4 py-2 rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Qualify
                      </button>

                      <button
                        onClick={() => handleOpenDecisionModal('SEEK_CLARIFICATION')}
                        className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold px-3.5 py-2 rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center gap-1.5"
                      >
                        <HelpCircle className="w-4 h-4" /> Seek Notice
                      </button>

                      <button
                        onClick={() => handleOpenDecisionModal('DISQUALIFIED')}
                        className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold px-4 py-2 rounded-xl shadow-lg shadow-rose-500/20 transition flex items-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" /> Disqualify
                      </button>
                    </div>
                  </div>

                  {/* AI Recommendation Engine Banner */}
                  {activeVerification?.aiRecommendation && (
                    <div className={`rounded-2xl p-6 border shadow-sm ${
                      activeVerification.aiRecommendation.color === 'emerald'
                        ? 'bg-emerald-500/10 border-emerald-200 dark:border-emerald-800/80 text-emerald-950 dark:text-emerald-100' :
                      activeVerification.aiRecommendation.color === 'amber'
                        ? 'bg-amber-500/10 border-amber-200 dark:border-amber-800/80 text-amber-950 dark:text-amber-100' :
                        'bg-rose-500/10 border-rose-200 dark:border-rose-800/80 text-rose-950 dark:text-rose-100'
                    }`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            <span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                              AI Verification Engine Recommendation
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                              activeVerification.aiRecommendation.color === 'emerald' ? 'bg-emerald-600 text-white' :
                              activeVerification.aiRecommendation.color === 'amber' ? 'bg-amber-600 text-white' : 'bg-rose-600 text-white'
                            }`}>
                              {activeVerification.aiRecommendation.recommendation}
                            </span>
                          </div>

                          <p className="text-sm font-semibold leading-relaxed">
                            {activeVerification.aiRecommendation.summary}
                          </p>

                          <ul className="space-y-1.5 mt-3 text-xs font-medium">
                            {activeVerification.aiRecommendation.actionItems?.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-current mt-1.5 shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Visual Compliance Meter */}
                        <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm shrink-0 min-w-[120px]">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Compliance</span>
                          <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                            {activeVerification.complianceScore}%
                          </span>
                          <span className="text-[10px] text-slate-500 font-semibold mt-1">
                            {activeVerification.passedChecksCount}/10 Checks Passed
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 10 Statutory Portal Inspection Matrix */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                        <Layers className="w-4 h-4 text-indigo-600" /> Multi-Portal Statutory Inspection Matrix (10 Government Databases)
                      </h3>
                      <span className="text-xs text-slate-400 font-mono">Real-time Cross-Verification</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* 1. Udyam MSME */}
                      {portalChecks?.udyam && (
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-slate-900 dark:text-white">1. Udyam / MSME Portal</span>
                            {renderCheckStatusBadge(portalChecks.udyam.status)}
                          </div>
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{portalChecks.udyam.title}</p>
                          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{portalChecks.udyam.details}</p>
                        </div>
                      )}

                      {/* 2. GSTN */}
                      {portalChecks?.gstn && (
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-slate-900 dark:text-white">2. GSTN Tax Portal</span>
                            {renderCheckStatusBadge(portalChecks.gstn.status)}
                          </div>
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{portalChecks.gstn.title}</p>
                          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{portalChecks.gstn.details}</p>
                        </div>
                      )}

                      {/* 3. Income Tax */}
                      {portalChecks?.incomeTax && (
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-slate-900 dark:text-white">3. PAN & Income Tax e-Filing</span>
                            {renderCheckStatusBadge(portalChecks.incomeTax.status)}
                          </div>
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{portalChecks.incomeTax.title}</p>
                          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{portalChecks.incomeTax.details}</p>
                        </div>
                      )}

                      {/* 4. MCA21 */}
                      {portalChecks?.mca21 && (
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-slate-900 dark:text-white">4. MCA21 Corporate Registry</span>
                            {renderCheckStatusBadge(portalChecks.mca21.status)}
                          </div>
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{portalChecks.mca21.title}</p>
                          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{portalChecks.mca21.details}</p>
                        </div>
                      )}

                      {/* 5. Startup India */}
                      {portalChecks?.startupNsic && (
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-slate-900 dark:text-white">5. Startup India & NSIC</span>
                            {renderCheckStatusBadge(portalChecks.startupNsic.status)}
                          </div>
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{portalChecks.startupNsic.title}</p>
                          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{portalChecks.startupNsic.details}</p>
                        </div>
                      )}

                      {/* 6. EPFO & ESIC */}
                      {portalChecks?.epfoEsic && (
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-slate-900 dark:text-white">6. EPFO & ESIC Compliance</span>
                            {renderCheckStatusBadge(portalChecks.epfoEsic.status)}
                          </div>
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{portalChecks.epfoEsic.title}</p>
                          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{portalChecks.epfoEsic.details}</p>
                        </div>
                      )}

                      {/* 7. Make in India */}
                      {portalChecks?.makeInIndia && (
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-slate-900 dark:text-white">7. Make in India (Local Content)</span>
                            {renderCheckStatusBadge(portalChecks.makeInIndia.status)}
                          </div>
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{portalChecks.makeInIndia.title}</p>
                          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{portalChecks.makeInIndia.details}</p>
                        </div>
                      )}

                      {/* 8. OEM & DigiLocker */}
                      {portalChecks?.oemDigiLocker && (
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-slate-900 dark:text-white">8. OEM Auth & DigiLocker</span>
                            {renderCheckStatusBadge(portalChecks.oemDigiLocker.status)}
                          </div>
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{portalChecks.oemDigiLocker.title}</p>
                          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{portalChecks.oemDigiLocker.details}</p>
                        </div>
                      )}

                      {/* 9. Blacklisting */}
                      {portalChecks?.blacklisting && (
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-slate-900 dark:text-white">9. CPPP & GeM Blacklisting</span>
                            {renderCheckStatusBadge(portalChecks.blacklisting.status)}
                          </div>
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{portalChecks.blacklisting.title}</p>
                          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{portalChecks.blacklisting.details}</p>
                        </div>
                      )}

                      {/* 10. Tender Eligibility */}
                      {portalChecks?.tenderEligibility && (
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-slate-900 dark:text-white">10. Tender Specific Criteria</span>
                            {renderCheckStatusBadge(portalChecks.tenderEligibility.status)}
                          </div>
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{portalChecks.tenderEligibility.title}</p>
                          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{portalChecks.tenderEligibility.details}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-500">
                  Select a bidder from the left list to inspect multi-portal compliance verification records.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Procurement Officer Decision Modal */}
      {showDecisionModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-indigo-600" /> Confirm Procurement Officer Action
              </h3>
              <button onClick={() => setShowDecisionModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                You are submitting an official decision for bidder: <strong className="text-slate-900 dark:text-white">{selectedBidder?.companyName}</strong>.
              </p>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Decision Type</label>
                <select
                  value={decisionType}
                  onChange={(e) => setDecisionType(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold"
                >
                  <option value="QUALIFIED">QUALIFIED - Permit to Financial Bid Opening</option>
                  <option value="SEEK_CLARIFICATION">SEEK CLARIFICATION - Issue GeM Notice</option>
                  <option value="DISQUALIFIED">DISQUALIFIED - Reject Technical Bid</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Officer Justification & Audit Remarks</label>
                <textarea
                  rows={4}
                  placeholder="Enter detailed reasons or specific statutory clauses referenced..."
                  value={officerRemarks}
                  onChange={(e) => setOfficerRemarks(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs font-medium focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setShowDecisionModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitDecision}
                disabled={submittingDecision}
                className="px-5 py-2 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 transition flex items-center gap-1.5"
              >
                {submittingDecision && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                Confirm & Record Audit Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable GeM Compliance Audit Certificate Modal */}
      {showCertModal && selectedBidder && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-2xl max-w-3xl w-full p-8 shadow-2xl space-y-6 my-8 print:p-0 print:shadow-none font-sans">
            {/* Header */}
            <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black uppercase tracking-wider text-slate-900">
                  Government e-Marketplace (GeM)
                </h2>
                <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest mt-0.5">
                  Statutory Bid Compliance Audit Certificate
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-500 block">Certificate ID</span>
                <span className="text-xs font-mono font-bold">GEM-AUD-2026-98412</span>
              </div>
            </div>

            {/* Certificate Details */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 font-semibold block">Tender Identification:</span>
                <strong className="text-sm font-bold block">{selectedTender?.id}</strong>
                <span className="text-slate-600 block line-clamp-1">{selectedTender?.title}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block">Verified Bidder Enterprise:</span>
                <strong className="text-sm font-bold block">{selectedBidder.companyName}</strong>
                <span className="text-slate-600 block">GSTIN: {selectedBidder.gstin} | PAN: {selectedBidder.panNumber}</span>
              </div>
            </div>

            {/* Audit Summary Box */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase">Overall Compliance Score</span>
                <span className="text-lg font-mono font-black text-indigo-700">{activeVerification?.complianceScore}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase">Assessed Risk Level</span>
                <strong className="text-xs font-black">{activeVerification?.riskLevel}</strong>
              </div>
            </div>

            {/* 10-Portal Summary Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider">Statutory Verification Record Summary</h4>
              <table className="w-full text-[11px] border border-slate-200">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2 text-left">Statutory Portal</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Key Verification Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {portalChecks && Object.values(portalChecks).map((check, i) => (
                    <tr key={i}>
                      <td className="p-2 font-bold">{check.portalName}</td>
                      <td className="p-2 font-extrabold">{check.status}</td>
                      <td className="p-2 text-slate-600 font-mono text-[10px]">{check.details?.substring(0, 70)}...</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Digital Signature Footer */}
            <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 text-[10px] block">Cryptographic Hash Verification</span>
                <span className="font-mono text-[10px] text-slate-600">SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span>
              </div>

              <div className="text-right">
                <div className="h-8 border-b border-slate-400 w-36 mb-1" />
                <span className="text-[10px] font-bold uppercase text-slate-700 block">Procurement Officer</span>
                <span className="text-[9px] text-slate-500">Government e-Marketplace</span>
              </div>
            </div>

            {/* Modal Controls */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 print:hidden">
              <button
                onClick={() => setShowCertModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 text-xs font-black bg-indigo-600 text-white rounded-xl shadow-lg flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
