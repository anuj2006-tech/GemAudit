import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Brain, Lock, ShieldCheck, Mail, ArrowRight, Eye, EyeOff, Sparkles, ArrowLeft, CheckCircle2, Zap } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, bypassLogin } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result?.success) {
        const role = result.role;
        if (role === 'PLATFORM_ADMIN') {
          navigate('/super-admin/dashboard');
        } else if (role === 'COMPANY_OWNER') {
          navigate('/owner/dashboard');
        } else if (role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else {
          navigate('/employee/dashboard');
        }
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Authentication failed. Please check your credentials.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // BYPASS CODE START
  const handleBypass = (selectedRole = 'COMPANY_OWNER') => {
    const result = bypassLogin(selectedRole);
    if (result?.success) {
      if (selectedRole === 'PLATFORM_ADMIN') {
        navigate('/super-admin/dashboard');
      } else if (selectedRole === 'COMPANY_OWNER') {
        navigate('/owner/dashboard');
      } else if (selectedRole === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/employee/dashboard');
      }
    }
  };
  // BYPASS CODE END

  return (
    <div className="min-h-screen bg-[#100e0c] text-slate-100 font-sans flex items-center justify-center p-4 sm:p-6 relative overflow-hidden selection:bg-orange-400 selection:text-white">
      
      <div className="fixed top-1/4 left-1/4 w-[500px] h-[500px] bg-orange-600/15 rounded-full blur-[140px] pointer-events-none animate-ambient-1" />
      <div className="fixed bottom-1/4 right-1/4 w-[500px] h-[500px] bg-orange-500/15 rounded-full blur-[160px] pointer-events-none animate-ambient-2" />
      <div className="fixed inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      <div className="w-full max-w-5xl rounded-3xl glow-card overflow-hidden shadow-2xl relative z-10 border border-slate-800/80">
        <div className="grid md:grid-cols-12 min-h-[620px]">
          
          <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-between bg-slate-950/70">
            <div>
              <div className="flex items-center justify-between mb-6">
                <button 
                  onClick={() => navigate('/')} 
                  className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition group"
                >
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Back to Home
                </button>

                <span className="text-[11px] font-mono uppercase tracking-widest text-orange-300 bg-orange-400/10 px-3 py-1 rounded-full border border-orange-400/20">
                  Tenant Access
                </span>
              </div>

              <div className="mb-6">
                <h1 className="text-3xl font-extrabold text-white tracking-tight">Welcome Back</h1>
                <p className="mt-2 text-sm text-slate-400">
                  Enter your credentials to access your company's secure bidding workspace.
                </p>
              </div>

              {/* BYPASS CODE START */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <Zap className="h-4 w-4" /> Dev Test Bypass
                  </span>
                  <span className="text-[10px] font-mono text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded font-extrabold">FRONTEND</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => handleBypass('COMPANY_OWNER')}
                    className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-amber-500/20 border border-amber-500/40 text-xs font-bold text-amber-300 transition"
                  >
                    Owner Dashboard
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBypass('ADMIN')}
                    className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-amber-500/20 border border-amber-500/40 text-xs font-bold text-amber-300 transition"
                  >
                    Admin Dashboard
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBypass('EMPLOYEE')}
                    className="col-span-2 sm:col-span-1 px-3 py-2 rounded-xl bg-slate-900 hover:bg-amber-500/20 border border-amber-500/40 text-xs font-bold text-amber-300 transition"
                  >
                    Employee
                  </button>
                </div>
              </div>
              {/* BYPASS CODE END */}

              {error && (
                <div className="mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 p-4 text-xs font-medium text-rose-300 flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-rose-500 animate-ping shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Work Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      required
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-11 pr-11 py-3 text-sm text-white focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition placeholder:text-slate-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="btn-modern-primary w-full py-3.5 text-sm font-semibold flex items-center justify-center gap-2 mt-4"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Authenticating...
                    </span>
                  ) : (
                    <>
                      <span>Sign In to Console</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-900 text-center text-xs text-slate-400">
              New to TenderAI?{' '}
              <Link to="/auth/register" className="text-orange-300 hover:text-orange-200 font-bold underline underline-offset-4">
                Register company workspace
              </Link>
            </div>
          </div>

          <div className="md:col-span-5 bg-gradient-to-br from-slate-900 via-orange-900/80 to-orange-950 p-8 sm:p-12 text-white flex flex-col justify-between border-l border-slate-800/80 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-10 cursor-pointer" onClick={() => navigate('/')}>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-400/30">
                  <Brain className="h-5 w-5" />
                </div>
                <span className="text-xl font-extrabold tracking-tight">Tender<span className="gradient-accent">AI</span></span>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-400/20 border border-orange-400/30 text-orange-200 text-xs font-semibold mb-6">
                <Sparkles className="h-3.5 w-3.5" />
                Next-Gen Bid Copilot
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight gradient-title">
                Unified SaaS Console for Enterprise Bidding
              </h2>

              <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Access isolated vector search, automated RFC compliance scoring, and tenant-restricted audit logs.
              </p>
            </div>

            <div className="relative z-10 space-y-3 my-8">
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Postgres Row Level Security</h4>
                  <p className="text-[11px] text-slate-400">Strict data boundary per company tenant</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-orange-400/10 flex items-center justify-center text-orange-300 shrink-0">
                  <Brain className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Isolated RAG Vector Store</h4>
                  <p className="text-[11px] text-slate-400">Zero cross-tenant vector contamination</p>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-4 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" /> Security System Active
              </span>
              <span>v2.4 Production</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
