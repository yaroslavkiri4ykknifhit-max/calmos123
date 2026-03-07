// ============================================================
// MindMetrics — Computed Field Formulas
// ============================================================
//
// These pure functions calculate the two derived metrics that
// are stored alongside each daily entry.
//
// 1. calm_score  = energy_level + focus_level − stress_level
//    Range: theoretically −8 to +19  (with 1–10 inputs → −8 to 19)
//    A higher score means a calmer, more productive day.
//
// 2. burnout_risk
//    stress_level > 7  → "High"
//    stress_level > 5  → "Medium"
//    else              → "Low"
// ============================================================

import type { BurnoutRisk } from '@/types/database';

/**
 * Calculate the calm score from the three input metrics.
 *
 * Formula: energy_level + focus_level − stress_level
 */
export function calcCalmScore(
  energyLevel: number,
  focusLevel: number,
  stressLevel: number
): number {
  return energyLevel + focusLevel - stressLevel;
}

/**
 * Determine the burnout risk category based on stress level.
 *
 * - stress > 7  → High
 * - stress > 5  → Medium
 * - otherwise   → Low
 */
export function calcBurnoutRisk(stressLevel: number): BurnoutRisk {
  if (stressLevel > 7) return 'High';
  if (stressLevel > 5) return 'Medium';
  return 'Low';
}
