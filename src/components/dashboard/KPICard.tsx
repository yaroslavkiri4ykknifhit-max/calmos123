import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string | number;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  trend?: 'up' | 'down' | 'flat';
  trendLabel?: string;
}

export default function KPICard({
  label,
  value,
  subtitle,
  icon: Icon,
  iconColor,
  trend,
  trendLabel,
}: KPICardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  const isStress = label === 'Stress Index';
  const trendColor =
    isStress
      ? trend === 'up' ? 'text-[#ff453a]' : trend === 'down' ? 'text-[#30d158]' : 'text-[var(--tx2)]'
      : trend === 'up' ? 'text-[#30d158]' : trend === 'down' ? 'text-[#ff453a]' : 'text-[var(--tx2)]';

  return (
    <div className="rounded-2xl bg-[var(--card)] p-4 sm:p-5 lg:p-6 hover:bg-[var(--card-h)]">
      {/* Icon + Label row */}
      <div className="flex items-center justify-between sm:justify-start gap-2.5 mb-3 sm:mb-5">
        <div className="flex items-center gap-2.5">
          <Icon className={`w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] ${iconColor}`} />
          <span className="text-[13px] sm:text-[14px] font-medium text-[var(--tx2)]">{label}</span>
        </div>
        {/* Trend on mobile — inline with label */}
        {trend && trendLabel && (
          <div className={`flex items-center gap-1 text-[11px] font-medium sm:hidden ${trendColor}`}>
            <TrendIcon className="w-3 h-3 tap-sm" />
            <span>{trendLabel}</span>
          </div>
        )}
      </div>

      {/* Large value */}
      <p className="text-[28px] sm:text-[32px] lg:text-[36px] font-bold text-[var(--tx)] tracking-[-0.03em] leading-none tabular-nums">
        {value}
      </p>

      {/* Subtitle + Trend (desktop) */}
      <div className="flex items-center justify-between mt-2 sm:mt-3">
        <p className="text-[12px] sm:text-[13px] text-[var(--tx3)]">{subtitle}</p>
        {trend && trendLabel && (
          <div className={`hidden sm:flex items-center gap-1 text-[12px] font-medium ${trendColor}`}>
            <TrendIcon className="w-3 h-3" />
            <span>{trendLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}
