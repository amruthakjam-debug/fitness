import { ActivityType } from '../types/fitness';

export const ACTIVITY_MET_VALUES: Record<ActivityType, { label: string; met: number; color: string; unit: string }> = {
  running: { label: 'Running', met: 9.8, color: '#38bdf8', unit: 'km' },
  strength: { label: 'Strength Training', met: 5.5, color: '#f97316', unit: 'sets' },
  cycling: { label: 'Cycling', met: 7.5, color: '#10b981', unit: 'km' },
  hiit: { label: 'HIIT & Circuit', met: 8.5, color: '#ef4444', unit: 'rounds' },
  swimming: { label: 'Swimming', met: 8.0, color: '#06b6d4', unit: 'm' },
  walking: { label: 'Brisk Walking', met: 3.8, color: '#84cc16', unit: 'km' },
  yoga: { label: 'Yoga & Flexibility', met: 3.0, color: '#a855f7', unit: 'poses' },
  pilates: { label: 'Pilates & Core', met: 3.5, color: '#ec4899', unit: 'reps' },
  boxing: { label: 'Boxing / Kickboxing', met: 9.0, color: '#f43f5e', unit: 'rounds' },
  rowing: { label: 'Rowing Machine', met: 7.0, color: '#6366f1', unit: 'm' },
};

/**
 * Calculates estimated active calories burned using standard ACSM MET equation:
 * Calories = Duration (min) * (MET * 3.5 * weight_kg) / 200
 */
export function estimateCaloriesBurned(
  activityType: ActivityType,
  durationMinutes: number,
  weightKg: number = 70,
  intensityModifier: 'light' | 'moderate' | 'vigorous' | 'maximum' = 'moderate'
): number {
  const baseMet = ACTIVITY_MET_VALUES[activityType]?.met || 5.0;
  const multipliers: Record<string, number> = {
    light: 0.85,
    moderate: 1.0,
    vigorous: 1.25,
    maximum: 1.45,
  };
  const effectiveMet = baseMet * (multipliers[intensityModifier] || 1.0);
  const calories = (durationMinutes * (effectiveMet * 3.5 * weightKg)) / 200;
  return Math.round(calories);
}

/**
 * BMI Calculator: Weight (kg) / Height (m)^2
 */
export function calculateBMI(weightKg: number, heightCm: number): { bmi: number; category: string; color: string } {
  if (heightCm <= 0 || weightKg <= 0) return { bmi: 0, category: 'N/A', color: 'text-slate-400' };
  const heightM = heightCm / 100;
  const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));

  if (bmi < 18.5) return { bmi, category: 'Underweight', color: 'text-amber-400' };
  if (bmi < 25) return { bmi, category: 'Normal Weight', color: 'text-emerald-400' };
  if (bmi < 30) return { bmi, category: 'Overweight', color: 'text-amber-400' };
  return { bmi, category: 'Obese', color: 'text-rose-400' };
}

/**
 * Unit conversions
 */
export function kgToLbs(kg: number): number {
  return Number((kg * 2.20462).toFixed(1));
}

export function lbsToKg(lbs: number): number {
  return Number((lbs / 2.20462).toFixed(1));
}

export function kmToMiles(km: number): number {
  return Number((km * 0.621371).toFixed(2));
}

export function milesToKm(miles: number): number {
  return Number((miles / 0.621371).toFixed(2));
}

export function mlToFlOz(ml: number): number {
  return Math.round(ml * 0.033814);
}

/**
 * Date formatting helpers
 */
export function getTodayDateString(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

export function formatFriendlyDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.round((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays === 1) return 'Tomorrow';

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function getPastNDays(n: number = 7): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}
