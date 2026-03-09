import { useState, useEffect, useCallback } from 'react';
import type { DailyMetric } from '@/types/database';
import { X, FileText, CalendarDays } from 'lucide-react';

/* ── Notes Modal ── */
function NoteModal({
  metric,
  onClose,
}: {
  metric: DailyMetric;
  onClose: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 200);
  }, [onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [handleClose]);

  const dateFormatted = new Date(metric.date).toLocaleDateString('en', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 transition-all duration-200 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal Card — full width on mobile, centered on desktop */}
      <div
        className={`relative w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl bg-[var(--card)] border-t sm:border border-[var(--bd2)] shadow-2xl transition-all duration-200 ${
          visible
            ? 'translate-y-0 sm:scale-100'
            : 'translate-y-full sm:translate-y-0 sm:scale-95'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag indicator (mobile) */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-9 h-1 rounded-full bg-[var(--tert)]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 border-b border-[var(--bd2)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#5e5ce6]/10 flex items-center justify-center shrink-0">
              <FileText className="w-[18px] h-[18px] text-[#5e5ce6]" />
            </div>
            <div>
              <h3 className="text-[15px] font-semibold text-[var(--tx)]">Daily Notes</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <CalendarDays className="w-3 h-3 text-[var(--tx3)] tap-sm" />
                <span className="text-[12px] text-[var(--tx3)]">{dateFormatted}</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg bg-[var(--elev)] flex items-center justify-center text-[var(--tx3)] hover:text-[var(--tx)] hover:bg-[var(--tert)] transition tap-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 sm:px-6 py-5 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto">
          <p className="text-[14px] text-[var(--tx2)] leading-relaxed whitespace-pre-wrap">
            {metric.notes}
          </p>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-4 border-t border-[var(--bd2)] flex justify-end pb-6 sm:pb-4">
          <button
            onClick={handleClose}
            className="rounded-xl bg-[var(--elev)] hover:bg-[var(--tert)] px-5 py-2.5 text-[13px] font-medium text-[var(--tx)] transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Mobile Card View ── */
function MobileEntryCard({
  metric,
  onViewNote,
}: {
  metric: DailyMetric;
  onViewNote: () => void;
}) {
  return (
    <div className="rounded-xl bg-[var(--card)] p-4 space-y-3">
      {/* Top row: Date + Burnout badge */}
      <div className="flex items-center justify-between">
        <span className="text-[14px] font-semibold text-[var(--tx)]">
          {new Date(metric.date).toLocaleDateString('en', {
            month: 'short',
            day: 'numeric',
            weekday: 'short',
          })}
        </span>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${
            metric.burnout_risk === 'High'
              ? 'bg-[#ff453a]/10 text-[#ff453a]'
              : metric.burnout_risk === 'Medium'
              ? 'bg-[#ff9f0a]/10 text-[#ff9f0a]'
              : 'bg-[#30d158]/10 text-[#30d158]'
          }`}
        >
          {metric.burnout_risk}
        </span>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'Sleep', value: `${metric.sleep_hours}h`, color: 'text-[#5e5ce6]' },
          { label: 'Stress', value: metric.stress, color: 'text-[#ff453a]' },
          { label: 'Energy', value: metric.energy, color: 'text-[#ff9f0a]' },
          { label: 'Focus', value: metric.focus, color: 'text-[#0a84ff]' },
        ].map(({ label, value, color }) => (
          <div key={label} className="text-center py-2 rounded-lg bg-[var(--elev)]/50">
            <p className={`text-[16px] font-bold tabular-nums ${color}`}>{value}</p>
            <p className="text-[10px] text-[var(--tx3)] mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Calm score + stress bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[var(--tx3)]">Calm</span>
          <span className="text-[14px] font-bold text-[#30d158] tabular-nums">{metric.calm_score}</span>
        </div>
        <div className="flex items-center gap-2 flex-1 max-w-[120px] ml-4">
          <div className="w-full h-[4px] rounded-full bg-[var(--elev)] overflow-hidden">
            <div
              className={`h-full rounded-full ${
                metric.stress > 7
                  ? 'bg-[#ff453a]'
                  : metric.stress > 5
                  ? 'bg-[#ff9f0a]'
                  : 'bg-[#30d158]'
              }`}
              style={{ width: `${metric.stress * 10}%` }}
            />
          </div>
          <span className="text-[11px] text-[var(--tx3)] tabular-nums">{metric.stress}</span>
        </div>
      </div>

      {/* Notes preview */}
      {metric.notes && (
        <div className="flex items-center justify-between pt-1 border-t border-[var(--bd2)]">
          <p className="text-[12px] text-[var(--tx2)] truncate flex-1 mr-3">
            {metric.notes.length > 50 ? metric.notes.slice(0, 50) + '…' : metric.notes}
          </p>
          <button
            onClick={onViewNote}
            className="shrink-0 text-[12px] font-medium text-[#0a84ff] hover:text-[#0a84ff]/80 transition px-2 py-1 rounded-lg hover:bg-[#0a84ff]/10 tap-sm"
          >
            View
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Recent Entries ── */
interface RecentEntriesProps {
  entries: DailyMetric[];
  count?: number;
}

export default function RecentEntries({ entries, count = 10 }: RecentEntriesProps) {
  
  const [modalMetric, setModalMetric] = useState<DailyMetric | null>(null);

  const display = [...entries]
  .filter((e) => e.date && !isNaN(new Date(e.date).getTime()))
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, count);
  
  return (
    <>
      {/* Header */}
      <div className="rounded-2xl bg-[var(--card)] overflow-hidden">
        <div className="px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between">
          <div>
            <h3 className="text-[14px] sm:text-[15px] font-semibold text-[var(--tx)]">Recent Entries</h3>
            <p className="text-[12px] sm:text-[13px] text-[var(--tx3)] mt-0.5 sm:mt-1">Latest recorded metrics</p>
          </div>
          <span className="text-[11px] sm:text-[12px] text-[var(--tx3)] bg-[var(--elev)] rounded-full px-2.5 sm:px-3 py-1">
            {count} most recent
          </span>
        </div>

        {/* Mobile: Card layout */}
        <div className="sm:hidden px-4 pb-4 space-y-3">
          {display.map((m) => (
            <MobileEntryCard
              key={m.id}
              metric={m}
              onViewNote={() => setModalMetric(m)}
            />
          ))}
        </div>

        {/* Desktop: Table layout */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[12px] text-[var(--tx3)] border-t border-[var(--bd2)]">
                <th className="px-4 lg:px-6 py-3 font-medium">Date</th>
                <th className="px-4 lg:px-6 py-3 font-medium">Sleep</th>
                <th className="px-4 lg:px-6 py-3 font-medium">Stress</th>
                <th className="px-4 lg:px-6 py-3 font-medium hidden md:table-cell">Energy</th>
                <th className="px-4 lg:px-6 py-3 font-medium hidden md:table-cell">Focus</th>
                <th className="px-4 lg:px-6 py-3 font-medium">Calm</th>
                <th className="px-4 lg:px-6 py-3 font-medium">Burnout</th>
                <th className="px-4 lg:px-6 py-3 font-medium hidden lg:table-cell">Notes</th>
              </tr>
            </thead>
            <tbody>
              {display.map((m) => {
                const truncatedNote = m.notes
                  ? m.notes.length > 60
                    ? m.notes.slice(0, 60) + '…'
                    : m.notes
                  : null;

                return (
                  <tr
                    key={m.id}
                    className="border-t border-[var(--bd2)] hover:bg-[var(--elev)]/30 transition-colors"
                  >
                    <td className="px-4 lg:px-6 py-3.5 text-[var(--tx)] font-medium text-[13px]">
                      {new Date(m.date).toLocaleDateString('en', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-4 lg:px-6 py-3.5 text-[var(--tx2)] text-[13px] tabular-nums">
                      {m.sleep_hours}h
                    </td>
                    <td className="px-4 lg:px-6 py-3.5">
                      <div className="flex items-center gap-2 lg:gap-3">
                        <div className="w-12 lg:w-16 h-[5px] rounded-full bg-[var(--elev)] overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              m.stress > 7
                                ? 'bg-[#ff453a]'
                                : m.stress > 5
                                ? 'bg-[#ff9f0a]'
                                : 'bg-[#30d158]'
                            }`}
                            style={{ width: `${m.stress * 10}%` }}
                          />
                        </div>
                        <span className="text-[13px] text-[var(--tx2)] tabular-nums w-4">
                          {m.stress}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-3.5 text-[var(--tx2)] text-[13px] tabular-nums hidden md:table-cell">
                      {m.energy}
                    </td>
                    <td className="px-4 lg:px-6 py-3.5 text-[var(--tx2)] text-[13px] tabular-nums hidden md:table-cell">
                      {m.focus}
                    </td>
                    <td className="px-4 lg:px-6 py-3.5">
                      <span className="text-[13px] font-semibold text-[#30d158] tabular-nums">
                        {m.calm_score}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-3.5">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${
                          m.burnout_risk === 'High'
                            ? 'bg-[#ff453a]/10 text-[#ff453a]'
                            : m.burnout_risk === 'Medium'
                            ? 'bg-[#ff9f0a]/10 text-[#ff9f0a]'
                            : 'bg-[#30d158]/10 text-[#30d158]'
                        }`}
                      >
                        {m.burnout_risk}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-3.5 hidden lg:table-cell">
                      {truncatedNote ? (
                        <div className="flex items-center gap-2 max-w-[240px]">
                          <span className="text-[13px] text-[var(--tx2)] truncate flex-1">
                            {truncatedNote}
                          </span>
                          {m.notes && m.notes.length > 0 && (
                            <button
                              onClick={() => setModalMetric(m)}
                              className="shrink-0 text-[12px] font-medium text-[#0a84ff] hover:text-[#0a84ff]/80 transition px-2 py-1 rounded-lg hover:bg-[#0a84ff]/10 tap-sm"
                            >
                              View
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-[13px] text-[var(--tx3)]">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalMetric && (
        <NoteModal
          metric={modalMetric}
          onClose={() => setModalMetric(null)}
        />
      )}
    </>
  );
}
