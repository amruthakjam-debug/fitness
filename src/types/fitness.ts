export type ActivityType =
  | 'running'
  | 'cycling'
  | 'swimming'
  | 'walking'
  | 'strength'
  | 'hiit'
  | 'yoga'
  | 'pilates'
  | 'boxing'
  | 'rowing';

export interface WorkoutExercise {
  name: string;
  sets: number;
  reps: number;
  weightKg?: number;
}

export interface Workout {
  id: string;
  date: string; // ISO YYYY-MM-DD
  time: string; // HH:MM
  activityType: ActivityType;
  title: string;
  durationMinutes: number;
  caloriesBurned: number;
  distanceKm?: number;
  intensity: 'light' | 'moderate' | 'vigorous' | 'maximum';
  avgHeartRate?: number;
  maxHeartRate?: number;
  notes?: string;
  exercises?: WorkoutExercise[];
}

export interface Meal {
  id: string;
  date: string; // YYYY-MM-DD
  time: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export interface WaterLog {
  id: string;
  date: string; // YYYY-MM-DD
  amountMl: number;
  timestamp: string;
}

export interface DailyGoalTargets {
  calories: number; // e.g., 600 kcal active
  steps: number; // e.g., 10000 steps
  activeMinutes: number; // e.g., 45 mins
  waterMl: number; // e.g., 2500 ml
  sleepHours?: number; // e.g., 8 hours
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  steps: number;
  activeMinutes: number;
  waterMl: number;
  sleepHours: number;
}

export interface BodyMeasurement {
  id: string;
  date: string; // YYYY-MM-DD
  weightKg: number;
  bodyFatPercent?: number;
  chestCm?: number;
  waistCm?: number;
  hipsCm?: number;
  notes?: string;
}

export interface UserProfile {
  name: string;
  gender: 'male' | 'female' | 'other';
  age: number;
  heightCm: number;
  startWeightKg: number;
  targetWeightKg: number;
  unitSystem: 'metric' | 'imperial';
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  primaryFocus: 'fat_loss' | 'muscle_gain' | 'endurance' | 'general_health';
  avatarUrl?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'streak' | 'workout' | 'steps' | 'water' | 'milestone';
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}
