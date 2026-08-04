import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { Brain, Lock, ShieldCheck } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

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
      if (result.success) {
        // Dynamic Role-based Dashboard routing
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 relative overflow-hidden font-sans">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-900 bg-slate-950 shadow-2xl relative z-10">
        <div className="grid md:grid-cols-2">
          {/* Left panel */}
          <div className="bg-gradient-to-br from-blue-900/60 to-indigo-950/80 p-12 text-white flex flex-col justify-between border-r border-slate-900">
            <div>
              <div className="flex items-center gap-2 mb-8">
                <Brain className="h-6 w-6 text-blue-400" />
                <span className="text-lg font-bold">TenderAI SaaS</span>
              </div>
              <h1 className="text-3xl font-bold leading-tight">Secure, unified access console.</h1>
              <p className="mt-4 text-sm text-slate-300">Enter your credentials to launch your role-specific dashboard with automated RAG assistance.</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <ShieldCheck className="h-4 w-4 text-blue-500" />
                <span>Encrypted credentials via Argon2id standards.</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <Lock className="h-4 w-4 text-blue-500" />
                <span>Isolated sessions via database Row Level Security.</span>
              </div>
            </div>
          </div>

          {/* Right panel (Form) */}
          <div className="p-8 lg:p-12 flex flex-col justify-center text-slate-200">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Welcome back</h2>
                <p className="mt-1 text-sm text-slate-400">Sign in to access your tenant dashboard</p>
              </div>

              {error && (
                <div className="rounded-xl bg-red-950/30 border border-red-900/50 p-4 text-sm text-red-400">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <Input 
                  label="Email Address" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="name@company.com" 
                  required
                />
                <Input 
                  label="Password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full flex justify-center items-center py-3" 
                disabled={loading}
              >
                {loading ? 'Verifying Session...' : 'Sign In'}
              </Button>

              <div className="text-center text-xs text-slate-500 mt-6">
                New to TenderAI?{' '}
                <Link to="/auth/register" className="text-blue-400 hover:text-blue-300 font-semibold underline decoration-dotted">
                  Register your company
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
