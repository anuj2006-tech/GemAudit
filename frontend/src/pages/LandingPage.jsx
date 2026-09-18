import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Shield, Brain, Files, Activity, ArrowRight, Check, Sparkles,
  Lock, Zap, ChevronDown, Star,
  ShieldCheck, FileText, CheckCircle2, BarChart3, Scale, Clock,
  Cpu, Building, Award, ExternalLink, History, Layers
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: "How does GeM Audit AI verify contractor claims against statutory databases?",
      a: "The platform extracts the bidder's GSTIN, PAN, CIN, and EPFO details via forensic OCR and simultaneously queries 10 authoritative government registries (GSTN, PAN, MCA-21, EPFO, ESIC, GeM Blacklist, MSME Udyam, ISO, CPPP, CIBIL) via secure API Setu gateways in under 3 seconds."
    },
    {
      q: "How does the system detect photoshopped or altered PDF balance sheets?",
      a: "We deploy a 4-layer forensic analyzer: (1) Internal PDF creator tool metadata inspection, (2) Error Level Analysis (ELA) for pixel compression noise anomalies, (3) Micro-typography baseline alignment checks, and (4) Cross-claim mathematical truth checks against live government tax returns."
    },
    {
      q: "Why is the audit trail legally admissible for CVC and CAG inquiries?",
      a: "Every single API response, discrepancy score, officer override, and approval timestamp is cryptographically sealed with a SHA-256 hash. Once locked, the verification record cannot be altered or retroactively tampered with, protecting honest officers from false vigilance inquiries."
    },
    {
      q: "Does GeM Audit AI replace the procurement officer or committee?",
      a: "No. GeM Audit AI functions as an intelligent forensic co-pilot. It preserves absolute human authority with strict manual overrides, 48-hour clarification window tracking, and one-click auto-drafted legal rejection notices. It cuts manual evaluation time from 7 days down to 8 minutes."
    }
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">

      {/* Ambient background glows */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="fixed top-1/3 right-1/4 w-[700px] h-[700px] bg-blue-500/10 rounded-full blur-[180px] pointer-events-none z-0" />
      <div className="fixed bottom-10 left-1/3 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="fixed inset-0 bg-grid-pattern opacity-20 pointer-events-none z-0" />

      {/* Top Notification Strip */}
      <div className="relative z-10 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-blue-950/60 border-b border-indigo-500/20 py-2.5 px-4 text-center text-xs font-semibold text-slate-300 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="inline-flex items-center gap-1.5 text-white">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            Smart India Hackathon 2026: AI-Powered Public Procurement Forensic Platform is Live
          </span>
          <button
            onClick={() => navigate('/gem-compliance-dashboard')}
            className="ml-2 inline-flex items-center gap-1 text-indigo-300 hover:text-white transition font-bold underline underline-offset-2"
          >
            Launch Console <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 px-4 py-4 sm:px-8 lg:px-16 transition-all duration-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl bg-slate-900/80 border border-slate-800 px-6 py-3 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/gem-compliance-dashboard')}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-white flex items-center gap-1">
                GeM<span className="text-indigo-400">Audit AI</span>
              </span>
              <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase">GovTech Platform</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
            <a href="#features" className="hover:text-indigo-300 transition-colors">Forensic Core</a>
            <a href="#matrix" className="hover:text-indigo-300 transition-colors">10 Portals</a>
            <a href="#benchmarks" className="hover:text-indigo-300 transition-colors">Benchmarks</a>
            <a href="#slides" className="hover:text-indigo-300 transition-colors">SIH Deliverables</a>
            <a href="#faq" className="hover:text-indigo-300 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/gem-compliance-dashboard')}
              className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition"
            >
              Enter Dashboard
            </button>
            <button
              onClick={() => navigate('/gem-compliance-dashboard')}
              className="group flex items-center gap-2 px-4 py-2 text-xs font-bold text-white rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-lg shadow-indigo-500/25 transition"
            >
              <span>Launch Workspace</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-20 sm:pt-24 sm:pb-28 lg:px-16 text-center">
        <div className="inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 font-semibold mb-8">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>India's ₹4,00,000+ Crore ($48B+) Public Procurement Shield</span>
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
          <span className="text-slate-400">CVC & CAG Audit Compliant</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] max-w-5xl mx-auto">
          AI-Powered Fraud Prevention & Forensic Verification for <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">Government Bids</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Cross-reference contractor tender submissions across <strong>10 statutory registries in 3 seconds</strong>, eliminate photoshopped balance sheets with pixel forensics, and lock decisions with <strong>SHA-256 cryptographic audit seals</strong>.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => navigate('/gem-compliance-dashboard')}
            className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition transform hover:-translate-y-0.5"
          >
            <span>Open Officer Workspace</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={() => navigate('/gem-compliance')}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm shadow transition"
          >
            <Layers className="h-4 w-4 text-emerald-400" />
            <span>10-Portal Matrix</span>
          </button>
        </div>

        {/* 4 Core Hero Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto text-left">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">Evaluation Time</div>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-1">7 Days → 8m</div>
            <div className="text-xs text-slate-400 mt-1">⚡ 96% Time Saved</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">Review Cost per Bid</div>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-1">₹15,000 → ₹5</div>
            <div className="text-xs text-slate-400 mt-1">💰 99.9% Cost Slashed</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">Statutory Verification</div>
            <div className="text-2xl font-black text-cyan-400 font-mono mt-1">10 Portals</div>
            <div className="text-xs text-slate-400 mt-1">🌐 Under 3 Seconds</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">Audit Immunity</div>
            <div className="text-2xl font-black text-indigo-400 font-mono mt-1">SHA-256</div>
            <div className="text-xs text-slate-400 mt-1">🔒 100% CVC/CAG Proof</div>
          </div>
        </div>
      </section>


      {/* Section 1: 4 Core Forensic Pillars */}
      <section id="features" className="py-20 border-t border-slate-800/80 relative z-10 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-300 uppercase tracking-widest font-mono mb-2">
              Forensic Architecture
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-mono">
              Engineered for Procurement Vigilance
            </h2>
            <p className="mt-3 text-sm text-slate-400 max-w-2xl mx-auto">
              Automated multi-layer forensic detection to protect Indian public funds from insolvent shell companies, fabricated credentials, and tender fraud.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition group">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">10-Portal Registry Check</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Queries GSTN, PAN, MCA-21, EPFO, ESIC, GeM Blacklist, MSME Udyam, ISO, CPPP, and CIBIL in under 3 seconds per bid.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Forensic OCR & Pixel ELA</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Error Level Analysis (ELA) and micro-typography checks instantly flag photoshopped balance sheets and altered CA certificates.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">SHA-256 Digital Stamp</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Cryptographically locks all verification timestamps, discrepancy scores, and decisions, creating unalterable proof for CVC and CAG audits.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">48-Hour Seller Assistant</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tracks GeM's mandatory 48-hour clarification window and automatically generates legally compliant rejection notices with zero false inquiries.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Section 2: SIH 2026 Deliverables Showcase */}
      <section id="slides" className="py-20 border-t border-slate-800/80 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400 uppercase tracking-widest font-mono mb-2">
              SIH 2026 Presentation Suite
            </div>
            <h2 className="text-3xl font-black tracking-tight text-white font-mono">
              Presentation Assets & Hackathon Slides
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Interactive slides, comparison diagrams, and technical handoff guides prepared for the jury.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold">SLIDE 4</span>
                <h3 className="text-lg font-bold text-white mt-1">Feasibility & Viability</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Spiral notebook SIH template layout covering zero infrastructure overhaul, sub-3s OCR, and ₹4 Lakh Cr market viability.
                </p>
              </div>
              <a 
                href="/sih_feasibility_viability_slide.html" 
                target="_blank" 
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300"
              >
                View Slide 4 HTML <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">SLIDE 5</span>
                <h3 className="text-lg font-bold text-white mt-1">Benefits & Social Impact</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  8-Pillar circular wheel and split impact graphic detailing operational speed vs strategic governance benefits.
                </p>
              </div>
              <a 
                href="/sih_impact_and_benefits_slide.html" 
                target="_blank" 
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300"
              >
                View Slide 5 HTML <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">BENCHMARK</span>
                <h3 className="text-lg font-bold text-white mt-1">Comparative Bar Chart</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Head-to-head performance metrics comparing manual evaluation vs GeM Audit AI across time, cost, and statutory depth.
                </p>
              </div>
              <a 
                href="/comparison_bar_chart.html" 
                target="_blank" 
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300"
              >
                View Bar Chart HTML <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 border-t border-slate-800/80 relative z-10 bg-slate-950/60">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-white font-mono">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-400 mt-2">Technical and statutory inquiries answered</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 cursor-pointer transition"
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
              >
                <div className="flex items-center justify-between font-bold text-sm text-slate-200">
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-indigo-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </div>
                {openFaq === idx && (
                  <p className="mt-3 text-xs text-slate-300 leading-relaxed border-t border-slate-800 pt-3">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 px-6 text-center text-xs text-slate-400 bg-slate-950">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              G
            </div>
            <span className="font-bold text-slate-200">GeM Audit AI Platform</span>
            <span>•</span>
            <span>Smart India Hackathon 2026</span>
          </div>
          <div>
            Engineered for Procurement Evaluators, Vigilance Officers, and Tender Committees
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
