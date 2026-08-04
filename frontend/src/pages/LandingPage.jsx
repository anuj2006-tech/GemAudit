import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Brain, Files, Activity, ArrowRight, Check } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setContactForm({ name: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white overflow-x-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 h-[600px] w-[600px] rounded-full bg-indigo-500/10 blur-[150px] pointer-events-none" />

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b border-slate-800 bg-slate-950/75 px-6 py-4 lg:px-16 transition-all duration-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Tender<span className="text-blue-500">AI</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/auth/login')}
              className="text-sm font-semibold hover:text-white text-slate-400 transition-colors"
            >
              Login
            </button>
            <button 
              onClick={() => navigate('/auth/register')}
              className="group flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition shadow-lg shadow-blue-500/25 active:scale-95"
            >
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 pt-20 pb-16 lg:px-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/5 px-4 py-1.5 text-xs text-blue-400 font-semibold mb-6">
          <Shield className="h-3.5 w-3.5" />
          Production-Ready Multi-Tenant Architecture
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
          Intelligent SaaS
          <span className="block mt-2 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Tender & Bid Operations
          </span>
        </h1>
        <p className="mt-6 mx-auto max-w-2xl text-lg text-slate-400 leading-relaxed">
          Unlock state-of-the-art secure document parsing, RAG-powered query analysis, and role-based operational dashboards tailored for modern bidding enterprises.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button 
            onClick={() => navigate('/auth/register')}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-blue-600/30 transition-all hover:shadow-blue-500/40 active:scale-95"
          >
            Create Company Workspace
          </button>
          <button 
            onClick={() => navigate('/auth/login')}
            className="rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 px-6 py-3.5 text-sm font-semibold text-white transition active:scale-95"
          >
            Enter Console
          </button>
        </div>

        {/* Dashboard Preview Mock */}
        <div className="mt-16 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-2 shadow-2xl backdrop-blur-sm">
          <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <span className="h-3 w-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-xs text-slate-500 font-mono">console.tender.ai/dashboard</span>
              <div className="h-2 w-10" />
            </div>
            <div className="grid grid-cols-4 gap-4 text-left">
              <div className="col-span-1 border-r border-slate-800 pr-4 space-y-2">
                <div className="h-8 w-24 rounded bg-slate-800/60" />
                <div className="h-6 w-full rounded bg-blue-600/20" />
                <div className="h-6 w-full rounded bg-slate-900" />
                <div className="h-6 w-full rounded bg-slate-900" />
              </div>
              <div className="col-span-3 space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1 h-20 rounded-xl bg-slate-900 p-3">
                    <span className="text-xs text-slate-500">Active Tenders</span>
                    <p className="text-lg font-bold text-white mt-1">12</p>
                  </div>
                  <div className="flex-1 h-20 rounded-xl bg-slate-900 p-3">
                    <span className="text-xs text-slate-500">Win Rate</span>
                    <p className="text-lg font-bold text-green-400 mt-1">78%</p>
                  </div>
                </div>
                <div className="h-32 w-full rounded-xl bg-slate-900/40 p-4 font-mono text-xs text-slate-500">
                  <span className="text-blue-400 font-bold">$ ruff_query --rag</span>
                  <p className="mt-2 text-slate-300">Evaluating proposal draft against RFC requirements... [OK]</p>
                  <p className="text-green-400">Risk Assessment: 94% compliant. 0 high risks detected.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-24 lg:px-16 border-t border-slate-900 relative">
        <h2 className="text-3xl font-bold text-center mb-4">Engineered for Massive Scale</h2>
        <p className="text-center text-slate-400 max-w-xl mx-auto mb-16">
          Everything your enterprise needs to secure, organize, and submit bids with intelligence.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="rounded-2xl border border-slate-900 bg-slate-950 p-6 hover:border-slate-800 transition">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Tenant Isolation</h3>
            <p className="text-sm text-slate-400">Strict Postgres Row-Level Security ensures data is locked completely to authorized company members.</p>
          </div>

          <div className="rounded-2xl border border-slate-900 bg-slate-950 p-6 hover:border-slate-800 transition">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-4">
              <Brain className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Isolated AI RAG</h3>
            <p className="text-sm text-slate-400">Vector similarity matching strictly filters embeddings by company_id, avoiding cross-contamination.</p>
          </div>

          <div className="rounded-2xl border border-slate-900 bg-slate-950 p-6 hover:border-slate-800 transition">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-4">
              <Files className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Storage Policies</h3>
            <p className="text-sm text-slate-400">Storage objects are partitioned automatically into folder keys matching the tenant ID claim.</p>
          </div>

          <div className="rounded-2xl border border-slate-900 bg-slate-950 p-6 hover:border-slate-800 transition">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4">
              <Activity className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Granular Audit Logging</h3>
            <p className="text-sm text-slate-400">Track operations with system-level audit trails capturing creators, timings, changes, and metadata.</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="mx-auto max-w-7xl px-6 py-24 lg:px-16 border-t border-slate-900">
        <h2 className="text-3xl font-bold text-center mb-4">Transparent Pricing Tiers</h2>
        <p className="text-center text-slate-400 max-w-xl mx-auto mb-16">
          Upgrade or change plans dynamically from your settings console.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Starter Plan */}
          <div className="rounded-3xl border border-slate-900 bg-slate-950 p-8 flex flex-col hover:border-slate-850 transition">
            <span className="text-sm font-semibold text-blue-500 uppercase tracking-widest">Starter</span>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-bold">$49</span>
              <span className="text-slate-500 text-sm">/month</span>
            </div>
            <p className="mt-4 text-sm text-slate-400 flex-1">Ideal for small growing agencies looking to streamline bid management workflows.</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              <li className="flex gap-2"><Check className="h-4 w-4 text-blue-500" /> Up to 3 users</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-blue-500" /> 5 Active Tenders</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-blue-500" /> 5 GB storage</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-blue-500" /> 100 AI queries / month</li>
            </ul>
            <button 
              onClick={() => navigate('/auth/register')}
              className="mt-8 w-full rounded-xl bg-slate-900 hover:bg-slate-850 py-3 text-sm font-semibold transition active:scale-95"
            >
              Get Started
            </button>
          </div>

          {/* Professional Plan */}
          <div className="rounded-3xl border border-blue-500/40 bg-slate-950 p-8 flex flex-col hover:border-blue-500/60 transition shadow-lg shadow-blue-500/5 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 px-3 py-1 rounded-full text-xs font-bold text-white tracking-wide">
              RECOMMENDED
            </div>
            <span className="text-sm font-semibold text-blue-400 uppercase tracking-widest">Professional</span>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-bold">$149</span>
              <span className="text-slate-500 text-sm">/month</span>
            </div>
            <p className="mt-4 text-sm text-slate-400 flex-1">Tailored for established firms looking to implement RAG document evaluations.</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              <li className="flex gap-2"><Check className="h-4 w-4 text-blue-400" /> Up to 10 users</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-blue-400" /> 25 Active Tenders</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-blue-400" /> 20 GB storage</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-blue-400" /> 1,000 AI queries / month</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-blue-400" /> Dedicated RBAC support</li>
            </ul>
            <button 
              onClick={() => navigate('/auth/register')}
              className="mt-8 w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 text-sm font-semibold transition shadow-md shadow-blue-500/20 active:scale-95"
            >
              Go Pro
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="rounded-3xl border border-slate-900 bg-slate-950 p-8 flex flex-col hover:border-slate-850 transition">
            <span className="text-sm font-semibold text-purple-500 uppercase tracking-widest">Enterprise</span>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-bold">$499</span>
              <span className="text-slate-500 text-sm">/month</span>
            </div>
            <p className="mt-4 text-sm text-slate-400 flex-1">For multinational companies requiring custom compliance limits and scale.</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              <li className="flex gap-2"><Check className="h-4 w-4 text-purple-500" /> Unlimited users</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-purple-500" /> Unlimited Tenders</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-purple-500" /> 500 GB storage</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-purple-500" /> Unlimited AI evaluations</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-purple-500" /> Customized SLA support</li>
            </ul>
            <button 
              onClick={() => navigate('/auth/register')}
              className="mt-8 w-full rounded-xl bg-slate-900 hover:bg-slate-850 py-3 text-sm font-semibold transition active:scale-95"
            >
              Contact Enterprise
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="mx-auto max-w-4xl px-6 py-24 border-t border-slate-900">
        <h2 className="text-3xl font-bold text-center mb-4">Request a Product Demo</h2>
        <p className="text-center text-slate-400 mb-12">Submit your details below and a systems architect will reach out.</p>

        <form onSubmit={handleContactSubmit} className="rounded-2xl border border-slate-900 bg-slate-950/50 p-8 space-y-6">
          {submitted && (
            <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-4 text-sm text-green-400 text-center">
              Thank you! Your demo request has been received.
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Name</label>
              <input 
                type="text" 
                value={contactForm.name}
                onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                required
                className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition" 
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Email</label>
              <input 
                type="email" 
                value={contactForm.email}
                onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                required
                className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition" 
                placeholder="jane@company.com"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Message</label>
            <textarea 
              rows={4}
              value={contactForm.message}
              onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
              required
              className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition" 
              placeholder="Tell us about your tender management operational scale..."
            />
          </div>

          <button 
            type="submit"
            className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 text-sm font-semibold transition active:scale-95"
          >
            Submit Request
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 px-6 py-8 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} TenderAI SaaS Platform. All rights reserved.</p>
        <p className="mt-2 text-slate-600">Secure AES & Argon2 Encryption standards applied. Row Level Security active.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
