import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (role) => {
    login(email, role);
    navigate(role === 'super-admin' ? '/super-admin/dashboard' : '/legal-admin/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_#dbeafe,_#f8fafc)] p-4">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <div className="grid md:grid-cols-2">
          <div className="bg-primary px-8 py-12 text-white md:px-12">
            <p className="text-sm uppercase tracking-[0.3em] text-blue-200">AI Tender Management</p>
            <h1 className="mt-4 text-3xl font-semibold">Secure, intelligent tender operations for modern enterprises.</h1>
            <p className="mt-4 text-sm text-blue-100">Track, review, and approve tenders with role-based intelligence and elegant workflows.</p>
          </div>
          <div className="p-8 md:p-12">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Choose a role to continue</p>

            <div className="mt-6 space-y-4">
              <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@tender.ai" />
              <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>

            <div className="mt-6 space-y-3">
              <Button className="w-full" onClick={() => handleLogin('super-admin')}>Login as Super Admin</Button>
              <Button variant="secondary" className="w-full" onClick={() => handleLogin('legal-admin')}>Login as Legal Admin</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
