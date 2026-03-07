import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { DailyMetric, DailyMetricInsert } from '@/types/database';
import { calcCalmScore, calcBurnoutRisk } from '@/utils/formulas';

interface MetricsContextValue {
  metrics: DailyMetric[];
  addMetric: (entry: DailyMetricInsert) => void;
}

const MetricsContext = createContext<MetricsContextValue | undefined>(undefined);

// Deterministic pseudo-random using a seed so heatmap is stable
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

const SAMPLE_NOTES = [
  'Had a great morning run. Felt energized throughout the day.',
  'Work was stressful today but meditation helped me calm down in the evening. Need to prioritize breaks more.',
  'Couldn\'t sleep well last night. Too much coffee in the afternoon — need to cut back after 2pm.',
  'Deep focus session in the morning was very productive. Finished the design review ahead of schedule.',
  'Feeling burnt out after back-to-back meetings. Need to block more heads-down time on the calendar.',
  'Started the day with journaling and it made a noticeable difference in my focus levels.',
  'Skipped lunch because of a deadline — bad idea. Energy crashed hard in the afternoon.',
  'Weekend hike really helped reset my stress levels. Nature is the best therapy.',
  'Tried a 20-minute power nap after lunch. Surprisingly effective for afternoon focus.',
  'Team conflict drained my energy. Need better boundaries at work.',
  'Great sleep last night. 8 full hours and I could feel the difference in everything today.',
  'Anxious about upcoming presentation. Practiced breathing exercises which helped somewhat.',
  'Rainy day — worked from the couch with tea. Very calm and productive session.',
  'Headache most of the day. Probably dehydration. Drank more water in the evening.',
  'Yoga class in the morning. Best stress levels I\'ve had all week.',
  '',
  '',
  '',
  '',
  '',
];

function seedData(userId: string): DailyMetric[] {
  const rand = seededRandom(42);
  const today = new Date();
  const days = 90;
  const entries: DailyMetric[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);

    // Skip ~15% of days randomly (to make heatmap realistic)
    if (rand() < 0.15 && i > 0) continue;

    // Create mild patterns: weekends slightly better, some bad weeks
    const dayOfWeek = d.getDay();
    const weekNum = Math.floor(i / 7);
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isBadWeek = weekNum === 3 || weekNum === 7 || weekNum === 10;

    const baseStress = isBadWeek ? 7 : isWeekend ? 3 : 5;
    const baseEnergy = isWeekend ? 7 : isBadWeek ? 4 : 6;
    const baseFocus = isWeekend ? 6 : isBadWeek ? 4 : 6;

    const stress = Math.max(1, Math.min(10, Math.round(baseStress + (rand() - 0.5) * 4)));
    const energy = Math.max(1, Math.min(10, Math.round(baseEnergy + (rand() - 0.5) * 4)));
    const focus = Math.max(1, Math.min(10, Math.round(baseFocus + (rand() - 0.5) * 4)));
    const sleep = +(Math.max(3, Math.min(10, (isWeekend ? 8 : 6.5) + (rand() - 0.5) * 3))).toFixed(1);

    // Assign a sample note to ~60% of entries
    const noteIndex = Math.floor(rand() * SAMPLE_NOTES.length);
    const notes = SAMPLE_NOTES[noteIndex] || undefined;

    entries.push({
      id: crypto.randomUUID(),
      user_id: userId,
      date: d.toISOString().slice(0, 10),
      sleep_hours: sleep,
      stress_level: stress,
      energy_level: energy,
      focus_level: focus,
      calm_score: calcCalmScore(energy, focus, stress),
      burnout_risk: calcBurnoutRisk(stress),
      notes,
      created_at: d.toISOString(),
    });
  }

  return entries;
}

export function MetricsProvider({ userId, children }: { userId: string; children: ReactNode }) {
  const [metrics, setMetrics] = useState<DailyMetric[]>(() => seedData(userId));

  const addMetric = useCallback(
    (entry: DailyMetricInsert) => {
      const calmScore = calcCalmScore(entry.energy_level, entry.focus_level, entry.stress_level);
      const burnoutRisk = calcBurnoutRisk(entry.stress_level);
      const newRow: DailyMetric = {
        id: crypto.randomUUID(),
        ...entry,
        calm_score: calmScore,
        burnout_risk: burnoutRisk,
        notes: entry.notes || undefined,
        created_at: new Date().toISOString(),
      };
      setMetrics((prev) => [...prev, newRow]);
    },
    []
  );

  return (
    <MetricsContext.Provider value={{ metrics, addMetric }}>
      {children}
    </MetricsContext.Provider>
  );
}

export function useMetrics(): MetricsContextValue {
  const ctx = useContext(MetricsContext);
  if (!ctx) throw new Error('useMetrics must be used inside <MetricsProvider>');
  return ctx;
}
