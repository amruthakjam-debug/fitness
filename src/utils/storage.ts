import {
  Achievement,
  BodyMeasurement,
  DailyGoalTargets,
  DailyLog,
  Meal,
  UserProfile,
  Workout,
} from '../types/fitness';
import { getPastNDays, getTodayDateString } from './fitnessCalculators';

const STORAGE_KEYS = {
  TARGETS: 'pulsetrack_targets_v1',
  PROFILE: 'pulsetrack_profile_v1',
  WORKOUTS: 'pulsetrack_workouts_v1',
  MEALS: 'pulsetrack_meals_v1',
  DAY_LOGS: 'pulsetrack_day_logs_v1',
  BODY_MEASUREMENTS: 'pulsetrack_body_measurements_v1',
};

export const DEFAULT_TARGETS: DailyGoalTargets = {
  calories: 600,
  steps: 10000,
  activeMinutes: 45,
  waterMl: 2800,
  sleepHours: 8,
};

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Alex Morgan',
  gender: 'female',
  age: 28,
  heightCm: 172,
  startWeightKg: 73.8,
  targetWeightKg: 68.0,
  unitSystem: 'metric',
  fitnessLevel: 'intermediate',
  primaryFocus: 'fat_loss',
  avatarUrl: '/src/assets/images/fitness_user_avatar_1790611996655.jpg',
};

export function getInitialState() {
  const pastDays = getPastNDays(14);
  const today = getTodayDateString();
  const yesterday = pastDays[pastDays.length - 2] || today;
  const twoDaysAgo = pastDays[pastDays.length - 3] || today;
  const threeDaysAgo = pastDays[pastDays.length - 4] || today;

  const defaultWorkouts: Workout[] = [
    {
      id: 'w-1',
      date: today,
      time: '07:15',
      activityType: 'running',
      title: 'Morning Lake Trail Run',
      durationMinutes: 38,
      caloriesBurned: 395,
      distanceKm: 5.6,
      intensity: 'vigorous',
      avgHeartRate: 152,
      maxHeartRate: 168,
      notes: 'Crisp morning air, maintained 6:45/km steady pace.',
    },
    {
      id: 'w-2',
      date: today,
      time: '12:30',
      activityType: 'strength',
      title: 'Upper Body & Core Hypertrophy',
      durationMinutes: 42,
      caloriesBurned: 240,
      intensity: 'moderate',
      avgHeartRate: 128,
      notes: 'Felt strong on dumbbell bench press. Added 2 reps per set.',
      exercises: [
        { name: 'Dumbbell Bench Press', sets: 4, reps: 10, weightKg: 18 },
        { name: 'Single Arm Dumbbell Row', sets: 3, reps: 12, weightKg: 16 },
        { name: 'Hanging Knee Raises', sets: 3, reps: 15 },
        { name: 'Push-ups', sets: 3, reps: 20 },
      ],
    },
    {
      id: 'w-3',
      date: yesterday,
      time: '18:00',
      activityType: 'hiit',
      title: 'Kettlebell Tabata Circuit',
      durationMinutes: 32,
      caloriesBurned: 320,
      intensity: 'maximum',
      avgHeartRate: 164,
      maxHeartRate: 179,
      notes: 'High intensity 40s work / 20s rest interval protocol.',
    },
    {
      id: 'w-4',
      date: twoDaysAgo,
      time: '08:00',
      activityType: 'cycling',
      title: 'Outdoor Tempo Ride',
      durationMinutes: 50,
      caloriesBurned: 440,
      distanceKm: 18.2,
      intensity: 'vigorous',
      avgHeartRate: 146,
    },
    {
      id: 'w-5',
      date: threeDaysAgo,
      time: '17:30',
      activityType: 'yoga',
      title: 'Mobility & Hip Flexor Flow',
      durationMinutes: 30,
      caloriesBurned: 110,
      intensity: 'light',
      avgHeartRate: 98,
      notes: 'Deep stretching and post-run recovery.',
    },
  ];

  const defaultMeals: Meal[] = [
    {
      id: 'm-1',
      date: today,
      time: '08:30',
      type: 'breakfast',
      name: 'Rolled Oats with Whey, Blueberries & Chia',
      calories: 420,
      proteinG: 34,
      carbsG: 52,
      fatG: 9,
    },
    {
      id: 'm-2',
      date: today,
      time: '13:15',
      type: 'lunch',
      name: 'Grilled Salmon Bowl with Quinoa & Steamed Greens',
      calories: 580,
      proteinG: 44,
      carbsG: 48,
      fatG: 22,
    },
    {
      id: 'm-3',
      date: today,
      time: '16:00',
      type: 'snack',
      name: 'Greek Yogurt with Handful of Raw Almonds',
      calories: 210,
      proteinG: 20,
      carbsG: 12,
      fatG: 10,
    },
  ];

  // Default day logs for past days to demonstrate real streaks and charts
  const defaultDayLogs: Record<string, DailyLog> = {};
  pastDays.forEach((date, index) => {
    // Generate organic-looking progressive numbers
    const isToday = date === today;
    const baseSteps = isToday ? 8420 : 9200 + Math.floor(Math.sin(index) * 2200);
    const baseMinutes = isToday ? 52 : 45 + Math.floor(Math.cos(index) * 15);
    const baseWater = isToday ? 2250 : 2500 + (index % 3) * 300;
    const baseSleep = 7.2 + (index % 4) * 0.3;

    defaultDayLogs[date] = {
      date,
      steps: Math.max(4500, baseSteps),
      activeMinutes: Math.max(25, baseMinutes),
      waterMl: baseWater,
      sleepHours: Number(baseSleep.toFixed(1)),
    };
  });

  const defaultBodyMeasurements: BodyMeasurement[] = [
    {
      id: 'bm-1',
      date: pastDays[0] || '2026-09-01',
      weightKg: 73.8,
      bodyFatPercent: 24.2,
      waistCm: 80,
      chestCm: 92,
      notes: 'Baseline check-in at start of cycle',
    },
    {
      id: 'bm-2',
      date: pastDays[4] || '2026-09-08',
      weightKg: 73.1,
      bodyFatPercent: 23.8,
      waistCm: 79.5,
      chestCm: 92,
    },
    {
      id: 'bm-3',
      date: pastDays[8] || '2026-09-15',
      weightKg: 72.4,
      bodyFatPercent: 23.4,
      waistCm: 78.5,
      chestCm: 91.5,
      notes: 'Feeling lighter on runs, waist down 1.5cm',
    },
    {
      id: 'bm-4',
      date: pastDays[12] || '2026-09-22',
      weightKg: 71.8,
      bodyFatPercent: 22.9,
      waistCm: 78.0,
      chestCm: 91.0,
    },
    {
      id: 'bm-5',
      date: today,
      weightKg: 71.3,
      bodyFatPercent: 22.5,
      waistCm: 77.2,
      chestCm: 91.0,
      notes: 'Total loss: 2.5 kg! Great strength retention.',
    },
  ];

  return {
    targets: DEFAULT_TARGETS,
    profile: DEFAULT_PROFILE,
    workouts: defaultWorkouts,
    meals: defaultMeals,
    dayLogs: defaultDayLogs,
    bodyMeasurements: defaultBodyMeasurements,
  };
}

export function loadSavedState() {
  try {
    const rawTargets = localStorage.getItem(STORAGE_KEYS.TARGETS);
    const rawProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
    const rawWorkouts = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
    const rawMeals = localStorage.getItem(STORAGE_KEYS.MEALS);
    const rawDayLogs = localStorage.getItem(STORAGE_KEYS.DAY_LOGS);
    const rawBodyMeasurements = localStorage.getItem(STORAGE_KEYS.BODY_MEASUREMENTS);

    const initial = getInitialState();

    return {
      targets: rawTargets ? JSON.parse(rawTargets) : initial.targets,
      profile: rawProfile ? JSON.parse(rawProfile) : initial.profile,
      workouts: rawWorkouts ? JSON.parse(rawWorkouts) : initial.workouts,
      meals: rawMeals ? JSON.parse(rawMeals) : initial.meals,
      dayLogs: rawDayLogs ? JSON.parse(rawDayLogs) : initial.dayLogs,
      bodyMeasurements: rawBodyMeasurements
        ? JSON.parse(rawBodyMeasurements)
        : initial.bodyMeasurements,
    };
  } catch (err) {
    console.error('Error loading saved fitness state:', err);
    return getInitialState();
  }
}

export function saveStateToStorage(state: {
  targets?: DailyGoalTargets;
  profile?: UserProfile;
  workouts?: Workout[];
  meals?: Meal[];
  dayLogs?: Record<string, DailyLog>;
  bodyMeasurements?: BodyMeasurement[];
}) {
  try {
    if (state.targets) localStorage.setItem(STORAGE_KEYS.TARGETS, JSON.stringify(state.targets));
    if (state.profile) localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(state.profile));
    if (state.workouts) localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(state.workouts));
    if (state.meals) localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(state.meals));
    if (state.dayLogs) localStorage.setItem(STORAGE_KEYS.DAY_LOGS, JSON.stringify(state.dayLogs));
    if (state.bodyMeasurements)
      localStorage.setItem(STORAGE_KEYS.BODY_MEASUREMENTS, JSON.stringify(state.bodyMeasurements));
  } catch (err) {
    console.error('Error saving fitness state:', err);
  }
}

/**
 * Calculates current active consecutive streak based on workouts or meeting daily targets
 */
export function calculateStreak(
  dayLogs: Record<string, DailyLog>,
  workouts: Workout[],
  targets: DailyGoalTargets
): { currentStreak: number; bestStreak: number } {
  const dates = Object.keys(dayLogs).sort();
  if (dates.length === 0) return { currentStreak: 1, bestStreak: 5 };

  let currentStreak = 0;
  let tempStreak = 0;
  let maxStreak = 0;

  // Check last 14 days in reverse order
  const today = getTodayDateString();
  const pastDays = getPastNDays(30);

  for (let i = pastDays.length - 1; i >= 0; i--) {
    const d = pastDays[i];
    const log = dayLogs[d];
    const hasWorkout = workouts.some((w) => w.date === d);
    const metGoal = log && (log.steps >= targets.steps * 0.75 || log.activeMinutes >= 30 || hasWorkout);

    if (metGoal) {
      tempStreak++;
      if (d === today || i === pastDays.length - 2) {
        currentStreak = tempStreak;
      }
      if (tempStreak > maxStreak) maxStreak = tempStreak;
    } else {
      if (d === today) {
        // If today is not yet met, don't break streak if yesterday was active
        continue;
      }
      tempStreak = 0;
    }
  }

  return {
    currentStreak: Math.max(1, currentStreak),
    bestStreak: Math.max(maxStreak, currentStreak, 6),
  };
}

/**
 * Computes live unlocked achievements
 */
export function computeAchievements(
  workouts: Workout[],
  dayLogs: Record<string, DailyLog>,
  bodyMeasurements: BodyMeasurement[],
  profile: UserProfile
): Achievement[] {
  const totalWorkouts = workouts.length;
  const totalCaloriesBurned = workouts.reduce((sum, w) => sum + w.caloriesBurned, 0);
  const totalSteps = Object.values(dayLogs).reduce((sum, l) => sum + (l.steps || 0), 0);
  const totalDistanceKm = workouts.reduce((sum, w) => sum + (w.distanceKm || 0), 0);

  const startWeight = profile.startWeightKg;
  const latestWeight =
    bodyMeasurements.length > 0 ? bodyMeasurements[bodyMeasurements.length - 1].weightKg : startWeight;
  const weightLost = Math.max(0, startWeight - latestWeight);

  return [
    {
      id: 'first_workout',
      title: 'Starting Line',
      description: 'Log your very first completed workout session.',
      category: 'workout',
      icon: 'zap',
      unlocked: totalWorkouts >= 1,
      progress: Math.min(1, totalWorkouts),
      maxProgress: 1,
    },
    {
      id: 'active_10',
      title: 'Consistency Engine',
      description: 'Complete 5 structured workout sessions.',
      category: 'workout',
      icon: 'activity',
      unlocked: totalWorkouts >= 5,
      progress: Math.min(5, totalWorkouts),
      maxProgress: 5,
    },
    {
      id: 'century_steps',
      title: 'Century Stepper',
      description: 'Accumulate over 50,000 recorded steps.',
      category: 'steps',
      icon: 'footprints',
      unlocked: totalSteps >= 50000,
      progress: Math.min(50000, totalSteps),
      maxProgress: 50000,
    },
    {
      id: 'calorie_torch',
      title: 'Furnace Mode',
      description: 'Burn 2,500 total calories through logged activities.',
      category: 'milestone',
      icon: 'flame',
      unlocked: totalCaloriesBurned >= 2500,
      progress: Math.min(2500, totalCaloriesBurned),
      maxProgress: 2500,
    },
    {
      id: 'endurance_runner',
      title: 'Road Champion',
      description: 'Log 25 km of total running, walking, or cycling distance.',
      category: 'milestone',
      icon: 'navigation',
      unlocked: totalDistanceKm >= 25,
      progress: Number(Math.min(25, totalDistanceKm).toFixed(1)),
      maxProgress: 25,
    },
    {
      id: 'scale_shifter',
      title: 'Body Transformer',
      description: 'Reach a 2.0 kg milestone toward your body composition goal.',
      category: 'milestone',
      icon: 'scale',
      unlocked: weightLost >= 2.0,
      progress: Number(Math.min(2.0, weightLost).toFixed(1)),
      maxProgress: 2.0,
    },
  ];
}
