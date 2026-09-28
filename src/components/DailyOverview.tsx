import React from 'react';
import {
  DailyGoalTargets,
  DailyLog,
  Meal,
  UserProfile,
  Workout,
} from '../types/fitness';
import { ProgressRing } from './ProgressRing';
import {
  Flame,
  Footprints,
  Clock,
  Droplet,
  Play,
  Plus,
  Utensils,
  Scale,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { formatFriendlyDate, getPastNDays, getTodayDateString } from '../utils/fitnessCalculators';
import { fireGoalCelebration } from '../utils/confetti';

interface DailyOverviewProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  targets: DailyGoalTargets;
  currentLog: DailyLog;
  workouts: Workout[];
  meals: Meal[];
  profile: UserProfile;
  streak: number;
  onUpdateDailyLog: (updated: Partial<DailyLog>) => void;
  onOpenLiveWorkout: () => void;
  onOpenLogWorkout: () => void;
  onOpenLogMeal: () => void;
  onOpenLogWeight: () => void;
  onOpenGoalsModal: () => void;
}

export const DailyOverview: React.FC<DailyOverviewProps> = ({
  selectedDate,
  onSelectDate,
  targets,
  currentLog,
  workouts,
  meals,
  profile,
  streak,
  onUpdateDailyLog,
  onOpenLiveWorkout,
  onOpenLogWorkout,
  onOpenLogMeal,
  onOpenLogWeight,
  onOpenGoalsModal,
}) => {
  const today = getTodayDateString();
  const pastDays = getPastNDays(7);

  // Compute total calories burned today from logged workouts
  const workoutsForDate = workouts.filter((w) => w.date === selectedDate);
  const workoutCalories = workoutsForDate.reduce((sum, w) => sum + w.caloriesBurned, 0);
  const workoutMinutes = workoutsForDate.reduce((sum, w) => sum + w.durationMinutes, 0);

  // Calories from daily log or workouts (take whichever is higher or combined)
  const totalCaloriesBurned = workoutCalories;
  const totalActiveMinutes = Math.max(currentLog.activeMinutes, workoutMinutes);
  const totalSteps = currentLog.steps;
  const totalWater = currentLog.waterMl;

  // Meal calories consumed
  const mealsForDate = meals.filter((m) => m.date === selectedDate);
  const totalCaloriesConsumed = mealsForDate.reduce((sum, m) => sum + m.calories, 0);

  // Goal percentages
  const caloriesPercent = Math.round((totalCaloriesBurned / targets.calories) * 100);
  const stepsPercent = Math.round((totalSteps / targets.steps) * 100);
  const minutesPercent = Math.round((totalActiveMinutes / targets.activeMinutes) * 100);
  const waterPercent = Math.round((totalWater / targets.waterMl) * 100);

  // Overall day completion
  const averageCompletion = Math.round(
    (Math.min(100, caloriesPercent) +
      Math.min(100, stepsPercent) +
      Math.min(100, minutesPercent) +
      Math.min(100, waterPercent)) /
      4
  );

  const handleQuickAddWater = (ml: number) => {
    const newWater = totalWater + ml;
    onUpdateDailyLog({ waterMl: newWater });
    if (newWater >= targets.waterMl && totalWater < targets.waterMl) {
      fireGoalCelebration();
    }
  };

  const handleQuickAddSteps = (count: number) => {
    const newSteps = totalSteps + count;
    onUpdateDailyLog({ steps: newSteps });
    if (newSteps >= targets.steps && totalSteps < targets.steps) {
      fireGoalCelebration();
    }
  };

  return (
    <div className="space-y-6">
      {/* Date Carousel & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {pastDays.map((dateStr) => {
            const isSelected = dateStr === selectedDate;
            const isCurrentToday = dateStr === today;
            const label = formatFriendlyDate(dateStr);
            const [year, month, day] = dateStr.split('-');
            const dayNum = Number(day);

            return (
              <button
                key={dateStr}
                onClick={() => onSelectDate(dateStr)}
                className={`flex flex-col items-center justify-center min-w-[58px] py-2 px-2.5 rounded-lg border transition-all text-xs ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 font-semibold border-emerald-400 shadow-sm'
                    : 'bg-slate-950/60 text-slate-300 border-slate-800/80 hover:border-slate-700 hover:text-white'
                }`}
              >
                <span className={`text-[10px] ${isSelected ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                  {isCurrentToday ? 'TODAY' : label.slice(0, 3).toUpperCase()}
                </span>
                <span className="text-base font-bold font-mono tabular-nums leading-tight mt-0.5">
                  {dayNum}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium text-slate-200">{formatFriendlyDate(selectedDate)}</span>
          </div>

          <div className="flex items-center gap-1">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => e.target.value && onSelectDate(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-md px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Hero Motivation & Overall Completion Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-8">
        {/* Background photo preview with measured gradient scrim */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <img
            src="/src/assets/images/fitness_hero_athlete_1790611980200.jpg"
            alt="Fitness background"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span>{streak}-DAY STREAK ACTIVE</span>
              <span aria-hidden="true">·</span>
              <span>CYCLE GOAL: {profile.primaryFocus.replace('_', ' ').toUpperCase()}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight text-balance">
              {averageCompletion >= 100
                ? "Incredible work! You've crushed all daily targets."
                : averageCompletion >= 70
                ? 'Strong momentum! You are close to hitting every goal today.'
                : 'Stay consistent. Every step and rep brings you closer to your goal.'}
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Logged {workoutsForDate.length} workout{workoutsForDate.length !== 1 ? 's' : ''} ·{' '}
              <span className="font-mono tabular-nums text-white font-semibold">{totalCaloriesBurned}</span> kcal burned ·{' '}
              <span className="font-mono tabular-nums text-white font-semibold">{totalSteps.toLocaleString()}</span> steps taken today.
            </p>
          </div>

          {/* Aggregate Completion Radial Ring */}
          <div className="flex items-center gap-5 p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 shrink-0 backdrop-blur-sm">
            <ProgressRing
              progress={averageCompletion}
              size={92}
              strokeWidth={9}
              color={averageCompletion >= 100 ? '#10b981' : '#38bdf8'}
              backgroundColor="rgba(255, 255, 255, 0.08)"
            >
              <span className="font-mono text-lg font-bold text-white tabular-nums">
                {averageCompletion}%
              </span>
            </ProgressRing>

            <div className="space-y-1">
              <span className="text-xs uppercase font-mono tracking-wider text-slate-400 block">
                Daily Goal Score
              </span>
              <div className="text-sm font-semibold text-white">
                {averageCompletion >= 100 ? (
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" /> All Targets Met
                  </span>
                ) : (
                  <span>{4 - [caloriesPercent >= 100, stepsPercent >= 100, minutesPercent >= 100, waterPercent >= 100].filter(Boolean).length} targets remaining</span>
                )}
              </div>
              <button
                onClick={onOpenGoalsModal}
                className="text-xs text-emerald-400 hover:text-emerald-300 hover:underline pt-0.5 inline-block text-left"
              >
                Customize targets →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Daily Goal Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Calories Burned Card */}
        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium">
                <Flame className="w-4 h-4 fill-rose-500/20 text-rose-400" />
                <span>Active Calories</span>
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-mono text-white tabular-nums">
                  {totalCaloriesBurned}
                </span>
                <span className="text-xs font-mono text-slate-400 tabular-nums">
                  / {targets.calories} kcal
                </span>
              </div>
            </div>
            <ProgressRing
              progress={caloriesPercent}
              size={54}
              strokeWidth={6}
              color="#f43f5e"
            >
              <span className="text-[11px] font-mono font-bold text-slate-200 tabular-nums">
                {caloriesPercent}%
              </span>
            </ProgressRing>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>{totalCaloriesBurned >= targets.calories ? 'Goal achieved!' : `${targets.calories - totalCaloriesBurned} kcal remaining`}</span>
            <button
              onClick={onOpenLogWorkout}
              className="text-emerald-400 hover:text-emerald-300 font-medium"
            >
              + Add
            </button>
          </div>
        </div>

        {/* 2. Steps Count Card */}
        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <Footprints className="w-4 h-4 text-emerald-400" />
                <span>Daily Steps</span>
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-mono text-white tabular-nums">
                  {totalSteps.toLocaleString()}
                </span>
                <span className="text-xs font-mono text-slate-400 tabular-nums">
                  / {targets.steps.toLocaleString()}
                </span>
              </div>
            </div>
            <ProgressRing
              progress={stepsPercent}
              size={54}
              strokeWidth={6}
              color="#10b981"
            >
              <span className="text-[11px] font-mono font-bold text-slate-200 tabular-nums">
                {stepsPercent}%
              </span>
            </ProgressRing>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400">Quick add:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleQuickAddSteps(500)}
                className="px-2 py-0.5 text-[11px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors"
                title="Add 500 steps"
              >
                +500
              </button>
              <button
                onClick={() => handleQuickAddSteps(1000)}
                className="px-2 py-0.5 text-[11px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors"
                title="Add 1,000 steps"
              >
                +1k
              </button>
            </div>
          </div>
        </div>

        {/* 3. Active Minutes Card */}
        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Exercise Minutes</span>
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-mono text-white tabular-nums">
                  {totalActiveMinutes}
                </span>
                <span className="text-xs font-mono text-slate-400 tabular-nums">
                  / {targets.activeMinutes} min
                </span>
              </div>
            </div>
            <ProgressRing
              progress={minutesPercent}
              size={54}
              strokeWidth={6}
              color="#f59e0b"
            >
              <span className="text-[11px] font-mono font-bold text-slate-200 tabular-nums">
                {minutesPercent}%
              </span>
            </ProgressRing>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>{totalActiveMinutes >= targets.activeMinutes ? 'Target crushed!' : `${targets.activeMinutes - totalActiveMinutes}m to go`}</span>
            <button
              onClick={onOpenLiveWorkout}
              className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
            >
              <Play className="w-3 h-3 fill-amber-400" /> Start
            </button>
          </div>
        </div>

        {/* 4. Hydration Water Card */}
        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-medium">
                <Droplet className="w-4 h-4 fill-cyan-400/20 text-cyan-400" />
                <span>Hydration</span>
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-mono text-white tabular-nums">
                  {totalWater}
                </span>
                <span className="text-xs font-mono text-slate-400 tabular-nums">
                  / {targets.waterMl} ml
                </span>
              </div>
            </div>
            <ProgressRing
              progress={waterPercent}
              size={54}
              strokeWidth={6}
              color="#06b6d4"
            >
              <span className="text-[11px] font-mono font-bold text-slate-200 tabular-nums">
                {waterPercent}%
              </span>
            </ProgressRing>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400">Drink:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleQuickAddWater(250)}
                className="px-2 py-0.5 text-[11px] font-mono bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded transition-colors"
                title="Log 250ml glass"
              >
                +250ml
              </button>
              <button
                onClick={() => handleQuickAddWater(500)}
                className="px-2 py-0.5 text-[11px] font-mono bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded transition-colors"
                title="Log 500ml bottle"
              >
                +500ml
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Dock */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={onOpenLiveWorkout}
          className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/50 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 transition-all text-left group"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20">
            <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
          </div>
          <div>
            <div className="text-xs font-semibold text-white group-hover:text-emerald-400 transition-colors">
              Live Workout
            </div>
            <div className="text-[11px] text-slate-400">Real-time stopwatch</div>
          </div>
        </button>

        <button
          onClick={onOpenLogWorkout}
          className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/50 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 transition-all text-left group"
        >
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 group-hover:bg-cyan-500/20">
            <Plus className="w-4 h-4 text-cyan-400 stroke-[2.5]" />
          </div>
          <div>
            <div className="text-xs font-semibold text-white group-hover:text-cyan-400 transition-colors">
              Log Workout
            </div>
            <div className="text-[11px] text-slate-400">Cardio or strength</div>
          </div>
        </button>

        <button
          onClick={onOpenLogMeal}
          className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/50 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 transition-all text-left group"
        >
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 group-hover:bg-amber-500/20">
            <Utensils className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-xs font-semibold text-white group-hover:text-amber-400 transition-colors">
              Log Nutrition
            </div>
            <div className="text-[11px] text-slate-400">{totalCaloriesConsumed} kcal logged</div>
          </div>
        </button>

        <button
          onClick={onOpenLogWeight}
          className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/50 hover:bg-slate-850 border border-slate-800 hover:border-purple-500/50 transition-all text-left group"
        >
          <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0 group-hover:bg-purple-500/20">
            <Scale className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <div className="text-xs font-semibold text-white group-hover:text-purple-400 transition-colors">
              Body Check-in
            </div>
            <div className="text-[11px] text-slate-400">Weight & measurements</div>
          </div>
        </button>
      </div>

      {/* Today's Logged Workouts & Activities Feed */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-white">Activities for {formatFriendlyDate(selectedDate)}</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {workoutsForDate.length} recorded session{workoutsForDate.length !== 1 ? 's' : ''} on this date
            </p>
          </div>
          <button
            onClick={onOpenLogWorkout}
            className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Session</span>
          </button>
        </div>

        {workoutsForDate.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-800/80 text-slate-400 mx-auto flex items-center justify-center mb-3">
              <Clock className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-300">No workout recorded yet for this date</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Start a live workout timer or log a completed exercise session to fill your activity rings.
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={onOpenLiveWorkout}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
              >
                Start Live Timer
              </button>
              <button
                onClick={onOpenLogWorkout}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors"
              >
                Log Past Workout
              </button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60 mt-2">
            {workoutsForDate.map((workout) => (
              <div
                key={workout.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{workout.title}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="capitalize">{workout.activityType}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{workout.time}</span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">{workout.intensity} intensity</span>
                    {workout.distanceKm && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums text-slate-300">{workout.distanceKm} km</span>
                      </>
                    )}
                  </div>
                  {workout.notes && (
                    <p className="text-xs text-slate-400 italic pt-0.5 line-clamp-1">{workout.notes}</p>
                  )}
                </div>

                <div className="flex items-center gap-4 text-right shrink-0">
                  <div>
                    <div className="text-base font-bold font-mono text-emerald-400 tabular-nums">
                      {workout.caloriesBurned} kcal
                    </div>
                    <div className="text-xs font-mono text-slate-400 tabular-nums">
                      {workout.durationMinutes} min
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
