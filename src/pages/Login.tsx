import { useState, useEffect, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import FocusRingIcon from '@/components/icons/FocusRingIcon';
import { ArrowRight } from 'lucide-react';

export default function Login() {
  const { user, signIn, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('demo@calmos.app');
  const [password, setPassword] = useState('password');

  // Navigate to dashboard once user state is confirmed set by React
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
    // Navigation is handled by the useEffect above after React commits the state
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg)]">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[var(--card)]">
        {/* Subtle gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full blur-[120px]" style={{ backgroundColor: 'var(--accent-subtle)' }} />
        <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] bg-[#5e5ce6]/[0.05] rounded-full blur-[120px]" />

        <div className="relative z-10 flex flex-col justify-center px-16 xl:px-20">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-11 h-11 rounded-[13px] bg-[#0a84ff] flex items-center justify-center">
              <FocusRingIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-[20px] font-semibold text-[var(--tx)] tracking-[-0.02em]">CalmOS</span>
          </div>
          <h2 className="text-[34px] font-bold text-[var(--tx)] leading-[1.15] tracking-[-0.03em] mb-4">
            Track your mental{'\n'}
            <span className="text-[#0a84ff]">performance daily</span>
          </h2>
          <p className="text-[16px] text-[var(--tx2)] max-w-[380px] leading-relaxed">
            Monitor stress, energy, focus, and burnout risk with clean analytics and personal insights.
          </p>

          <div className="flex items-center gap-10 mt-16">
            {[
              { n: '4', l: 'Key Metrics' },
              { n: '90', l: 'Day Heatmap' },
              { n: '3', l: 'Trend Charts' },
            ].map((s) => (
              <div key={s.l}>
                <p className="text-[24px] font-bold text-[var(--tx)] tracking-[-0.02em]">{s.n}</p>
                <p className="text-[12px] text-[var(--tx3)] mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-[#0a84ff] flex items-center justify-center">
              <FocusRingIcon className="w-[18px] h-[18px] text-white" />
            </div>
            <span className="text-[18px] font-semibold text-[var(--tx)] tracking-[-0.01em]">CalmOS</span>
          </div>

          <h1 className="text-[24px] font-bold text-[var(--tx)] tracking-[-0.02em] mb-2">
            Welcome back
          </h1>
          <p className="text-[15px] text-[var(--tx2)] mb-10">
            Sign in to your account to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[13px] font-medium text-[var(--tx2)] mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[var(--bd2)] bg-[var(--card)] px-4 py-3 text-[15px] text-[var(--tx)] placeholder:text-[var(--tx3)] focus:outline-none focus:border-[#0a84ff] focus:ring-1 focus:ring-[#0a84ff]/30 transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[var(--tx2)] mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-[var(--bd2)] bg-[var(--card)] px-4 py-3 text-[15px] text-[var(--tx)] placeholder:text-[var(--tx3)] focus:outline-none focus:border-[#0a84ff] focus:ring-1 focus:ring-[#0a84ff]/30 transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#0a84ff] hover:bg-[#0a84ff]/90 py-3 text-[15px] font-semibold text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 group mt-3 active:scale-[0.98]"
            >
              {loading ? 'Signing in…' : 'Sign In'}
              {!loading && (
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              )}
            </button>
          </form>

          {/* Demo note */}
          <div className="mt-8 rounded-xl bg-[var(--card)] border border-[var(--bd2)] px-5 py-4">
            <p className="text-[13px] text-[var(--tx2)] text-center leading-relaxed">
              <span className="text-[var(--tx)] font-medium">Demo mode</span> — Enter any email and password to explore the dashboard.
            </p>
          </div>

          <p className="text-center text-[14px] text-[var(--tx2)] mt-8">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-[#0a84ff] hover:text-[#0a84ff]/80 font-medium transition">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
