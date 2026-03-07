// ============================================================
// MindMetrics — Database Types
// ============================================================
// This file defines the TypeScript types that mirror the
// Supabase `daily_metrics` table schema.
//
// TABLE: daily_metrics
// ┌────────────────┬───────────┬──────────────────────────────┐
// │ Column         │ Type      │ Description                  │
// ├────────────────┼───────────┼──────────────────────────────┤
// │ id             │ uuid (PK) │ Auto-generated primary key   │
// │ user_id        │ uuid (FK) │ References auth.users(id)    │
// │ date           │ date      │ Entry date (unique per user)  │
// │ sleep_hours    │ float     │ Hours of sleep (0–24)        │
// │ stress_level   │ int       │ Self-rated stress (1–10)     │
// │ energy_level   │ int       │ Self-rated energy (1–10)     │
// │ focus_level    │ int       │ Self-rated focus (1–10)      │
// │ calm_score     │ int       │ Computed: energy + focus − stress │
// │ burnout_risk   │ text      │ Computed: High / Medium / Low│
// │ created_at     │ timestamp │ Auto-generated timestamp     │
// └────────────────┴───────────┴──────────────────────────────┘
//
// RLS (Row Level Security) should be enabled so each user
// can only read/write their own rows:
//   policy: user_id = auth.uid()
// ============================================================

export type BurnoutRisk = 'Low' | 'Medium' | 'High';

/** Row shape returned from the `daily_metrics` table */
export interface DailyMetric {
  id: string;
  user_id: string;
  date: string;            // ISO date string  e.g. "2025-01-15"
  sleep_hours: number;     // 0 – 24
  stress_level: number;    // 1 – 10
  energy_level: number;    // 1 – 10
  focus_level: number;     // 1 – 10
  calm_score: number;      // computed
  burnout_risk: BurnoutRisk; // computed
  notes?: string;          // optional daily notes
  created_at: string;      // ISO timestamp
}

/** Shape used when inserting a new row (server fills id, calm_score, burnout_risk, created_at) */
export interface DailyMetricInsert {
  user_id: string;
  date: string;
  sleep_hours: number;
  stress_level: number;
  energy_level: number;
  focus_level: number;
  notes?: string;
}

/** Minimal user profile */
export interface UserProfile {
  id: string;
  email: string;
  created_at?: string;
}
