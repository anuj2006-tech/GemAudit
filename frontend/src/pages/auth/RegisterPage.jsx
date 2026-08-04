import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerCompany } from '../../services/authService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Brain, ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Registration Payload State
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    country: '',
    phone: '',
    companyEmail: '',
    ownerName: '',
    ownerEmail: '',
    ownerPassword: '',
    confirmPassword: ''
  });

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

        // Registration successful
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
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 relative overflow-hidden font-sans">
      {/* Background radial effects */}
      <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-900 bg-slate-950 shadow-2xl relative z-10">
        <div className="grid md:grid-cols-5">
          {/* Sidebar Left */}
          <div className="md:col-span-2 bg-gradient-to-br from-blue-900/60 to-indigo-950/80 p-8 text-white flex flex-col justify-between border-r border-slate-900">
            <div>
              <div className="flex items-center gap-2 mb-8">
                <Brain className="h-6 w-6 text-blue-400" />
                <span className="text-lg font-bold">TenderAI SaaS</span>
              </div>
              <h2 className="text-2xl font-bold leading-tight">Create your secure enterprise bidding sandbox.</h2>
              <p className="mt-4 text-sm text-slate-300">Register in under 2 minutes and provision isolated workspaces for your proposal team.</p>
            </div>

            {/* Stepper Progress */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3">
                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold border ${step >= 1 ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-700 text-slate-500'}`}>1</span>
                <span className={`text-sm font-semibold ${step >= 1 ? 'text-white' : 'text-slate-500'}`}>Company Info</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold border ${step >= 2 ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-700 text-slate-500'}`}>2</span>
                <span className={`text-sm font-semibold ${step >= 2 ? 'text-white' : 'text-slate-500'}`}>Owner Account</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold border ${step >= 3 ? 'bg-green-600 border-green-600 text-white' : 'border-slate-700 text-slate-500'}`}>3</span>
                <span className={`text-sm font-semibold ${step >= 3 ? 'text-white' : 'text-slate-500'}`}>Provision Workspace</span>
              </div>
            </div>

            <div className="mt-12 text-xs text-slate-400">
              Secured with AES and Argon2 compliance benchmarks.
            </div>
          </div>

          {/* Form Content Right */}
          <div className="md:col-span-3 p-8 lg:p-12 text-slate-200">
            {error && (
              <div className="mb-6 rounded-xl bg-red-950/30 border border-red-900/50 p-4 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Step 1: Company Profile Registration */}
            {step === 1 && (
              <div>
                <h3 className="text-xl font-bold text-white">Step 1: Register Company</h3>
                <p className="mt-1 text-sm text-slate-400">Fill in details to setup your business tenant node.</p>

                <div className="mt-6 space-y-4">
                  <Input
                    label="Company Name"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="Enter official company name"
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Industry"
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      placeholder="e.g. Legal, IT"
                    />
                    <Input
                      label="Country"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="e.g. United States"
                    />
                  </div>
                  <Input
                    label="Phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +1 (555) 019-2834"
                  />
                  <Input
                    label="Company Email"
                    type="email"
                    value={formData.companyEmail}
                    onChange={(e) => setFormData({ ...formData, companyEmail: e.target.value })}
                    placeholder="billing@company.com"
                    required
                  />
                </div>

                <div className="mt-8 flex justify-end">
                  <Button onClick={nextStep} className="flex items-center gap-2">
                    Next: Owner Profile
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Owner User Details */}
            {step === 2 && (
              <form onSubmit={handleRegister}>
                <h3 className="text-xl font-bold text-white">Step 2: Create Company Owner</h3>
                <p className="mt-1 text-sm text-slate-400">Setup credentials for the primary administrator account.</p>

                <div className="mt-6 space-y-4">
                  <Input
                    label="Owner Name"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    placeholder="Jane Doe"
                    required
                  />
                  <Input
                    label="Owner Login Email"
                    type="email"
                    value={formData.ownerEmail}
                    onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                    placeholder="jane.doe@company.com"
                    required
                  />
                  <Input
                    label="Password"
                    type="password"
                    value={formData.ownerPassword}
                    onChange={(e) => setFormData({ ...formData, ownerPassword: e.target.value })}
                    placeholder="••••••••"
                    required
                  />
                  <Input
                    label="Confirm Password"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Creating Sandbox...' : 'Complete Setup'}
                  </Button>
                </div>
              </form>
            )}

            {/* Step 3: Success Redirection */}
            {step === 3 && (
              <div className="text-center py-8">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 border border-green-500/30 text-green-500 mb-6">
                  <Check className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-white flex justify-center items-center gap-2">
                  Workspace Ready!
                  <Sparkles className="h-5 w-5 text-yellow-400" />
                </h3>
                <p className="mt-4 text-sm text-slate-400 max-w-sm mx-auto">
                  Company <strong>{formData.companyName}</strong> has been provisioned. The Owner account is initialized under role <strong>COMPANY_OWNER</strong>.
                </p>

                <div className="mt-8">
                  <Button onClick={() => navigate('/auth/login')} className="w-full">
                    Go to Login Page
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
