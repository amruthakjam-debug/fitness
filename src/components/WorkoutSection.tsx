import React, { useState } from 'react';
import { ActivityType, Workout } from '../types/fitness';
import { ACTIVITY_MET_VALUES, formatFriendlyDate } from '../utils/fitnessCalculators';
import {
  Flame,
  Clock,
  Navigation,
  Heart,
  Plus,
  Play,
  Search,
  Trash2,
  Dumbbell,
  Zap,
} from 'lucide-react';

interface WorkoutSectionProps {
  workouts: Workout[];
  onOpenLogWorkout: () => void;
  onOpenLiveWorkout: () => void;
  onDeleteWorkout: (id: string) => void;
}

export const WorkoutSection: React.FC<WorkoutSectionProps> = ({
  workouts,
  onOpenLogWorkout,
  onOpenLiveWorkout,
  onDeleteWorkout,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Overall workout totals
  const totalWorkouts = workouts.length;
  const totalCalories = workouts.reduce((sum, w) => sum + w.caloriesBurned, 0);
  const totalMinutes = workouts.reduce((sum, w) => sum + w.durationMinutes, 0);
  const totalDistance = workouts.reduce((sum, w) => sum + (w.distanceKm || 0), 0);

  // Filtered workouts
  const filteredWorkouts = workouts.filter((workout) => {
    const matchesCategory =
      selectedCategory === 'all' || workout.activityType === selectedCategory;
    const matchesSearch =
      workout.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workout.activityType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (workout.notes && workout.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { id: 'all', label: 'All Activities' },
    { id: 'running', label: 'Running' },
    { id: 'strength', label: 'Strength' },
    { id: 'cycling', label: 'Cycling' },
    { id: 'hiit', label: 'HIIT' },
    { id: 'swimming', label: 'Swimming' },
    { id: 'walking', label: 'Walking' },
    { id: 'yoga', label: 'Yoga' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Stat Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400">Total Workouts</div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums mt-1">
            {totalWorkouts}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Logged sessions</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-rose-400">Burned Energy</div>
          <div className="text-2xl font-bold font-mono text-rose-400 tabular-nums mt-1">
            {totalCalories.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Total active kcal</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-amber-400">Time Under Tension</div>
          <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums mt-1">
            {(totalMinutes / 60).toFixed(1)}h
          </div>
          <div className="text-[11px] text-slate-500 mt-1">{totalMinutes} total minutes</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-cyan-400">Cardio Distance</div>
          <div className="text-2xl font-bold font-mono text-cyan-400 tabular-nums mt-1">
            {totalDistance.toFixed(1)} km
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Runs, rides & walks</div>
        </div>
      </div>

      {/* Featured Training Spotlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strength Card */}
        <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900 flex flex-col justify-between group">
          <div className="relative h-36 w-full overflow-hidden">
            <img
              src="/src/assets/images/workout_strength_card_1790612011172.jpg"
              alt="Strength training gear"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
            <div className="absolute bottom-3 left-4 text-xs font-mono text-amber-400">
              RESISTANCE & HYPERTROPHY
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <h3 className="text-base font-semibold text-white">Strength & Resistance Training</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Log exercises with sets, target reps, and weight. Track strength progression across dumbbell, barbell, and calisthenic movements.
              </p>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-400">
                {workouts.filter((w) => w.activityType === 'strength').length} sessions logged
              </span>
              <button
                onClick={onOpenLogWorkout}
                className="px-3 py-1.5 text-xs font-medium text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
              >
                Log Strength Workout
              </button>
            </div>
          </div>
        </div>

        {/* Cardio Card */}
        <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900 flex flex-col justify-between group">
          <div className="relative h-36 w-full overflow-hidden">
            <img
              src="/src/assets/images/workout_cardio_card_1790612026246.jpg"
              alt="Cardio running shoes and trail"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
            <div className="absolute bottom-3 left-4 text-xs font-mono text-emerald-400">
              CARDIOVASCULAR & ENDURANCE
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <h3 className="text-base font-semibold text-white">Endurance & Cardio Conditioning</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Use the real-time stopwatch to track live calorie burn and heart rate zones during outdoor runs, cycling, and tempo intervals.
              </p>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-400">
                {workouts.filter((w) => ['running', 'cycling', 'walking', 'swimming'].includes(w.activityType)).length} cardio sessions
              </span>
              <button
                onClick={onOpenLiveWorkout}
                className="px-3 py-1.5 text-xs font-medium text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                <span>Start Live Timer</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search exercises, notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button
            onClick={onOpenLogWorkout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Log</span>
          </button>
        </div>
      </div>

      {/* Workouts History List */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="text-sm font-semibold text-white">Workout Log ({filteredWorkouts.length})</div>
          <div className="text-xs text-slate-400">Sorted by most recent</div>
        </div>

        {filteredWorkouts.length === 0 ? (
          <div className="py-16 text-center">
            <Dumbbell className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-300">No matching workouts found</p>
            <p className="text-xs text-slate-500 mt-1">Try clearing your filters or record a new session.</p>
            <button
              onClick={onOpenLogWorkout}
              className="mt-4 px-4 py-2 text-xs font-medium text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
            >
              Log First Workout
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {filteredWorkouts.map((workout) => {
              const meta = ACTIVITY_MET_VALUES[workout.activityType] || {
                label: workout.activityType,
                color: '#10b981',
              };

              return (
                <div
                  key={workout.id}
                  className="p-4 sm:p-5 hover:bg-slate-850/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-base font-semibold text-white">{workout.title}</span>
                    </div>

                    {/* Zero-pill unboxed metadata */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      <span className="text-slate-300">{formatFriendlyDate(workout.date)}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{workout.time}</span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize">{meta.label}</span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize">{workout.intensity}</span>
                      {workout.distanceKm && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums text-slate-300">{workout.distanceKm} km</span>
                        </>
                      )}
                      {workout.avgHeartRate && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums text-rose-400 flex items-center gap-0.5">
                            <Heart className="w-3 h-3 fill-rose-500/30" />
                            {workout.avgHeartRate} bpm
                          </span>
                        </>
                      )}
                    </div>

                    {workout.notes && (
                      <p className="text-xs text-slate-300 italic pt-1">{workout.notes}</p>
                    )}

                    {workout.exercises && workout.exercises.length > 0 && (
                      <div className="pt-2 flex flex-wrap gap-2 text-xs">
                        {workout.exercises.map((ex, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-950/80 border border-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px] font-mono tabular-nums"
                          >
                            {ex.name}: {ex.sets}x{ex.reps} {ex.weightKg ? `@ ${ex.weightKg}kg` : ''}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-5 shrink-0 border-t md:border-t-0 pt-2 md:pt-0 border-slate-800/60">
                    <div className="text-left md:text-right">
                      <div className="text-lg font-bold font-mono text-emerald-400 tabular-nums">
                        {workout.caloriesBurned} kcal
                      </div>
                      <div className="text-xs font-mono text-slate-400 tabular-nums">
                        {workout.durationMinutes} min
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteWorkout(workout.id)}
                      className="p-2 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                      title="Delete workout entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
