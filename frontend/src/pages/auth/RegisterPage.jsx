import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerCompany } from '../../services/authService';
import { 
  Brain, Lock, ShieldCheck, Mail, ArrowRight, ArrowLeft, Eye, EyeOff, Sparkles, 
  Building, User, Globe, Phone, CheckCircle2, Check, Layers, ChevronDown
} from 'lucide-react';

const countriesList = [
  { name: 'United States', code: '+1', flag: '🇺🇸' },
  { name: 'United Kingdom', code: '+44', flag: '🇬🇧' },
  { name: 'India', code: '+91', flag: '🇮🇳' },
  { name: 'Canada', code: '+1', flag: '🇨🇦' },
  { name: 'Australia', code: '+61', flag: '🇦🇺' },
  { name: 'Germany', code: '+49', flag: '🇩🇪' },
  { name: 'France', code: '+33', flag: '🇫🇷' },
  { name: 'Japan', code: '+81', flag: '🇯🇵' },
  { name: 'China', code: '+86', flag: '🇨🇳' },
  { name: 'Brazil', code: '+55', flag: '🇧🇷' },
  { name: 'Mexico', code: '+52', flag: '🇲🇽' },
  { name: 'Argentina', code: '+54', flag: '🇦🇷' },
  { name: 'Austria', code: '+43', flag: '🇦🇹' },
  { name: 'Belgium', code: '+32', flag: '🇧🇪' },
  { name: 'Chile', code: '+56', flag: '🇨🇱' },
  { name: 'Colombia', code: '+57', flag: '🇨🇴' },
  { name: 'Denmark', code: '+45', flag: '🇩🇰' },
  { name: 'Egypt', code: '+20', flag: '🇪🇬' },
  { name: 'Finland', code: '+358', flag: '🇫🇮' },
  { name: 'Greece', code: '+30', flag: '🇬🇷' },
  { name: 'Hong Kong', code: '+852', flag: '🇭🇰' },
  { name: 'Indonesia', code: '+62', flag: '🇮🇩' },
  { name: 'Ireland', code: '+353', flag: '🇮🇪' },
  { name: 'Israel', code: '+972', flag: '🇮🇱' },
  { name: 'Italy', code: '+39', flag: '🇮🇹' },
  { name: 'Kenya', code: '+254', flag: '🇰🇪' },
  { name: 'Malaysia', code: '+60', flag: '🇲🇾' },
  { name: 'Netherlands', code: '+31', flag: '🇳🇱' },
  { name: 'New Zealand', code: '+64', flag: '🇳🇿' },
  { name: 'Nigeria', code: '+234', flag: '🇳🇬' },
  { name: 'Norway', code: '+47', flag: '🇳🇴' },
  { name: 'Pakistan', code: '+92', flag: '🇵🇰' },
  { name: 'Peru', code: '+51', flag: '🇵🇪' },
  { name: 'Philippines', code: '+63', flag: '🇵🇭' },
  { name: 'Poland', code: '+48', flag: '🇵🇱' },
  { name: 'Portugal', code: '+351', flag: '🇵🇹' },
  { name: 'Qatar', code: '+974', flag: '🇶🇦' },
  { name: 'Saudi Arabia', code: '+966', flag: '🇸🇦' },
  { name: 'Singapore', code: '+65', flag: '🇸🇬' },
  { name: 'South Africa', code: '+27', flag: '🇿🇦' },
  { name: 'South Korea', code: '+82', flag: '🇰🇷' },
  { name: 'Spain', code: '+34', flag: '🇪🇸' },
  { name: 'Sweden', code: '+46', flag: '🇸🇪' },
  { name: 'Switzerland', code: '+41', flag: '🇨🇭' },
  { name: 'Taiwan', code: '+886', flag: '🇹🇼' },
  { name: 'Thailand', code: '+66', flag: '🇹🇭' },
  { name: 'Turkey', code: '+90', flag: '🇹🇷' },
  { name: 'United Arab Emirates', code: '+971', flag: '🇦🇪' },
  { name: 'Vietnam', code: '+84', flag: '🇻🇳' }
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState(countriesList[0]);
  const [phoneDigits, setPhoneDigits] = useState('');

  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    country: countriesList[0].name,
    phone: '',
    companyEmail: '',
    ownerName: '',
    ownerEmail: '',
    ownerPassword: '',
    confirmPassword: ''
  });

  const handleCountryChange = (e) => {
    const matched = countriesList.find(c => c.name === e.target.value) || countriesList[0];
    setSelectedCountry(matched);
    const updatedPhone = phoneDigits ? `${matched.code} ${phoneDigits}` : '';
    setFormData(prev => ({
      ...prev,
      country: matched.name,
      phone: updatedPhone
    }));
  };

  const handlePhoneDigitsChange = (e) => {
    const numericOnly = e.target.value.replace(/\D/g, '');
    setPhoneDigits(numericOnly);
    const updatedPhone = numericOnly ? `${selectedCountry.code} ${numericOnly}` : '';
    setFormData(prev => ({
      ...prev,
      phone: updatedPhone
    }));
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.companyName || !formData.companyEmail) {
        setError('Company Name and Company Email are required.');
        return;
      }
      setError('');
      setStep(2);
    }
  };

  const prevStep = () => {
    setError('');
    setStep(1);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (step === 2) {
      if (!formData.ownerName || !formData.ownerEmail || !formData.ownerPassword) {
        setError('All owner profile fields are required.');
        return;
      }
      if (formData.ownerPassword !== formData.confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      setError('');
      setLoading(true);

      try {
        await registerCompany({
          companyName: formData.companyName,
          industry: formData.industry,
          country: formData.country,
          phone: formData.phone,
          companyEmail: formData.companyEmail,
          ownerName: formData.ownerName,
          ownerEmail: formData.ownerEmail,
          ownerPassword: formData.ownerPassword
        });

        setStep(3);
      } catch (err) {
        const errorMsg = err.response?.data?.error || 'Registration failed. Please check your inputs.';
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#100e0c] text-slate-100 font-sans flex items-center justify-center p-4 sm:p-6 relative overflow-hidden selection:bg-orange-400 selection:text-white">
      
      <div className="fixed top-1/4 left-1/4 w-[500px] h-[500px] bg-orange-600/15 rounded-full blur-[140px] pointer-events-none animate-ambient-1" />
      <div className="fixed bottom-1/4 right-1/4 w-[500px] h-[500px] bg-orange-500/15 rounded-full blur-[160px] pointer-events-none animate-ambient-2" />
      <div className="fixed inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      <div className="w-full max-w-5xl rounded-3xl glow-card overflow-hidden shadow-2xl relative z-10 border border-slate-800/80">
        <div className="grid md:grid-cols-12 min-h-[620px]">
          
          <div className="md:col-span-5 bg-gradient-to-br from-slate-900 via-orange-900/80 to-orange-950 p-8 sm:p-12 text-white flex flex-col justify-between border-r border-slate-800/80 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-80 h-80 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-10 cursor-pointer" onClick={() => navigate('/')}>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-400/30">
                  <Brain className="h-5 w-5" />
                </div>
                <span className="text-xl font-extrabold tracking-tight">Tender<span className="gradient-accent">AI</span></span>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-400/20 border border-orange-400/30 text-orange-200 text-xs font-semibold mb-6">
                <Sparkles className="h-3.5 w-3.5" />
                Instant Tenant Provisioning
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight gradient-title">
                Provision Your Isolated Tender Sandbox
              </h2>

              <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Setup your company workspace in under 2 minutes with automated database Row Level Security.
              </p>
            </div>

            <div className="relative z-10 space-y-4 my-8">
              <div className="flex items-center gap-3">
                <span className={`flex h-7 w-7 items-center justify-center rounded-xl text-xs font-extrabold border transition ${step >= 1 ? 'bg-orange-500 border-orange-400 text-white shadow-md' : 'border-slate-800 bg-slate-900 text-slate-500'}`}>
                  1
                </span>
                <div className="flex flex-col">
                  <span className={`text-xs font-bold ${step >= 1 ? 'text-white' : 'text-slate-500'}`}>Company Profile</span>
                  <span className="text-[11px] text-slate-400">Business & contact details</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`flex h-7 w-7 items-center justify-center rounded-xl text-xs font-extrabold border transition ${step >= 2 ? 'bg-orange-500 border-orange-400 text-white shadow-md' : 'border-slate-800 bg-slate-900 text-slate-500'}`}>
                  2
                </span>
                <div className="flex flex-col">
                  <span className={`text-xs font-bold ${step >= 2 ? 'text-white' : 'text-slate-500'}`}>Owner Credentials</span>
                  <span className="text-[11px] text-slate-400">Primary administrator login</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`flex h-7 w-7 items-center justify-center rounded-xl text-xs font-extrabold border transition ${step >= 3 ? 'bg-emerald-600 border-emerald-500 text-white shadow-md' : 'border-slate-800 bg-slate-900 text-slate-500'}`}>
                  3
                </span>
                <div className="flex flex-col">
                  <span className={`text-xs font-bold ${step >= 3 ? 'text-white' : 'text-slate-500'}`}>Workspace Activation</span>
                  <span className="text-[11px] text-slate-400">Isolated database node ready</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-4 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" /> AES-256 Encryption Active
              </span>
              <span>v2.4 Production</span>
            </div>
          </div>

          <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-between bg-slate-950/70">
            <div>
              <div className="flex items-center justify-between mb-8">
                <button 
                  onClick={() => navigate('/')} 
                  className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition group"
                >
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Back to Home
                </button>

                <span className="text-[11px] font-mono uppercase tracking-widest text-orange-300 bg-orange-400/10 px-3 py-1 rounded-full border border-orange-400/20">
                  Step {step} of 3
                </span>
              </div>

              {error && (
                <div className="mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 p-4 text-xs font-medium text-rose-300 flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-rose-500 animate-ping shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {step === 1 && (
                <div>
                  <div className="mb-6">
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Register Company</h1>
                    <p className="mt-2 text-sm text-slate-400">
                      Provide your organization details to provision your enterprise tenant.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Official Company Name
                      </label>
                      <div className="relative">
                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <input 
                          type="text" 
                          value={formData.companyName}
                          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                          placeholder="e.g. Vertex Infra Logistics Ltd."
                          required
                          className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition placeholder:text-slate-600"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Industry
                        </label>
                        <div className="relative">
                          <Layers className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                          <input 
                            type="text" 
                            value={formData.industry}
                            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                            placeholder="e.g. Legal, Defense"
                            className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition placeholder:text-slate-600"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Country
                        </label>
                        <div className="relative">
                          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none z-10" />
                          <select
                            value={formData.country}
                            onChange={handleCountryChange}
                            className="w-full appearance-none rounded-xl border border-slate-800 bg-slate-900/80 pl-11 pr-10 py-3 text-sm text-white focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition cursor-pointer"
                          >
                            {countriesList.map((c) => (
                              <option key={c.name} value={c.name} className="bg-slate-950 text-white">
                                {c.flag} {c.name} ({c.code})
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Phone Number
                        </label>
                        <div className="flex items-center rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden focus-within:border-orange-400 focus-within:ring-1 focus-within:ring-orange-400 transition">
                          <div className="flex items-center gap-1.5 px-3 py-3 bg-slate-950/80 border-r border-slate-800 text-xs font-mono font-bold text-orange-300 shrink-0">
                            <span>{selectedCountry.flag}</span>
                            <span>{selectedCountry.code}</span>
                          </div>
                          <div className="relative flex-1">
                            <input 
                              type="tel" 
                              value={phoneDigits}
                              onChange={handlePhoneDigitsChange}
                              placeholder="5550192834"
                              className="w-full bg-transparent px-3 py-3 text-sm text-white focus:outline-none placeholder:text-slate-600 font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Company Email
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                          <input 
                            type="email" 
                            value={formData.companyEmail}
                            onChange={(e) => setFormData({ ...formData, companyEmail: e.target.value })}
                            placeholder="billing@company.com"
                            required
                            className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition placeholder:text-slate-600"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button 
                      onClick={nextStep}
                      className="btn-modern-primary flex items-center gap-2 px-6 py-3.5 text-sm font-semibold"
                    >
                      <span>Next: Owner Account</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <form onSubmit={handleRegister}>
                  <div className="mb-6">
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Create Owner Profile</h1>
                    <p className="mt-2 text-sm text-slate-400">
                      Configure the master administrator credentials for this company node.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Administrator Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <input 
                          type="text" 
                          value={formData.ownerName}
                          onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                          placeholder="Jane Doe"
                          required
                          className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition placeholder:text-slate-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Owner Login Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <input 
                          type="email" 
                          value={formData.ownerEmail}
                          onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                          placeholder="jane.doe@company.com"
                          required
                          className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition placeholder:text-slate-600"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                          <input 
                            type={showPassword ? "text" : "password"}
                            value={formData.ownerPassword}
                            onChange={(e) => setFormData({ ...formData, ownerPassword: e.target.value })}
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

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                          <input 
                            type={showPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            placeholder="••••••••"
                            required
                            className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition placeholder:text-slate-600"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-between">
                    <button 
                      type="button"
                      onClick={prevStep}
                      className="btn-modern-secondary flex items-center gap-2 px-5 py-3 text-xs font-semibold"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </button>

                    <button 
                      type="submit"
                      disabled={loading}
                      className="btn-modern-primary flex items-center gap-2 px-7 py-3 text-sm font-semibold"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          Provisioning...
                        </span>
                      ) : (
                        <>
                          <span>Complete Setup</span>
                          <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {step === 3 && (
                <div className="text-center py-6">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-6 shadow-xl">
                    <Check className="h-8 w-8" />
                  </div>
                  
                  <h1 className="text-3xl font-extrabold text-white flex items-center justify-center gap-2">
                    Workspace Ready!
                    <Sparkles className="h-5 w-5 text-amber-400" />
                  </h1>

                  <p className="mt-4 text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                    Company <strong className="text-white font-mono">{formData.companyName}</strong> has been provisioned. The Owner account is initialized under role <span className="text-orange-300 font-mono font-bold bg-orange-400/10 px-2 py-0.5 rounded">COMPANY_OWNER</span>.
                  </p>

                  <div className="mt-8">
                    <button 
                      onClick={() => navigate('/auth/login')}
                      className="btn-modern-primary w-full py-4 text-sm font-semibold flex items-center justify-center gap-2"
                    >
                      <span>Proceed to Console Login</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-900 text-center text-xs text-slate-400">
              Already registered?{' '}
              <Link to="/auth/login" className="text-orange-300 hover:text-orange-200 font-bold underline underline-offset-4">
                Sign in to your console
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
