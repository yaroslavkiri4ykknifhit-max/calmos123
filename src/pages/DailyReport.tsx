import { useState, useMemo } from 'react';
import { useMetrics } from '@/context/MetricsContext';
import type { DailyMetric } from '@/types/database';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import {
  Moon,
  Flame,
  Zap,
  Target,
  Wind,
  AlertTriangle,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  FileText,
} from 'lucide-react';

/* ── Metric progress bar ── */
function MetricBar({
  label,
  value,
  max,
  icon: Icon,
  color,
  barColor,
}: {
  label: string;
  value: number;
  max: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  barColor: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="space-y-2 sm:space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${color}`} />
          <span className="text-[12px] sm:text-[13px] text-[var(--tx2)]">{label}</span>
        </div>
        <span className="text-[13px] sm:text-[14px] font-semibold text-[var(--tx)] tabular-nums">
          {value}
          <span className="text-[var(--tx3)] font-normal">/{max}</span>
        </span>
      </div>
      <div className="h-[4px] sm:h-[5px] w-full rounded-full bg-[var(--elev)] overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor} no-transition`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/* ── Radar chart ── */
function DayRadarChart({ metric }: { metric: DailyMetric }) {
  const radarData = [
    { metric: 'Sleep', value: Math.min(10, metric.sleep_hours), fullMark: 10 },
    { metric: 'Stress', value: metric.stress_level, fullMark: 10 },
    { metric: 'Energy', value: metric.energy_level, fullMark: 10 },
    { metric: 'Focus', value: metric.focus_level, fullMark: 10 },
    { metric: 'Calm', value: Math.max(0, Math.min(10, metric.calm_score)), fullMark: 10 },
  ];

  return (
    <div className="rounded-2xl bg-[var(--card)] p-4 sm:p-6">
      <h3 className="text-[14px] sm:text-[15px] font-semibold text-[var(--tx)] mb-1">Performance Radar</h3>
      <p className="text-[12px] sm:text-[13px] text-[var(--tx3)] mb-2 sm:mb-3">Multi-dimensional view</p>
      <div className="h-[200px] sm:h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="65%">
            <PolarGrid stroke="var(--bd2)" />
            <PolarAngleAxis dataKey="metric" tick={{ fill: 'var(--tx2)', fontSize: 10 }} />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 10]}
              tick={{ fill: 'var(--tx3)', fontSize: 8 }}
              axisLine={false}
            />
            <Radar
              name="Today"
              dataKey="value"
              stroke="#0a84ff"
              fill="#0a84ff"
              fillOpacity={0.12}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ── Bar chart ── */
function DayBarChart({ metric }: { metric: DailyMetric }) {
  const barData = [
    { name: 'Sleep', value: metric.sleep_hours, color: '#5e5ce6' },
    { name: 'Stress', value: metric.stress_level, color: '#ff453a' },
    { name: 'Energy', value: metric.energy_level, color: '#ff9f0a' },
    { name: 'Focus', value: metric.focus_level, color: '#0a84ff' },
    { name: 'Calm', value: Math.max(0, metric.calm_score), color: '#30d158' },
  ];

  return (
    <div className="rounded-2xl bg-[var(--card)] p-4 sm:p-6">
      <h3 className="text-[14px] sm:text-[15px] font-semibold text-[var(--tx)] mb-1">Metrics Comparison</h3>
      <p className="text-[12px] sm:text-[13px] text-[var(--tx3)] mb-2 sm:mb-3">Side-by-side values</p>
      <div className="h-[200px] sm:h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData} margin={{ top: 8, right: 4, bottom: 0, left: -16 }}>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--tx2)', fontSize: 10 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--tx3)', fontSize: 9 }}
              domain={[0, 12]}
              width={28}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--tooltip-bg)',
                border: '1px solid var(--bd2)',
                borderRadius: '12px',
                fontSize: '12px',
                color: 'var(--tx)',
                boxShadow: '0 8px 32px var(--tooltip-sh)',
                padding: '8px 12px',
              }}
              formatter={(value: unknown) => [String(value), 'Value']}
            />
            <Bar dataKey="value" radius={[5, 5, 0, 0]} barSize={28}>
              {barData.map((entry, index) => (
                <Cell key={index} fill={entry.color} fillOpacity={0.7} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ── Daily Notes Card ── */
function DailyNotes({ notes }: { notes?: string }) {
  return (
    <div className="rounded-2xl bg-[var(--card)] overflow-hidden">
      <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-[var(--bd2)] flex items-center gap-3">
        <FileText className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] text-[#5e5ce6]" />
        <h3 className="text-[14px] sm:text-[15px] font-semibold text-[var(--tx)]">Daily Notes</h3>
      </div>
      <div className="px-4 sm:px-6 py-4 sm:py-5">
        {notes ? (
          <p className="text-[13px] sm:text-[14px] text-[var(--tx2)] leading-relaxed whitespace-pre-wrap">
            {notes}
          </p>
        ) : (
          <div className="text-center py-4 sm:py-6">
            <div className="w-10 h-10 rounded-xl bg-[var(--elev)] flex items-center justify-center mx-auto mb-3">
              <FileText className="w-5 h-5 text-[var(--tx3)]" />
            </div>
            <p className="text-[13px] sm:text-[14px] text-[var(--tx3)]">No notes for this day.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Report card ── */
function ReportCard({ metric }: { metric: DailyMetric }) {
  const dateFormatted = new Date(metric.date).toLocaleDateString('en', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Shorter date for mobile
  const dateFormattedShort = new Date(metric.date).toLocaleDateString('en', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const insight =
    metric.stress_level > 7
      ? {
          text: 'Stress is critically high. Consider rest, breaks, or meditation.',
          emoji: '⚠️',
          bg: 'bg-[#ff453a]/[0.06]',
        }
      : metric.calm_score >= 10
      ? {
          text: 'Great day! High calm score indicates strong focus and energy.',
          emoji: '✅',
          bg: 'bg-[#30d158]/[0.06]',
        }
      : metric.sleep_hours < 6
      ? {
          text: 'Low sleep detected. Aim for 7–8 hours for better performance.',
          emoji: '😴',
          bg: 'bg-[#ff9f0a]/[0.06]',
        }
      : {
          text: 'Decent day. Keep tracking to spot patterns in your data.',
          emoji: '👍',
          bg: 'bg-[#0a84ff]/[0.06]',
        };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Header card */}
      <div className="rounded-2xl bg-[var(--card)] overflow-hidden">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[var(--bd2)] flex items-center justify-between gap-2">
          {/* Long date on desktop, short on mobile */}
          <h2 className="text-[13px] sm:text-[15px] font-semibold text-[var(--tx)]">
            <span className="hidden sm:inline">{dateFormatted}</span>
            <span className="sm:hidden">{dateFormattedShort}</span>
          </h2>
          <span
            className={`inline-flex items-center gap-1 sm:gap-1.5 rounded-full px-2 sm:px-3 py-1 text-[11px] sm:text-[12px] font-medium shrink-0 ${
              metric.burnout_risk === 'High'
                ? 'bg-[#ff453a]/10 text-[#ff453a]'
                : metric.burnout_risk === 'Medium'
                ? 'bg-[#ff9f0a]/10 text-[#ff9f0a]'
                : 'bg-[#30d158]/10 text-[#30d158]'
            }`}
          >
            <AlertTriangle className="w-3 h-3 tap-sm" />
            {metric.burnout_risk} Risk
          </span>
        </div>

        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {[
              {
                icon: Moon,
                value: `${metric.sleep_hours}h`,
                label: 'Sleep',
                color: 'text-[#5e5ce6]',
                valueColor: 'text-[var(--tx)]',
              },
              {
                icon: Wind,
                value: String(metric.calm_score),
                label: 'Calm',
                color: 'text-[#30d158]',
                valueColor: 'text-[#30d158]',
              },
              {
                icon: AlertTriangle,
                value: metric.burnout_risk,
                label: 'Burnout',
                color:
                  metric.burnout_risk === 'High'
                    ? 'text-[#ff453a]'
                    : metric.burnout_risk === 'Medium'
                    ? 'text-[#ff9f0a]'
                    : 'text-[#30d158]',
                valueColor:
                  metric.burnout_risk === 'High'
                    ? 'text-[#ff453a]'
                    : metric.burnout_risk === 'Medium'
                    ? 'text-[#ff9f0a]'
                    : 'text-[#30d158]',
              },
            ].map(({ icon: Ic, value, label, color, valueColor }) => (
              <div key={label} className="text-center py-2 sm:py-3">
                <Ic className={`w-4 h-4 sm:w-5 sm:h-5 ${color} mx-auto mb-2 sm:mb-3`} />
                <p className={`text-[16px] sm:text-[18px] font-bold ${valueColor}`}>{value}</p>
                <p className="text-[11px] sm:text-[12px] text-[var(--tx3)] mt-0.5 sm:mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Progress bars */}
          <div className="space-y-3 sm:space-y-4 pt-1 sm:pt-2">
            <MetricBar
              label="Stress"
              value={metric.stress_level}
              max={10}
              icon={Flame}
              color="text-[#ff453a]"
              barColor="bg-[#ff453a]"
            />
            <MetricBar
              label="Energy"
              value={metric.energy_level}
              max={10}
              icon={Zap}
              color="text-[#ff9f0a]"
              barColor="bg-[#ff9f0a]"
            />
            <MetricBar
              label="Focus"
              value={metric.focus_level}
              max={10}
              icon={Target}
              color="text-[#0a84ff]"
              barColor="bg-[#0a84ff]"
            />
          </div>

          {/* Insight */}
          <div className={`rounded-xl ${insight.bg} px-4 sm:px-5 py-3 sm:py-4 flex items-start gap-2.5 sm:gap-3`}>
            <Lightbulb className="w-4 h-4 text-[var(--tx2)] shrink-0 mt-0.5 tap-sm" />
            <p className="text-[12px] sm:text-[13px] text-[var(--tx2)] leading-relaxed">
              {insight.emoji} {insight.text}
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <DayRadarChart metric={metric} />
        <DayBarChart metric={metric} />
      </div>

      {/* Daily Notes — below charts */}
      <DailyNotes notes={metric.notes} />
    </div>
  );
}

/* ── Main Page ── */
export default function DailyReport() {
  const { metrics } = useMetrics();
  const todayStr = new Date().toISOString().slice(0, 10);

  const sorted = useMemo(
  () =>
    metrics
      .filter((m) => m.date)
      .sort((a, b) => b.date.localeCompare(a.date)),
  [metrics]
);

  const uniqueDates = useMemo(() => {
  const seen = new Set<string>();

  return sorted.filter((m) => {
    if (!m.date) return false;

    if (seen.has(m.date)) return false;

    seen.add(m.date);

    return true;
  });
}, [sorted]);

  const defaultDate = uniqueDates.find((m) => m.date === todayStr)
    ? todayStr
    : uniqueDates[0]?.date ?? '';

  const [selectedDate, setSelectedDate] = useState(defaultDate);

  const currentEntry = sorted.find((m) => m.date === selectedDate);
  const currentIndex = uniqueDates.findIndex((m) => m.date === selectedDate);

  const goPrev = () => {
    if (currentIndex < uniqueDates.length - 1) {
      setSelectedDate(uniqueDates[currentIndex + 1].date);
    }
  };
  const goNext = () => {
    if (currentIndex > 0) {
      setSelectedDate(uniqueDates[currentIndex - 1].date);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-5 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[20px] sm:text-[22px] font-semibold text-[var(--tx)] tracking-[-0.02em]">
            Daily Report
          </h1>
          <p className="text-[13px] sm:text-[14px] text-[var(--tx2)] mt-0.5 sm:mt-1">
            Detailed breakdown for each day
          </p>
        </div>

        {/* Date navigation — full width on mobile */}
        <div className="flex items-center gap-2">
          <button
            onClick={goPrev}
            disabled={currentIndex >= uniqueDates.length - 1}
            className="w-10 h-10 sm:w-9 sm:h-9 rounded-xl bg-[var(--card)] flex items-center justify-center text-[var(--tx2)] hover:text-[var(--tx)] hover:bg-[var(--elev)] transition disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="flex-1 sm:flex-none rounded-xl border border-[var(--bd2)] bg-[var(--card)] px-3 sm:px-4 py-2.5 sm:py-2 text-[var(--tx)] focus:outline-none focus:border-[#0a84ff] focus:ring-1 focus:ring-[#0a84ff]/30 transition"
          />

          <button
            onClick={goNext}
            disabled={currentIndex <= 0}
            className="w-10 h-10 sm:w-9 sm:h-9 rounded-xl bg-[var(--card)] flex items-center justify-center text-[var(--tx2)] hover:text-[var(--tx)] hover:bg-[var(--elev)] transition disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Report content */}
      {currentEntry ? (
        <ReportCard metric={currentEntry} />
      ) : (
        <div className="rounded-2xl bg-[var(--card)] px-4 sm:px-6 py-16 sm:py-24 text-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[var(--elev)] flex items-center justify-center mx-auto mb-4 sm:mb-5">
            <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--tx3)]" />
          </div>
          <h3 className="text-[16px] sm:text-[17px] font-semibold text-[var(--tx)] mb-2">No Entry Found</h3>
          <p className="text-[var(--tx2)] text-[13px] sm:text-[14px] max-w-sm mx-auto">
            No metrics were recorded for this date. Use the Daily Entry page to add data.
          </p>
        </div>
      )}

      {/* Quick date selector */}
      <div className="rounded-2xl bg-[var(--card)] p-4 sm:p-6">
        <h3 className="text-[14px] sm:text-[15px] font-semibold text-[var(--tx)] mb-3 sm:mb-4">Recent Entries</h3>
        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-4 lg:grid-cols-7 snap-x snap-mandatory sm:snap-none">
          {uniqueDates.slice(0, 7).map((m) => {
            const d = new Date(m.date);
            const isSelected = m.date === selectedDate;
            return (
              <button
                key={m.date}
                onClick={() => setSelectedDate(m.date)}
                className={`rounded-xl p-3 text-center transition-all shrink-0 w-[72px] sm:w-auto snap-start ${
                  isSelected
                    ? 'bg-[#0a84ff]/10 ring-1 ring-[#0a84ff]/30'
                    : 'bg-[var(--elev)]/50 hover:bg-[var(--elev)]'
                }`}
              >
                <p className="text-[10px] sm:text-[11px] text-[var(--tx3)]">
                  {d.toLocaleDateString('en', { weekday: 'short' })}
                </p>
                <p
                  className={`text-[16px] sm:text-[17px] font-bold mt-1 ${
                    isSelected ? 'text-[#0a84ff]' : 'text-[var(--tx)]'
                  }`}
                >
                  {d.getDate()}
                </p>
                <p className="text-[10px] sm:text-[11px] text-[var(--tx3)] mt-0.5">
                  {d.toLocaleDateString('en', { month: 'short' })}
                </p>
                <div className="mt-2 flex justify-center gap-1.5">
                  <span
                    className={`inline-block w-[5px] h-[5px] sm:w-[6px] sm:h-[6px] rounded-full tap-sm ${
                      m.burnout_risk === 'High'
                        ? 'bg-[#ff453a]'
                        : m.burnout_risk === 'Medium'
                        ? 'bg-[#ff9f0a]'
                        : 'bg-[#30d158]'
                    }`}
                  />
                  {m.notes && (
                    <span className="inline-block w-[5px] h-[5px] sm:w-[6px] sm:h-[6px] rounded-full bg-[#5e5ce6] tap-sm" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
