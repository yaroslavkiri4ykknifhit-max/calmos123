import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useMetrics } from "@/context/MetricsContext";
import { calcCalmScore, calcBurnoutRisk } from '@/utils/formulas';
import { supabase } from '@/lib/supabase';
import {
  Save,
  Wind,
  AlertTriangle,
  Moon,
  Flame,
  Zap,
  Target,
  CheckCircle,
  CalendarDays,
  FileText,
} from 'lucide-react';

function MetricSlider({
  label,
  value,
  onChange,
  min = 1,
  max = 10,
  step = 1,
  icon: Icon,
  iconColor,
  description,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  description?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <Icon className={`w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] shrink-0 ${iconColor}`} />
          <div className="min-w-0">
            <span className="text-[14px] sm:text-[15px] font-medium text-[var(--tx)]">{label}</span>
            {description && (
              <p className="text-[11px] sm:text-[12px] text-[var(--tx3)] mt-0.5 truncate">{description}</p>
            )}
          </div>
        </div>
        <div className="flex items-baseline gap-0.5 shrink-0">
          <span className="text-[22px] sm:text-[24px] font-bold text-[var(--tx)] tabular-nums tracking-[-0.02em]">
            {value}
          </span>
          <span className="text-[12px] sm:text-[13px] text-[var(--tx3)]">/{max}</span>
        </div>
      </div>

      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full relative z-10"
        />
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[4px] rounded-full bg-[var(--elev)] pointer-events-none">
          <div
            className="h-full rounded-full bg-[#0a84ff] no-transition"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function DailyEntry() {
  
  const { user } = useAuth();
  const { refreshMetrics } = useMetrics();

  const navigate = useNavigate();

  const todayStr = new Date().toISOString().slice(0, 10);

  const [date, setDate] = useState(todayStr);
  const [sleepHours, setSleepHours] = useState(7);
  const [stress, setStress] = useState(5);
  const [energy, setEnergy] = useState(6);
  const [focus, setFocus] = useState(6);
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  const calmPreview = calcCalmScore(energy, focus, stress);
  const burnoutPreview = calcBurnoutRisk(stress);
  
  
  const [existingDates, setExistingDates] = useState<string[]>([]);
  
  const existingEntry = existingDates.includes(date);
  
  useEffect(() => {

  if (!user) return;

  const fetchDates = async () => {
    const { data } = await supabase
    .from('metrics')
    .select('date')
    .eq('user_id', user?.id);

  if (!data) return;

  const dates = data.map(d => d.date);
    setExistingDates(dates);
  };

  fetchDates();
}, [user]);
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  if (!user) {
    console.error("No user found");
    return;
  }

  const { data, error } = await supabase
    .from('metrics')
    .insert([
    {
      user_id: user.id,
      date: date,
      stress: stress,
      energy: energy,
      calm: calmPreview,
      burnout: burnoutValue,
      notes: notes.trim() || null
    }
    ])
    .select();

  if (error) {
  console.error("SUPABASE ERROR:", error);
  alert(error.message);
  return;
}

  console.log("INSERT SUCCESS:", data);

  await refreshMetrics();
  
  setSaved(true);
  setTimeout(() => navigate("/dashboard"), 1200);
};

  if (saved) {
    return (
      <div className="max-w-2xl mx-auto flex flex-col items-center justify-center py-20 sm:py-28 text-center px-4">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#30d158]/15 flex items-center justify-center mb-5 sm:mb-6 animate-bounce">
          <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-[#30d158]" />
        </div>
        <h2 className="text-[20px] sm:text-[22px] font-bold text-[var(--tx)] tracking-[-0.02em] mb-2">Entry Saved</h2>
        <p className="text-[var(--tx2)] text-[14px] sm:text-[15px]">
          Metrics for{' '}
          {new Date(date).toLocaleDateString('en', { month: 'long', day: 'numeric' })} recorded.
        </p>
        <div className="flex gap-4 mt-4 text-[13px]">
          <span className="text-[#30d158] font-medium">Calm: {calmPreview}</span>
          <span className="text-[var(--tx3)]">·</span>
          <span
            className={`font-medium ${
              burnoutPreview === 'High'
                ? 'text-[#ff453a]'
                : burnoutPreview === 'Medium'
                ? 'text-[#ff9f0a]'
                : 'text-[#30d158]'
            }`}
          >
            Burnout: {burnoutPreview}
          </span>
        </div>
        {notes.trim() && (
          <p className="text-[var(--tx3)] text-[13px] mt-3 max-w-sm italic">
            "{notes.trim().slice(0, 80)}{notes.trim().length > 80 ? '…' : ''}"
          </p>
        )}
        <p className="text-[var(--tx3)] text-[13px] mt-6">Redirecting…</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 sm:space-y-5 lg:space-y-6">
      <div>
        <h1 className="text-[20px] sm:text-[22px] font-semibold text-[var(--tx)] tracking-[-0.02em]">Daily Entry</h1>
        <p className="text-[13px] sm:text-[14px] text-[var(--tx2)] mt-0.5 sm:mt-1">
          Record your mental performance for the day
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {/* Date Picker */}
        <div className="rounded-2xl bg-[var(--card)] p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <CalendarDays className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] text-[#0a84ff]" />
            <label className="text-[14px] sm:text-[15px] font-medium text-[var(--tx)]">Select Date</label>
          </div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border border-[var(--bd2)] bg-[var(--input-bg)] px-4 py-3 sm:py-3 text-[var(--tx)] focus:outline-none focus:border-[#0a84ff] focus:ring-1 focus:ring-[#0a84ff]/30 transition"
          />
          {existingEntry && (
            <p className="text-[12px] sm:text-[13px] text-[#ff9f0a] mt-2 sm:mt-3 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 tap-sm" />
              An entry already exists for this date.
            </p>
          )}
        </div>

        {/* Metric Sliders */}
        <div className="rounded-2xl bg-[var(--card)] p-4 sm:p-6 space-y-5 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[14px] sm:text-[15px] font-semibold text-[var(--tx)]">Your Metrics</h3>
            <span className="text-[11px] sm:text-[12px] text-[var(--tx3)]">Slide to adjust</span>
          </div>

          <MetricSlider
            label="Sleep Hours"
            description="How many hours did you sleep?"
            value={sleepHours}
            onChange={setSleepHours}
            min={0}
            max={12}
            step={0.5}
            icon={Moon}
            iconColor="text-[#5e5ce6]"
          />

          <div className="border-t border-[var(--bd2)]" />

          <MetricSlider
            label="Stress Level"
            description="1 = very relaxed, 10 = extremely stressed"
            value={stress}
            onChange={setStress}
            icon={Flame}
            iconColor="text-[#ff453a]"
          />

          <div className="border-t border-[var(--bd2)]" />

          <MetricSlider
            label="Energy Level"
            description="1 = exhausted, 10 = full of energy"
            value={energy}
            onChange={setEnergy}
            icon={Zap}
            iconColor="text-[#ff9f0a]"
          />

          <div className="border-t border-[var(--bd2)]" />

          <MetricSlider
            label="Focus Level"
            description="1 = very distracted, 10 = laser focused"
            value={focus}
            onChange={setFocus}
            icon={Target}
            iconColor="text-[#0a84ff]"
          />
        </div>

        {/* Notes */}
        <div className="rounded-2xl bg-[var(--card)] p-4 sm:p-6">
          <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
            <FileText className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] text-[#5e5ce6]" />
            <div>
              <label className="text-[14px] sm:text-[15px] font-medium text-[var(--tx)]">Notes</label>
              <p className="text-[11px] sm:text-[12px] text-[var(--tx3)] mt-0.5">Optional — jot down anything about your day</p>
            </div>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write anything about your day, mood, stress triggers, or reflections..."
            rows={4}
            className="w-full rounded-xl border border-[var(--bd2)] bg-[var(--input-bg)] px-4 py-3 text-[var(--tx)] placeholder:text-[var(--tx3)] focus:outline-none focus:border-[#0a84ff] focus:ring-1 focus:ring-[#0a84ff]/30 transition resize-none leading-relaxed"
          />
          <div className="flex justify-end mt-2">
            <span className="text-[11px] text-[var(--tx3)] tabular-nums">
              {notes.length} characters
            </span>
          </div>
        </div>

        {/* Live Preview */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="rounded-2xl bg-[var(--card)] p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-2.5 mb-3 sm:mb-4">
              <Wind className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] text-[#30d158]" />
              <span className="text-[12px] sm:text-[13px] text-[var(--tx2)] font-medium">Calm Score</span>
            </div>
            <p
              className={`text-[26px] sm:text-[32px] font-bold tabular-nums tracking-[-0.03em] ${
                calmPreview >= 8
                  ? 'text-[#30d158]'
                  : calmPreview >= 3
                  ? 'text-[#ff9f0a]'
                  : 'text-[#ff453a]'
              }`}
            >
              {calmPreview}
            </p>
            <p className="text-[11px] sm:text-[12px] text-[var(--tx3)] mt-1 sm:mt-2">energy + focus − stress</p>
          </div>

          <div className="rounded-2xl bg-[var(--card)] p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-2.5 mb-3 sm:mb-4">
              <AlertTriangle
                className={`w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] ${
                  burnoutPreview === 'High'
                    ? 'text-[#ff453a]'
                    : burnoutPreview === 'Medium'
                    ? 'text-[#ff9f0a]'
                    : 'text-[#30d158]'
                }`}
              />
              <span className="text-[12px] sm:text-[13px] text-[var(--tx2)] font-medium">Burnout Risk</span>
            </div>
            <p
              className={`text-[24px] sm:text-[32px] font-bold tracking-[-0.03em] ${
                burnoutPreview === 'High'
                  ? 'text-[#ff453a]'
                  : burnoutPreview === 'Medium'
                  ? 'text-[#ff9f0a]'
                  : 'text-[#30d158]'
              }`}
            >
              {burnoutPreview}
            </p>
            <p className="text-[11px] sm:text-[12px] text-[var(--tx3)] mt-1 sm:mt-2">based on stress level</p>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full rounded-xl bg-[#0a84ff] hover:bg-[#0a84ff]/90 py-3.5 sm:py-3.5 text-[15px] sm:text-[15px] font-semibold text-white transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <Save className="w-4 h-4 tap-sm" />
          Save Entry
        </button>
      </form>
    </div>
  );
}
