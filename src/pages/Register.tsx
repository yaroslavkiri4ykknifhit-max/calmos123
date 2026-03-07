import { useState, useEffect, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import FocusRingIcon from '@/components/icons/FocusRingIcon';
import { ArrowRight, Check } from 'lucide-react';

const FEATURES = [
  'Track stress, energy & focus daily',
  'Visual heatmap & trend charts',
  'Automatic calm score calculation',
  'Burnout risk detection',
];

export default function Register() {
  const { user, signUp, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Navigate to dashboard once user state is confirmed set by React
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await signUp(email, password);
    // Navigation is handled by the useEffect above after React commits the state
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg)]">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[var(--card)]">
        <div className="absolute top-1/3 left-1/3 w-[350px] h-[350px] bg-[#5e5ce6]/[0.06] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[280px] h-[280px] rounded-full blur-[120px]" style={{ backgroundColor: 'var(--accent-subtle)' }} />

        <div className="relative z-10 flex flex-col justify-center px-16 xl:px-20">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-11 h-11 rounded-[13px] bg-[#0a84ff] flex items-center justify-center">
              <FocusRingIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-[20px] font-semibold text-[var(--tx)] tracking-[-0.02em]">CalmOS</span>
          </div>
          <h2 className="text-[34px] font-bold text-[var(--tx)] leading-[1.15] tracking-[-0.03em] mb-8">
            Start tracking your{'\n'}mental wellness
          </h2>

          <div className="space-y-4">
            {FEATURES.map((feat) => (
              <div key={feat} className="flex items-center gap-3.5">
                <div className="w-6 h-6 rounded-full bg-[#30d158]/15 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-[#30d158]" />
                </div>
                <p className="text-[15px] text-[var(--tx2)]">{feat}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-[400px]">
          <div className="lg:hidden flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-[#0a84ff] flex items-center justify-center">
              <FocusRingIcon className="w-[18px] h-[18px] text-white" />
            </div>
            <span className="text-[18px] font-semibold text-[var(--tx)] tracking-[-0.01em]">CalmOS</span>
          </div>

          <h1 className="text-[24px] font-bold text-[var(--tx)] tracking-[-0.02em] mb-2">
            Create account
          </h1>
          <p className="text-[15px] text-[var(--tx2)] mb-10">
            Start your mental performance journey
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
                placeholder="Min. 8 characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#0a84ff] hover:bg-[#0a84ff]/90 py-3 text-[15px] font-semibold text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 group mt-3 active:scale-[0.98]"
            >
              {loading ? 'Creating…' : 'Create Account'}
              {!loading && (
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              )}
            </button>
          </form>

          <p className="text-center text-[14px] text-[var(--tx2)] mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-[#0a84ff] hover:text-[#0a84ff]/80 font-medium transition">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
