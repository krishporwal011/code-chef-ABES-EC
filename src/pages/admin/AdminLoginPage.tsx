import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ChefLogo } from '../../components/brand/ChefLogo';
import { StampBadge } from '../../components/brand/DoodleGraphics';
import { KeyRound, ShieldAlert, ArrowRight, ArrowLeft } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const res = login(email, password);
    if (res.success) {
      navigate('/admin');
    } else {
      setErrorMsg(res.error || 'Authentication failed');
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@codechef.abesec');
    setPassword('bawarchi2026');
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F6EFE3] dark:bg-[#121110] text-[#1B1A17] dark:text-[#EDE6DA] paper-texture transition-colors">
      <div className="w-full max-w-md bg-[#FFFDF9] dark:bg-[#1A1916] rounded-3xl border-4 border-[#1B1A17] dark:border-[#EDE6DA] p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Ticket Perforations */}
        <div className="ticket-notch-left" />
        <div className="ticket-notch-right" />

        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-3">
            <ChefLogo size="sm" showText={false} />
          </div>
          <div className="flex justify-center gap-2">
            <StampBadge label="STATION MASTER GATE" variant="red" rotate="-2deg" />
            <StampBadge label="RESTRICTED" variant="yellow" rotate="2deg" />
          </div>
          <h1 className="text-2xl font-display font-black text-ink-light dark:text-ink-dark pt-1">
            Bawarchi Control Room
          </h1>
          <p className="text-xs font-mono text-stone-500">
            Authorized Dispatchers &amp; Station Masters Only
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-xl flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs font-mono">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
              Station Master ID / Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@codechef.abesec"
              required
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#DDD2C1] dark:border-[#38342D] bg-[#FAF8F5] dark:bg-stone-900 text-sm font-sans focus:outline-hidden focus:ring-2 focus:ring-tomato"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
              Access Passcode
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#DDD2C1] dark:border-[#38342D] bg-[#FAF8F5] dark:bg-stone-900 text-sm font-sans focus:outline-hidden focus:ring-2 focus:ring-tomato"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-tomato hover:bg-tomato-hover text-white rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            <span>Enter Control Room</span>
          </button>
        </form>

        {/* Demo Credentials Box */}
        <div className="p-4 bg-[#FAF6EC] dark:bg-stone-900/60 rounded-xl border border-dashed border-[#DDD2C1] dark:border-[#38342D] space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="font-bold text-stone-700 dark:text-stone-300">Demo Credentials:</span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-tomato hover:underline font-bold flex items-center gap-1"
            >
              <span>Auto-Fill</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="font-mono text-xs text-stone-600 dark:text-stone-400 space-y-0.5">
            <div>
              Email: <code className="text-tomato font-bold">admin@codechef.abesec</code>
            </div>
            <div>
              Password: <code className="text-tomato font-bold">bawarchi2026</code>
            </div>
          </div>
        </div>

        {/* Return link */}
        <div className="text-center pt-1">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-xs font-mono text-stone-500 hover:text-tomato transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Platform</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
