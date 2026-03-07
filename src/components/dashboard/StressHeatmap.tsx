import { useMemo, useState, useCallback } from 'react';

interface HeatmapProps {
  data: { date: string; stress: number }[];
}

export default function StressHeatmap({ data }: HeatmapProps) {
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    date: string;
    stress: number | null;
  } | null>(null);

  const { weeks, months } = useMemo(() => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 90);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const dataMap = new Map(data.map((d) => [d.date, d.stress]));
    const weeksArr: { date: string; stress: number | null; dayOfWeek: number }[][] = [];
    const monthLabels: { label: string; weekIndex: number }[] = [];
    let currentWeek: { date: string; stress: number | null; dayOfWeek: number }[] = [];
    let lastMonth = -1;

    const cursor = new Date(startDate);
    while (cursor <= today) {
      const dateStr = cursor.toISOString().slice(0, 10);
      const dayOfWeek = cursor.getDay();

      if (dayOfWeek === 0 && currentWeek.length > 0) {
        weeksArr.push(currentWeek);
        currentWeek = [];
      }

      const month = cursor.getMonth();
      if (month !== lastMonth) {
        monthLabels.push({
          label: cursor.toLocaleString('en', { month: 'short' }),
          weekIndex: weeksArr.length,
        });
        lastMonth = month;
      }

      currentWeek.push({
        date: dateStr,
        stress: dataMap.has(dateStr) ? dataMap.get(dateStr)! : null,
        dayOfWeek,
      });

      cursor.setDate(cursor.getDate() + 1);
    }
    if (currentWeek.length > 0) weeksArr.push(currentWeek);

    return { weeks: weeksArr, months: monthLabels };
  }, [data]);

  const getColor = (stress: number | null) => {
    if (stress === null) return 'bg-[var(--elev)]';
    if (stress <= 2) return 'bg-[#30d158]/30';
    if (stress <= 4) return 'bg-[#30d158]/55';
    if (stress <= 5) return 'bg-[#ffd60a]/40';
    if (stress <= 7) return 'bg-[#ff9f0a]/50';
    return 'bg-[#ff453a]/55';
  };

  const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

  // Unified handler for both hover and tap
  const handleInteraction = useCallback(
    (e: React.MouseEvent | React.TouchEvent, cell: { date: string; stress: number | null } | undefined) => {
      if (!cell) return;
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const parent = target.closest('.relative')?.getBoundingClientRect();
      if (parent) {
        setTooltip({
          x: rect.left - parent.left + rect.width / 2,
          y: rect.top - parent.top - 10,
          date: cell.date,
          stress: cell.stress,
        });
      }
    },
    []
  );

  return (
    <div className="rounded-2xl bg-[var(--card)] p-4 sm:p-6 lg:p-7 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 sm:mb-6">
        <div>
          <h3 className="text-[14px] sm:text-[15px] font-semibold text-[var(--tx)]">Stress Heatmap</h3>
          <p className="text-[12px] sm:text-[13px] text-[var(--tx3)] mt-0.5 sm:mt-1">Daily stress levels — last 90 days</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-[var(--tx3)]">
          <span>Low</span>
          <div className="flex gap-[2px] sm:gap-[3px]">
            <div className="w-[9px] h-[9px] sm:w-[11px] sm:h-[11px] rounded-[2px] sm:rounded-[3px] bg-[#30d158]/30" />
            <div className="w-[9px] h-[9px] sm:w-[11px] sm:h-[11px] rounded-[2px] sm:rounded-[3px] bg-[#30d158]/55" />
            <div className="w-[9px] h-[9px] sm:w-[11px] sm:h-[11px] rounded-[2px] sm:rounded-[3px] bg-[#ffd60a]/40" />
            <div className="w-[9px] h-[9px] sm:w-[11px] sm:h-[11px] rounded-[2px] sm:rounded-[3px] bg-[#ff9f0a]/50" />
            <div className="w-[9px] h-[9px] sm:w-[11px] sm:h-[11px] rounded-[2px] sm:rounded-[3px] bg-[#ff453a]/55" />
          </div>
          <span>High</span>
        </div>
      </div>

      {/* Scrollable heatmap grid */}
      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 pb-2">
        <div className="inline-flex gap-0" style={{ minWidth: 'max-content' }}>
          {/* Day labels */}
          <div className="flex flex-col gap-[3px] sm:gap-[5px] mr-2 sm:mr-3 pt-[18px] sm:pt-[20px]">
            {dayLabels.map((label, i) => (
              <div key={i} className="h-[10px] sm:h-[13px] flex items-center">
                <span className="text-[9px] sm:text-[10px] text-[var(--tx3)] w-5 sm:w-7 text-right">{label}</span>
              </div>
            ))}
          </div>

          {/* Weeks grid */}
          <div>
            {/* Month labels */}
            <div className="flex gap-[3px] sm:gap-[5px] mb-[4px] sm:mb-[6px] h-[12px] sm:h-[14px]">
              {weeks.map((_, weekIdx) => {
                const monthLabel = months.find((m) => m.weekIndex === weekIdx);
                return (
                  <div key={weekIdx} className="w-[10px] sm:w-[13px] flex items-center">
                    {monthLabel && (
                      <span className="text-[9px] sm:text-[10px] text-[var(--tx3)] whitespace-nowrap">
                        {monthLabel.label}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            {/* Cells */}
            <div className="flex gap-[3px] sm:gap-[5px]">
              {weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-[3px] sm:gap-[5px]">
                  {Array.from({ length: 7 }).map((_, dayIdx) => {
                    const cell = week.find((c) => c.dayOfWeek === dayIdx);
                    return (
                      <div
                        key={dayIdx}
                        className={`w-[10px] h-[10px] sm:w-[13px] sm:h-[13px] rounded-[2.5px] sm:rounded-[3.5px] no-transition ${
                          cell
                            ? `${getColor(cell.stress)} hover:ring-2 hover:ring-[var(--tx)]/20 cursor-pointer`
                            : 'bg-transparent'
                        }`}
                        onMouseEnter={(e) => handleInteraction(e, cell)}
                        onTouchStart={(e) => {
                          e.preventDefault();
                          handleInteraction(e, cell);
                        }}
                        onMouseLeave={() => setTooltip(null)}
                        onTouchEnd={() => setTimeout(() => setTooltip(null), 1500)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile scroll hint */}
      <p className="text-[11px] text-[var(--tx3)] mt-2 text-center sm:hidden">← Scroll to view all →</p>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-full"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <div
            className="rounded-xl px-3 py-2 sm:px-4 sm:py-3 border border-[var(--bd2)]"
            style={{
              backgroundColor: 'var(--tooltip-bg)',
              boxShadow: '0 8px 32px var(--tooltip-sh)',
            }}
          >
            <p className="text-[11px] sm:text-[12px] font-medium text-[var(--tx)] whitespace-nowrap">
              {new Date(tooltip.date).toLocaleDateString('en', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </p>
            <p className="text-[10px] sm:text-[11px] text-[var(--tx2)] mt-0.5 sm:mt-1">
              Stress:{' '}
              <span className="text-[var(--tx)] font-semibold">
                {tooltip.stress ?? 'No data'}
              </span>
              {tooltip.stress !== null && (
                <span className="text-[var(--tx3)]"> / 10</span>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
