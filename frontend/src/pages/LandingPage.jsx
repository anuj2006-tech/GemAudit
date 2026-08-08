import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Brain, Files, Activity, ArrowRight, Check, Sparkles, Terminal,
  Lock, Zap, ChevronDown, Star,
  ShieldCheck, FileText, CheckCircle2, BarChart3
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [activeConsoleTab, setActiveConsoleTab] = useState('overview');
  const [openFaq, setOpenFaq] = useState(0);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setContactForm({ name: '', email: '', message: '' });
    }, 3000);
  };

  const faqs = [
    {
      q: "How does tenant data isolation work in TenderAI?",
      a: "TenderAI implements strict PostgreSQL Row-Level Security (RLS) policies alongside isolated vector store indexes. Your organization's documents, extracted chunks, and RAG embeddings are strictly bound to your company ID at the database layer."
    },
    {
      q: "Can TenderAI analyze complex PDF, DOCX, and scanned tender specifications?",
      a: "Yes. Our multi-modal parser automatically extracts tabular data, legal clauses, requirement matrices, and technical constraints from unstructured documents with 99.4% precision."
    },
    {
      q: "How fast does the RAG vector engine evaluate proposal drafts against RFCs?",
      a: "Queries execute in under 250ms across millions of vector embeddings. The engine automatically highlights non-compliant clauses and risks before submission."
    },
    {
      q: "Can we upgrade or downgrade our plan anytime?",
      a: "Absolutely. Plan changes take effect immediately with pro-rated billing directly managed inside your company administrative console."
    }
  ];

  return (
    <div className="min-h-screen bg-[#100e0c] text-slate-100 font-sans selection:bg-orange-400 selection:text-white relative overflow-x-hidden">

      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-orange-600/15 rounded-full blur-[140px] pointer-events-none animate-ambient-1 z-0" />
      <div className="fixed top-1/3 right-1/4 w-[700px] h-[700px] bg-orange-500/15 rounded-full blur-[160px] pointer-events-none animate-ambient-2 z-0" />
      <div className="fixed bottom-10 left-1/3 w-[500px] h-[500px] bg-orange-700/10 rounded-full blur-[150px] pointer-events-none z-0" />

      <div className="fixed inset-0 bg-grid-pattern opacity-40 pointer-events-none z-0" />

      <div className="relative z-10 bg-gradient-to-r from-orange-600/20 via-orange-500/20 to-orange-700/20 border-b border-orange-400/20 py-2.5 px-4 text-center text-xs font-semibold text-orange-200 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="inline-flex items-center gap-1.5 text-white">
            <Sparkles className="h-3.5 w-3.5 text-orange-300" />
            TenderAI v2.4 Release: Autonomous RAG Multi-Tenant Copilot Engine is Live
          </span>
          <button
            onClick={() => navigate('/auth/register')}
            className="ml-2 inline-flex items-center gap-1 text-orange-300 hover:text-white transition underline underline-offset-2"
          >
            Try Free <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      <header className="sticky top-0 z-50 px-4 py-4 sm:px-8 lg:px-16 transition-all duration-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl glass-panel px-6 py-3 shadow-2xl">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-orange-600 via-orange-500 to-orange-700 p-[1px] shadow-lg shadow-orange-400/30">
              <div className="flex h-full w-full items-center justify-center rounded-xl bg-slate-950">
                <Brain className="h-6 w-6 text-orange-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1">
                Tender<span className="gradient-accent">AI</span>
              </span>
              <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">Enterprise SaaS</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#features" className="hover:text-orange-300 transition-colors">Features</a>
            <a href="#demo" className="hover:text-orange-300 transition-colors">Architecture</a>
            <a href="#pricing" className="hover:text-orange-300 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-orange-300 transition-colors">FAQ</a>
            <a href="#contact" className="hover:text-orange-300 transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/auth/login')}
              className="btn-modern-ghost px-4 py-2 text-sm"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/auth/register')}
              className="btn-modern-primary group flex items-center gap-2 px-5 py-2.5 text-sm"
            >
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-20 sm:pt-24 sm:pb-28 lg:px-16 text-center">
        <div className="inline-flex items-center gap-2.5 rounded-full glow-pill px-4 py-1.5 text-xs text-orange-200 font-semibold mb-8 animate-float-soft">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Production-Ready Postgres RLS & Vector Isolation</span>
          <span className="h-1.5 w-1.5 rounded-full bg-orange-300" />
          <span className="text-slate-400">SOC 2 Compliant</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] max-w-5xl mx-auto">
          Intelligent SaaS Engine for
          <span className="block mt-2 gradient-accent">
            Tender & Bid Operations
          </span>
        </h1>

        <p className="mt-8 mx-auto max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
          Accelerate bid submissions by 10x with multi-tenant document chunking, isolated RAG vector search, automated RFC compliance scoring, and audit-logged workspace collaboration.
        </p>

        <div className="mt-10 flex flex-wrap justify-center items-center gap-4">
          <button
            onClick={() => navigate('/auth/register')}
            className="btn-modern-primary flex items-center gap-3 px-8 py-4 text-base font-semibold"
          >
            <Sparkles className="h-5 w-5 text-orange-100" />
            <span>Create Company Workspace</span>
            <ArrowRight className="h-5 w-5" />
          </button>

          <button
            onClick={() => navigate('/auth/login')}
            className="btn-modern-secondary flex items-center gap-2.5 px-7 py-4 text-base font-semibold"
          >
            <Terminal className="h-5 w-5 text-orange-300" />
            <span>Enter Console</span>
          </button>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>No Credit Card Required</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Instant Workspace Provisioning</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Postgres Row-Level Security</span>
          </div>
        </div>

        <div id="demo" className="mt-16 sm:mt-20 overflow-hidden rounded-3xl border border-orange-400/20 bg-slate-950/80 p-3 shadow-2xl backdrop-blur-xl glow-card">
          <div className="rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-950">

            <div className="flex flex-wrap items-center justify-between border-b border-slate-800/80 px-4 py-3 bg-slate-900/60 gap-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 text-xs text-slate-400 font-mono flex items-center gap-1.5 bg-slate-950/60 px-3 py-1 rounded-lg border border-slate-800">
                  <Lock className="h-3 w-3 text-orange-300" /> console.tenderai.io/workspace/active-bids
                </span>
              </div>

              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setActiveConsoleTab('overview')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeConsoleTab === 'overview' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                  Live Dashboard
                </button>
                <button
                  onClick={() => setActiveConsoleTab('rag')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeConsoleTab === 'rag' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                  RAG Copilot
                </button>
                <button
                  onClick={() => setActiveConsoleTab('security')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeConsoleTab === 'security' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                  Tenant RLS
                </button>
              </div>
            </div>

            <div className="p-6 text-left">
              {activeConsoleTab === 'overview' && (
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="md:col-span-1 space-y-3 border-r border-slate-800/80 pr-6">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono font-semibold">
                      <span>ORGANIZATION</span>
                      <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">ACTIVE</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                      <p className="text-xs text-slate-400">Company Tenant ID</p>
                      <p className="text-sm font-mono font-bold text-orange-200 mt-1">tenant_org_8841a</p>
                    </div>
                    <div className="space-y-1.5 pt-2">
                      <div className="p-2.5 rounded-lg bg-orange-500/20 text-orange-100 text-xs font-medium flex items-center justify-between">
                        <span className="flex items-center gap-2"><FileText className="h-4 w-4" /> Active Tenders</span>
                        <span className="font-bold font-mono text-white">18</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-900 text-slate-400 text-xs font-medium flex items-center justify-between hover:bg-slate-850 cursor-pointer">
                        <span className="flex items-center gap-2"><Brain className="h-4 w-4" /> Vector Embeddings</span>
                        <span className="font-mono text-slate-200">142.8k</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-900 text-slate-400 text-xs font-medium flex items-center justify-between hover:bg-slate-850 cursor-pointer">
                        <span className="flex items-center gap-2"><Activity className="h-4 w-4" /> Audit Logs</span>
                        <span className="font-mono text-slate-200">99.9%</span>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-3 space-y-6">
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>Submitted Proposals</span>
                          <BarChart3 className="h-4 w-4 text-orange-300" />
                        </div>
                        <p className="text-2xl font-extrabold text-white mt-2">42</p>
                        <span className="text-[11px] text-emerald-400 font-medium">+14% vs last month</span>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>Average Compliance</span>
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        </div>
                        <p className="text-2xl font-extrabold text-emerald-400 mt-2">97.8%</p>
                        <span className="text-[11px] text-slate-400">Validated against RFC requirements</span>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>AI RAG Processing</span>
                          <Zap className="h-4 w-4 text-amber-400" />
                        </div>
                        <p className="text-2xl font-extrabold text-orange-200 mt-2">184 ms</p>
                        <span className="text-[11px] text-orange-300">Latency per query</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900/80 border border-orange-400/20 font-mono text-xs space-y-2">
                      <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
                        <span className="flex items-center gap-2 text-orange-300 font-bold">
                          <Terminal className="h-4 w-4" /> AUTO_EVAL_RUNNER --tender=RFP-2026-GOV-99
                        </span>
                        <span className="text-emerald-400">STATUS: COMPLIANT</span>
                      </div>
                      <p className="text-slate-300 pt-1">&gt; Extracting RFC section 4.2 compliance vectors...</p>
                      <p className="text-slate-300">&gt; Querying tenant vector collection with filter <span className="text-orange-200">&#123;company_id: tenant_org_8841a&#125;</span></p>
                      <p className="text-emerald-400 font-semibold">&gt; Match Result: 100% clause coverage. Zero SLA risk flags detected.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeConsoleTab === 'rag' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-500/10 border border-orange-400/30 text-orange-200 text-xs">
                    <Brain className="h-5 w-5 text-orange-300 shrink-0" />
                    <span>Isolated RAG Search retrieves contextual excerpts using cosine similarity matching restricted strictly to your organization's index.</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                      <span className="text-orange-300 font-bold">RAG Vector Query Stream</span>
                      <span className="text-slate-500">Model: Claude-3.5-Sonnet / OpenAI-v4</span>
                    </div>
                    <div className="space-y-2 text-slate-300">
                      <p className="text-orange-200"><span className="text-slate-500">Query:</span> "What are the required data retention policies for defense contracts?"</p>
                      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-xs space-y-1">
                        <span className="text-amber-400 font-bold">Vector Chunk #9104 (Similarity Score: 0.94):</span>
                        <p className="text-slate-400 italic">"Contractor must maintain AES-256 encrypted backups for minimum 7 years with immutable audit logs..."</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeConsoleTab === 'security' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                    <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
                    <span>Row Level Security (RLS) policies are active at database driver level. Cross-tenant leakage is mathematically impossible.</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 font-mono text-xs text-slate-300">
                    <p className="text-orange-300 font-bold">// Postgres Row-Level Security Policy Enforced</p>
                    <p className="text-slate-400">CREATE POLICY tenant_isolation_policy ON tenders</p>
                    <p className="text-slate-400 pl-4">FOR ALL USING (company_id = current_setting('app.current_company_id'));</p>
                    <p className="text-emerald-400 font-semibold pt-2">✓ Verified: 0 policy bypass vulnerabilities found in automated security audit.</p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      <section className="relative z-10 border-y border-slate-900 bg-slate-950/60 py-12 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 lg:px-16 text-center">
          <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-8">
            Trusted by Forward-Thinking Bidding Enterprises & Defense Vendors
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all">
            <span className="text-lg font-bold tracking-wider text-slate-300 font-mono">VERTEX.INFRA</span>
            <span className="text-lg font-bold tracking-wider text-slate-300 font-mono">AETHER_GOV</span>
            <span className="text-lg font-bold tracking-wider text-slate-300 font-mono">NEXUS_TENDERS</span>
            <span className="text-lg font-bold tracking-wider text-slate-300 font-mono">GLOBAL_BID_CO</span>
            <span className="text-lg font-bold tracking-wider text-slate-300 font-mono">CYBER_DEFENSE</span>
          </div>
        </div>
      </section>

      <section id="features" className="relative z-10 mx-auto max-w-7xl px-6 py-28 lg:px-16">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-400/10 px-3.5 py-1 text-xs font-semibold text-orange-300 mb-4">
            <Zap className="h-3.5 w-3.5" />
            Designed for Enterprise Scale
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight gradient-title">
            Engineered for Maximum Winning Rate & Absolute Security
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Combine modern cloud multi-tenancy with cutting-edge vector matching to never miss an RFC requirement again.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="glow-card rounded-3xl p-8">
            <div className="h-12 w-12 rounded-2xl bg-orange-500/10 border border-orange-400/20 flex items-center justify-center text-orange-300 mb-6 shadow-inner">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Postgres RLS Multi-Tenancy</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Native PostgreSQL Row-Level Security policies ensure complete tenant isolation. Every query automatically restricts data scope strictly to authorized company users.
            </p>
          </div>

          <div className="glow-card rounded-3xl p-8">
            <div className="h-12 w-12 rounded-2xl bg-orange-700/10 border border-orange-600/20 flex items-center justify-center text-orange-500 mb-6 shadow-inner">
              <Brain className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Isolated Vector RAG Search</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Vector embeddings are partitioned by company ID in vector storage, preventing cross-tenant data leakage while delivering lightning-fast semantic retrieval.
            </p>
          </div>

          <div className="glow-card rounded-3xl p-8">
            <div className="h-12 w-12 rounded-2xl bg-orange-600/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-6 shadow-inner">
              <Files className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Automated RFC Parsing</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Upload multi-hundred page PDF or Word specifications. Our engine parses clauses, extracts deadline matrices, and indexes technical compliance rules automatically.
            </p>
          </div>

          <div className="glow-card rounded-3xl p-8">
            <div className="h-12 w-12 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 shadow-inner">
              <Activity className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Granular Operational Auditing</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Comprehensive system log trails record every query, proposal revision, document access, and user activity with precise cryptographic timestamps.
            </p>
          </div>

          <div className="glow-card rounded-3xl p-8">
            <div className="h-12 w-12 rounded-2xl bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6 shadow-inner">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Role-Based Access Control</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Assign fine-grained user permissions: Admin, Bid Manager, Compliance Auditor, or External Reviewer with customized access boundaries.
            </p>
          </div>

          <div className="glow-card rounded-3xl p-8">
            <div className="h-12 w-12 rounded-2xl bg-rose-600/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-6 shadow-inner">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Autonomous AI Proposal Generator</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Draft compliant bid responses tailored to RFP specs in seconds with contextually verified historical winning proposals.
            </p>
          </div>
        </div>
      </section>

      <section id="pricing" className="relative z-10 mx-auto max-w-7xl px-6 py-28 lg:px-16 border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-400/10 px-3.5 py-1 text-xs font-semibold text-orange-300 mb-4">
            <Star className="h-3.5 w-3.5" />
            Transparent Pricing
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight gradient-title">
            Simple Plans Tailored to Your Growth
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Scale seamlessly as your tender volume grows. No hidden fees or surprise user charges.
          </p>

          <div className="mt-8 inline-flex items-center gap-3 p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition ${billingCycle === 'monthly' ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold transition ${billingCycle === 'annual' ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Annual Billing
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          <div className="glow-card rounded-3xl p-8 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-orange-300 uppercase tracking-widest bg-orange-400/10 px-3 py-1 rounded-full border border-orange-400/20">Starter</span>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-5xl font-extrabold text-white">{billingCycle === 'monthly' ? '$49' : '$39'}</span>
                <span className="text-slate-400 text-sm">/ month</span>
              </div>
              <p className="mt-4 text-sm text-slate-400">Ideal for small agencies building out structured tender workflows.</p>
              <ul className="mt-8 space-y-4 text-sm text-slate-300">
                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-orange-300 shrink-0" /> Up to 5 Team Users</li>
                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-orange-300 shrink-0" /> 10 Active Tenders</li>
                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-orange-300 shrink-0" /> 10 GB Encrypted Storage</li>
                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-orange-300 shrink-0" /> 500 AI RAG Queries / mo</li>
              </ul>
            </div>
            <button
              onClick={() => navigate('/auth/register')}
              className="mt-10 btn-modern-secondary w-full py-3.5 text-sm"
            >
              Start Free Trial
            </button>
          </div>

          <div className="glow-card rounded-3xl p-8 flex flex-col justify-between border-2 border-orange-400/60 bg-slate-900/90 relative shadow-2xl shadow-orange-400/10">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-700 px-4 py-1 rounded-full text-[11px] font-extrabold text-white tracking-wider shadow-lg">
              MOST POPULAR
            </div>
            <div>
              <span className="text-xs font-bold text-orange-200 uppercase tracking-widest bg-orange-400/20 px-3 py-1 rounded-full border border-orange-300/30">Professional</span>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-5xl font-extrabold text-white">{billingCycle === 'monthly' ? '$149' : '$119'}</span>
                <span className="text-slate-400 text-sm">/ month</span>
              </div>
              <p className="mt-4 text-sm text-slate-300">For active bidding teams requiring advanced vector compliance scoring.</p>
              <ul className="mt-8 space-y-4 text-sm text-slate-200">
                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-orange-300 shrink-0" /> Up to 25 Team Users</li>
                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-orange-300 shrink-0" /> Unlimited Active Tenders</li>
                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-orange-300 shrink-0" /> 100 GB Encrypted Storage</li>
                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-orange-300 shrink-0" /> 5,000 AI RAG Queries / mo</li>
                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-orange-300 shrink-0" /> Dedicated RBAC & Audit Logs</li>
              </ul>
            </div>
            <button
              onClick={() => navigate('/auth/register')}
              className="mt-10 btn-modern-primary w-full py-3.5 text-sm font-semibold"
            >
              Get Started Now
            </button>
          </div>

          <div className="glow-card rounded-3xl p-8 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-orange-500 uppercase tracking-widest bg-orange-600/10 px-3 py-1 rounded-full border border-orange-600/20">Enterprise</span>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-5xl font-extrabold text-white">{billingCycle === 'monthly' ? '$499' : '$399'}</span>
                <span className="text-slate-400 text-sm">/ month</span>
              </div>
              <p className="mt-4 text-sm text-slate-400">For global defense and government contractors demanding custom SLAs.</p>
              <ul className="mt-8 space-y-4 text-sm text-slate-300">
                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-orange-500 shrink-0" /> Unlimited Users & Tenants</li>
                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-orange-500 shrink-0" /> Custom Dedicated Vector Index</li>
                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-orange-500 shrink-0" /> 1 TB Storage + On-Prem Option</li>
                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-orange-500 shrink-0" /> Unlimited AI Queries</li>
                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-orange-500 shrink-0" /> 24/7 Priority Support & SLA</li>
              </ul>
            </div>
            <button
              onClick={() => navigate('/auth/register')}
              className="mt-10 btn-modern-secondary w-full py-3.5 text-sm"
            >
              Contact Enterprise
            </button>
          </div>
        </div>
      </section>

      <section id="faq" className="relative z-10 mx-auto max-w-4xl px-6 py-28 border-t border-slate-900">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight gradient-title">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-slate-400">Have questions about deployment, security, or tenant isolation?</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="glow-card rounded-2xl overflow-hidden cursor-pointer"
              onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
            >
              <div className="p-6 flex items-center justify-between gap-4">
                <span className="font-semibold text-white text-base sm:text-lg">{faq.q}</span>
                <ChevronDown className={`h-5 w-5 text-orange-300 transition-transform duration-300 shrink-0 ${openFaq === idx ? 'rotate-180' : ''}`} />
              </div>
              {openFaq === idx && (
                <div className="px-6 pb-6 text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="relative z-10 mx-auto max-w-4xl px-6 py-24 border-t border-slate-900">
        <div className="glow-card rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-orange-400/20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-3xl font-extrabold text-white">Schedule an Enterprise Demo</h2>
            <p className="mt-2 text-sm text-slate-400">Connect with an AI solutions architect to discuss custom deployment and multi-tenant security.</p>
          </div>

          <form onSubmit={handleContactSubmit} className="space-y-6 relative z-10">
            {submitted && (
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-sm text-emerald-300 text-center font-medium flex items-center justify-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <span>Thank you! Your demo request has been received. An architect will contact you shortly.</span>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Full Name</label>
                <input
                  type="text"
                  value={contactForm.name}
                  onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                  required
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3.5 text-sm text-white focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Work Email</label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                  required
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3.5 text-sm text-white focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition"
                  placeholder="jane@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Operational Requirements</label>
              <textarea
                rows={4}
                value={contactForm.message}
                onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                required
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3.5 text-sm text-white focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition"
                placeholder="Tell us about your tender volume, compliance requirements, or custom RAG needs..."
              />
            </div>

            <button
              type="submit"
              className="btn-modern-primary w-full py-3 text-base font-semibold flex items-center justify-center gap-2"
            >
              <span>Submit Request</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>
        </div>
      </section>

      <footer className="relative z-10 border-t border-slate-900 bg-slate-950 px-6 py-12 text-slate-400">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-6 text-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white font-bold">
              <Brain className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-white">Tender<span className="gradient-accent">AI</span></span>
          </div>

          <p className="text-xs text-slate-400">&copy; {new Date().getFullYear()} TenderAI Inc. All rights reserved. Encrypted under AES-256 standards.</p>

          <div className="flex items-center gap-6 text-xs font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition">Privacy Policy</a>
            <a href="#pricing" className="hover:text-white transition">Terms of Service</a>
            <a href="#contact" className="hover:text-white transition">Security Whitepaper</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
