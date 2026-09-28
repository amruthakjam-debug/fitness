import React, { useState, useEffect } from 'react';
import { ActivityType, Workout, WorkoutExercise } from '../types/fitness';
import {
  ACTIVITY_MET_VALUES,
  estimateCaloriesBurned,
  getTodayDateString,
} from '../utils/fitnessCalculators';
import { X, Dumbbell, Plus, Trash2, Calculator, Sparkles } from 'lucide-react';
import { fireGoalCelebration } from '../utils/confetti';

interface LogWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  userWeightKg: number;
  initialDate?: string;
  onAddWorkout: (workout: Workout) => void;
}

export const LogWorkoutModal: React.FC<LogWorkoutModalProps> = ({
  isOpen,
  onClose,
  userWeightKg,
  initialDate,
  onAddWorkout,
}) => {
  const [activityType, setActivityType] = useState<ActivityType>('running');
  const [title, setTitle] = useState('Morning Outdoor Run');
  const [date, setDate] = useState(initialDate || getTodayDateString());
  const [time, setTime] = useState('08:00');
  const [durationMinutes, setDurationMinutes] = useState(35);
  const [intensity, setIntensity] = useState<'light' | 'moderate' | 'vigorous' | 'maximum'>('moderate');
  const [caloriesBurned, setCaloriesBurned] = useState(300);
  const [distanceKm, setDistanceKm] = useState<string>('5.0');
  const [avgHeartRate, setAvgHeartRate] = useState<string>('145');
  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);

  // Update auto-calculated calories when duration, activity, or intensity changes
  useEffect(() => {
    const estimated = estimateCaloriesBurned(
      activityType,
      durationMinutes,
      userWeightKg,
      intensity
    );
    setCaloriesBurned(estimated);
  }, [activityType, durationMinutes, intensity, userWeightKg]);

  // Update title suggestion when activity type changes
  const handleActivityChange = (newType: ActivityType) => {
    setActivityType(newType);
    const label = ACTIVITY_MET_VALUES[newType]?.label || newType;
    setTitle(`${label} Session`);
  };

  const handleAddExerciseRow = () => {
    setExercises([...exercises, { name: '', sets: 3, reps: 10, weightKg: 20 }]);
  };

  const handleUpdateExercise = (index: number, field: keyof WorkoutExercise, value: any) => {
    const next = [...exercises];
    next[index] = { ...next[index], [field]: value };
    setExercises(next);
  };

  const handleRemoveExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newWorkout: Workout = {
      id: `w-${Date.now()}`,
      date,
      time,
      activityType,
      title: title.trim() || `${ACTIVITY_MET_VALUES[activityType]?.label} Workout`,
      durationMinutes: Number(durationMinutes),
      caloriesBurned: Number(caloriesBurned),
      intensity,
      distanceKm: distanceKm ? Number(distanceKm) : undefined,
      avgHeartRate: avgHeartRate ? Number(avgHeartRate) : undefined,
      notes: notes.trim() || undefined,
      exercises: exercises.filter((ex) => ex.name.trim().length > 0),
    };

    onAddWorkout(newWorkout);
    fireGoalCelebration();
    onClose();
  };

  if (!isOpen) return null;

  const activities: ActivityType[] = [
    'running',
    'strength',
    'cycling',
    'hiit',
    'walking',
    'swimming',
    'yoga',
    'pilates',
    'boxing',
    'rowing',
  ];

  const isCardio = ['running', 'cycling', 'walking', 'swimming', 'rowing'].includes(activityType);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-semibold text-white">Log Workout Session</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[82vh] overflow-y-auto">
          {/* Activity Category Selection Grid */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
              Select Activity Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
              {activities.map((act) => (
                <button
                  key={act}
                  type="button"
                  onClick={() => handleActivityChange(act)}
                  className={`py-2 px-2 text-xs font-medium rounded-lg border transition-all text-center capitalize ${
                    activityType === act
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-semibold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {act}
                </button>
              ))}
            </div>
          </div>

          {/* Title & Timing */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs text-slate-300">Session Name</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                placeholder="e.g. 5k Trail Run"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-300">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Duration */}
            <div className="space-y-1">
              <label className="text-xs text-slate-300">Duration (min)</label>
              <input
                type="number"
                min="1"
                max="600"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            {/* Calories Burned */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Calories (kcal)</span>
              </div>
              <input
                type="number"
                min="0"
                max="5000"
                value={caloriesBurned}
                onChange={(e) => setCaloriesBurned(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-rose-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            {/* Intensity */}
            <div className="space-y-1">
              <label className="text-xs text-slate-300">Intensity</label>
              <select
                value={intensity}
                onChange={(e) => setIntensity(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 capitalize"
              >
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="vigorous">Vigorous</option>
                <option value="maximum">Maximum</option>
              </select>
            </div>

            {/* Date */}
            <div className="space-y-1">
              <label className="text-xs text-slate-300">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          {/* Conditional: Distance & Heart Rate */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-xs text-slate-300">
                {isCardio ? 'Distance (km)' : 'Distance / Output (Optional)'}
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={distanceKm}
                onChange={(e) => setDistanceKm(e.target.value)}
                placeholder="e.g. 5.2"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300">Avg Heart Rate (bpm)</label>
              <input
                type="number"
                min="40"
                max="220"
                value={avgHeartRate}
                onChange={(e) => setAvgHeartRate(e.target.value)}
                placeholder="e.g. 148"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Strength Exercises Builder (if strength activity or clicked) */}
          {(activityType === 'strength' || exercises.length > 0) && (
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">Logged Exercises & Sets</span>
                <button
                  type="button"
                  onClick={handleAddExerciseRow}
                  className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Exercise</span>
                </button>
              </div>

              {exercises.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-1">
                  No individual exercises added. Click "+ Add Exercise" to log sets, reps, and weights.
                </p>
              ) : (
                <div className="space-y-2">
                  {exercises.map((ex, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      <input
                        type="text"
                        placeholder="Exercise (e.g. Bench Press)"
                        value={ex.name}
                        onChange={(e) => handleUpdateExercise(index, 'name', e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-emerald-500 text-xs"
                      />
                      <input
                        type="number"
                        placeholder="Sets"
                        value={ex.sets}
                        onChange={(e) => handleUpdateExercise(index, 'sets', Number(e.target.value))}
                        className="w-14 bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-white font-mono text-center text-xs"
                      />
                      <input
                        type="number"
                        placeholder="Reps"
                        value={ex.reps}
                        onChange={(e) => handleUpdateExercise(index, 'reps', Number(e.target.value))}
                        className="w-14 bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-white font-mono text-center text-xs"
                      />
                      <input
                        type="number"
                        placeholder="kg"
                        value={ex.weightKg || ''}
                        onChange={(e) =>
                          handleUpdateExercise(index, 'weightKg', Number(e.target.value) || undefined)
                        }
                        className="w-16 bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-white font-mono text-center text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExercise(index)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-xs text-slate-300">Workout Notes & Reflections</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did you feel? Energy levels, soreness, personal records..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-sm"
            >
              Save Workout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
