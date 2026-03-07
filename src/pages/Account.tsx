import { useAuth } from '@/context/AuthContext';
import { useMetrics } from '@/context/MetricsContext';
import { useTheme } from '@/context/ThemeContext';
import FocusRingIcon from '@/components/icons/FocusRingIcon';
import { UserCircle, Calendar, Database, Shield, Download, Trash2, Mail, Sun, Moon } from 'lucide-react';

export default function Account() {
  const { user } = useAuth();
  const { metrics } = useMetrics();
  const { theme, setTheme } = useTheme();

  const highDays = metrics.filter((m) => m.burnout_risk === 'High').length;
  const avgCalm = metrics.length
    ? (metrics.reduce((s, m) => s + m.calm_score, 0) / metrics.length).toFixed(1)
    : '—';

  return (
    <div className="max-w-2xl mx-auto space-y-4 sm:space-y-5 lg:space-y-6">
      <div>
        <h1 className="text-[20px] sm:text-[22px] font-semibold text-[var(--tx)] tracking-[-0.02em]">Account</h1>
        <p className="text-[13px] sm:text-[14px] text-[var(--tx2)] mt-0.5 sm:mt-1">Your profile and application settings</p>
      </div>

      {/* Profile header */}
      <div className="rounded-2xl bg-[var(--card)] p-4 sm:p-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-[48px] h-[48px] sm:w-[60px] sm:h-[60px] rounded-2xl bg-[var(--elev)] flex items-center justify-center shrink-0">
            <span className="text-[18px] sm:text-[22px] font-bold text-[var(--tx2)]">
              {user?.email?.[0]?.toUpperCase() ?? 'U'}
            </span>
          </div>
          <div className="min-w-0">
            <h2 className="text-[15px] sm:text-[17px] font-semibold text-[var(--tx)] truncate">{user?.email}</h2>
            <div className="flex items-center gap-2 mt-1 sm:mt-1.5">
              <div className="w-[6px] h-[6px] rounded-full bg-[#30d158]" />
              <span className="text-[12px] sm:text-[13px] text-[var(--tx2)]">Active · Free Plan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Appearance — Theme Switcher */}
      <div className="rounded-2xl bg-[var(--card)] p-4 sm:p-6">
        <h2 className="text-[14px] sm:text-[15px] font-semibold text-[var(--tx)] mb-1">Appearance</h2>
        <p className="text-[12px] sm:text-[13px] text-[var(--tx2)] mb-4 sm:mb-5">Choose your preferred theme</p>

        {/* Segmented control */}
        <div className="inline-flex rounded-xl bg-[var(--elev)] p-1 gap-1">
          <button
            onClick={() => setTheme('light')}
            className={`flex items-center gap-2 rounded-lg px-4 sm:px-5 py-2.5 text-[13px] font-medium transition-all ${
              theme === 'light'
                ? 'bg-[var(--card)] text-[var(--tx)] shadow-sm'
                : 'text-[var(--tx2)] hover:text-[var(--tx)]'
            }`}
          >
            <Sun className="w-4 h-4 tap-sm" />
            Light
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`flex items-center gap-2 rounded-lg px-4 sm:px-5 py-2.5 text-[13px] font-medium transition-all ${
              theme === 'dark'
                ? 'bg-[var(--card)] text-[var(--tx)] shadow-sm'
                : 'text-[var(--tx2)] hover:text-[var(--tx)]'
            }`}
          >
            <Moon className="w-4 h-4 tap-sm" />
            Dark
          </button>
        </div>
      </div>

      {/* Info rows */}
      <div className="rounded-2xl bg-[var(--card)] divide-y divide-[var(--bd2)]">
        {[
          { icon: Mail, label: 'Email Address', value: user?.email ?? '—' },
          { icon: Shield, label: 'User ID', value: user?.id ?? '—' },
          { icon: Calendar, label: 'Member Since', value: user?.created_at?.slice(0, 10) ?? '—' },
          { icon: Database, label: 'Total Entries', value: `${metrics.length} entries` },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3.5 sm:py-4">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[var(--elev)] flex items-center justify-center shrink-0">
              <Icon className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] text-[var(--tx2)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] sm:text-[12px] text-[var(--tx3)] font-medium">{label}</p>
              <p className="text-[13px] sm:text-[14px] text-[var(--tx)] truncate mt-0.5">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="rounded-2xl bg-[var(--card)] p-3 sm:p-5 text-center">
          <FocusRingIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#0a84ff] mx-auto mb-2 sm:mb-3" />
          <p className="text-[18px] sm:text-[22px] font-bold text-[var(--tx)]">{metrics.length}</p>
          <p className="text-[10px] sm:text-[12px] text-[var(--tx3)] mt-0.5 sm:mt-1">Entries</p>
        </div>
        <div className="rounded-2xl bg-[var(--card)] p-3 sm:p-5 text-center">
          <UserCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#30d158] mx-auto mb-2 sm:mb-3" />
          <p className="text-[18px] sm:text-[22px] font-bold text-[#30d158]">{avgCalm}</p>
          <p className="text-[10px] sm:text-[12px] text-[var(--tx3)] mt-0.5 sm:mt-1">Avg Calm</p>
        </div>
        <div className="rounded-2xl bg-[var(--card)] p-3 sm:p-5 text-center">
          <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-[#ff453a] mx-auto mb-2 sm:mb-3" />
          <p className="text-[18px] sm:text-[22px] font-bold text-[#ff453a]">{highDays}</p>
          <p className="text-[10px] sm:text-[12px] text-[var(--tx3)] mt-0.5 sm:mt-1">High Risk</p>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-2xl bg-[var(--card)] p-4 sm:p-6 space-y-3 sm:space-y-4">
        <h2 className="text-[14px] sm:text-[15px] font-semibold text-[var(--tx)]">Danger Zone</h2>
        <p className="text-[12px] sm:text-[13px] text-[var(--tx2)] leading-relaxed">
          In production, this would allow data export, password changes, or account deletion via Supabase.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button className="rounded-xl bg-[var(--elev)] hover:bg-[var(--tert)] px-4 py-2.5 text-[13px] font-medium text-[var(--tx)] transition flex items-center justify-center sm:justify-start gap-2">
            <Download className="w-4 h-4 tap-sm" />
            Export Data
          </button>
          <button className="rounded-xl bg-[#ff453a]/10 hover:bg-[#ff453a]/15 px-4 py-2.5 text-[13px] font-medium text-[#ff453a] transition flex items-center justify-center sm:justify-start gap-2">
            <Trash2 className="w-4 h-4 tap-sm" />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
