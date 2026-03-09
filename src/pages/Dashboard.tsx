import { useMemo, useEffect, useState } from 'react';

import { Flame, Zap, Wind, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import KPICard from '@/components/dashboard/KPICard';
import StressHeatmap from '@/components/dashboard/StressHeatmap';
import TrendChart from '@/components/dashboard/TrendChart';
import RecentEntries from '@/components/dashboard/RecentEntries';

export default function Dashboard() {

  const [metrics, setMetrics] = useState<any[]>([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      const { data, error } = await supabase
        .from('metrics')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.error(error);
        return;
      }

      setMetrics(data || []);
    };

    fetchMetrics();
  }, []);

  const sorted = useMemo(
  () =>
    [...metrics]
      .filter((m) => m.date) 
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
  [metrics]
);

  const last7 = sorted.slice(-7);
  const last30 = sorted.slice(-30);
  const prev7 = sorted.slice(-14, -7);

  const avgStress = last7.length
    ? last7.reduce((s, m) => s + m.stress, 0) / last7.length
    : 0;

  const avgEnergy = last7.length
    ? last7.reduce((s, m) => s + m.energy, 0) / last7.length
    : 0;

  const avgCalm = last7.length
    ? last7.reduce((s, m) => s + m.calm, 0) / last7.length
    : 0;

  const highBurnoutCount = last7.filter((m) => m.burnout === "High").length;

  const prevAvgStress = prev7.length
    ? prev7.reduce((s, m) => s + m.stress, 0) / prev7.length
    : avgStress;

  const prevAvgEnergy = prev7.length
    ? prev7.reduce((s, m) => s + m.energy, 0) / prev7.length
    : avgEnergy;

  const prevAvgCalm = prev7.length
    ? prev7.reduce((s, m) => s + m.calm, 0) / prev7.length
    : avgCalm;

  const trend = (curr: number, prev: number): 'up' | 'down' | 'flat' =>
    curr > prev + 0.3 ? 'up' : curr < prev - 0.3 ? 'down' : 'flat';

  const stressTrend = trend(avgStress, prevAvgStress);
  const energyTrend = trend(avgEnergy, prevAvgEnergy);
  const calmTrend = trend(avgCalm, prevAvgCalm);

  const burnoutLabel =
    highBurnoutCount >= 4
      ? 'High'
      : highBurnoutCount >= 2
      ? 'Medium'
      : 'Low';

  const heatmapData = useMemo(
  () =>
    sorted
      .filter((m) => m.date)
      .map((m) => ({
        date: m.date,
        stress: m.stress,
      })),
  [sorted]
);

  const stressChartData = last30
  .filter((m) => m.date)
  .map((m) => ({
    date: m.date,
    value: m.stress,
  }));

  const energyChartData = last30
  .filter((m) => m.date)
  .map((m) => ({
    date: m.date,
    value: m.energy,
  }));
  const calmChartData = last30
  .filter((m) => m.date)
  .map((m) => ({
    date: m.date,
    value: m.calm,
  }));

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-3">
        <div>
          <h1 className="text-[20px] sm:text-[22px] font-semibold text-[var(--tx)] tracking-[-0.02em]">
            Dashboard
          </h1>
          <p className="text-[13px] sm:text-[14px] text-[var(--tx2)] mt-0.5 sm:mt-1">
            Your mental performance overview
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[var(--card)] rounded-full px-3 py-1.5">
          <div className="w-[6px] h-[6px] rounded-full bg-[#0a84ff]" />
          <span className="text-[11px] sm:text-[12px] text-[var(--tx2)]">
            {sorted.length} entries
          </span>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">

        <KPICard
          label="Stress Index"
          value={avgStress.toFixed(1)}
          subtitle="7-day average"
          icon={Flame}
          iconColor="text-[#ff453a]"
          trend={stressTrend}
          trendLabel={`${Math.abs(avgStress - prevAvgStress).toFixed(1)} vs prev`}
        />

        <KPICard
          label="Energy Index"
          value={avgEnergy.toFixed(1)}
          subtitle="7-day average"
          icon={Zap}
          iconColor="text-[#ff9f0a]"
          trend={energyTrend}
          trendLabel={`${Math.abs(avgEnergy - prevAvgEnergy).toFixed(1)} vs prev`}
        />

        <KPICard
          label="Calm Score"
          value={avgCalm.toFixed(1)}
          subtitle="energy + focus − stress"
          icon={Wind}
          iconColor="text-[#30d158]"
          trend={calmTrend}
          trendLabel={`${Math.abs(avgCalm - prevAvgCalm).toFixed(1)} vs prev`}
        />

        <KPICard
          label="Burnout Risk"
          value={burnoutLabel}
          subtitle={`${highBurnoutCount} high-stress days`}
          icon={AlertTriangle}
          iconColor={
            burnoutLabel === 'High'
              ? 'text-[#ff453a]'
              : burnoutLabel === 'Medium'
              ? 'text-[#ff9f0a]'
              : 'text-[#30d158]'
          }
        />

      </div>

      <StressHeatmap data={heatmapData} />

      <div>
        <h2 className="text-[14px] sm:text-[15px] font-semibold text-[var(--tx)] mb-3 sm:mb-4">
          Trends
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">

          <TrendChart
          title="Stress Trend"
          data={stressChartData}
          dataKey="value"
          color="#ff453a"
          gradientId="stressGrad"
        />

        <TrendChart
          title="Energy Trend"
          data={energyChartData}
          dataKey="value"
          color="#ff9f0a"
          gradientId="energyGrad"
        />

        <TrendChart
          title="Calm Score Trend"
          data={calmChartData}
          dataKey="value"
          color="#30d158"
          gradientId="calmGrad"
        />

        </div>
      </div>

      <RecentEntries entries={sorted} count={10} />

    </div>
  );
}