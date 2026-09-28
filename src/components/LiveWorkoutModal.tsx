import React, { useState, useEffect } from 'react';
import { ActivityType, Workout } from '../types/fitness';
import { ACTIVITY_MET_VALUES, getTodayDateString } from '../utils/fitnessCalculators';
import { X, Play, Pause, Square, Flame, Heart, RotateCcw } from 'lucide-react';
import { fireGoalCelebration } from '../utils/confetti';

interface LiveWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  userWeightKg: number;
  onFinishWorkout: (workout: Workout) => void;
}

export const LiveWorkoutModal: React.FC<LiveWorkoutModalProps> = ({
  isOpen,
  onClose,
  userWeightKg,
  onFinishWorkout,
}) => {
  const [activityType, setActivityType] = useState<ActivityType>('running');
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [intensity, setIntensity] = useState<'light' | 'moderate' | 'vigorous' | 'maximum'>('moderate');
  const [laps, setLaps] = useState<number[]>([]);

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  // Reset timer on open if closed
  useEffect(() => {
    if (!isOpen) {
      setIsActive(false);
      setSeconds(0);
      setLaps([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Real-time calorie calculation
  const met = ACTIVITY_MET_VALUES[activityType]?.met || 6.0;
  const intensityMultiplier =
    intensity === 'light' ? 0.85 : intensity === 'moderate' ? 1.0 : intensity === 'vigorous' ? 1.25 : 1.45;
  const activeCalories = Math.round(((seconds / 60) * (met * intensityMultiplier * 3.5 * userWeightKg)) / 200);

  // Simulated heart rate based on intensity & elapsed time
  const baseHr =
    intensity === 'light' ? 115 : intensity === 'moderate' ? 135 : intensity === 'vigorous' ? 155 : 172;
  const liveHeartRate = isActive
    ? Math.min(185, baseHr + Math.floor(Math.sin(seconds / 10) * 6))
    : baseHr - 15;

  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');
    if (hrs > 0) {
      return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  };

  const handleStartPause = () => {
    setIsActive(!isActive);
  };

  const handleAddLap = () => {
    setLaps([...laps, seconds]);
  };

  const handleFinish = () => {
    const durationMins = Math.max(1, Math.round(seconds / 60));
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

    const newWorkout: Workout = {
      id: `w-live-${Date.now()}`,
      date: getTodayDateString(),
      time: timeStr,
      activityType,
      title: `Live ${ACTIVITY_MET_VALUES[activityType]?.label} Session`,
      durationMinutes: durationMins,
      caloriesBurned: Math.max(15, activeCalories),
      intensity,
      avgHeartRate: liveHeartRate,
      notes: `Recorded with Live Tracker. Total duration: ${formatTime(seconds)}.`,
    };

    onFinishWorkout(newWorkout);
    fireGoalCelebration();
    onClose();
  };

  const activities: ActivityType[] = [
    'running',
    'hiit',
    'strength',
    'cycling',
    'boxing',
    'walking',
    'yoga',
    'rowing',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-rose-500 animate-ping' : 'bg-slate-500'}`} />
            <h3 className="text-base font-semibold text-white">Live Workout Tracker</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Activity selector */}
          <div>
            <span className="text-xs text-slate-400 block mb-2 font-mono uppercase tracking-wider">
              Sport Mode
            </span>
            <div className="grid grid-cols-4 gap-2">
              {activities.map((act) => (
                <button
                  key={act}
                  type="button"
                  onClick={() => setActivityType(act)}
                  className={`py-2 px-1 text-xs font-medium rounded-lg border transition-all capitalize text-center ${
                    activityType === act
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 font-semibold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {act}
                </button>
              ))}
            </div>
          </div>

          {/* Big Digital Stopwatch Timer */}
          <div className="text-center py-6 px-4 rounded-2xl bg-slate-950 border border-slate-800/80">
            <div className="text-xs font-mono tracking-widest text-slate-500 uppercase mb-1">
              Elapsed Time
            </div>
            <div className="text-5xl sm:text-6xl font-extrabold font-mono text-white tabular-nums tracking-wider">
              {formatTime(seconds)}
            </div>

            {/* Live Metrics */}
            <div className="mt-6 grid grid-cols-2 gap-4 pt-4 border-t border-slate-900">
              <div className="flex items-center justify-center gap-2">
                <Flame className="w-5 h-5 text-rose-500 fill-rose-500/20" />
                <div className="text-left">
                  <div className="text-lg font-bold font-mono text-rose-400 tabular-nums">
                    {activeCalories} <span className="text-xs font-normal text-slate-400">kcal</span>
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase">Live Burn</div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2">
                <Heart className={`w-5 h-5 text-rose-400 ${isActive ? 'animate-pulse' : ''}`} />
                <div className="text-left">
                  <div className="text-lg font-bold font-mono text-white tabular-nums">
                    {liveHeartRate} <span className="text-xs font-normal text-slate-400">bpm</span>
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase">Est. Heart Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Intensity selector */}
          <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span>Workout Intensity:</span>
            <div className="flex items-center gap-1">
              {(['light', 'moderate', 'vigorous', 'maximum'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setIntensity(lvl)}
                  className={`px-2 py-1 text-[11px] font-medium rounded capitalize transition-colors ${
                    intensity === lvl
                      ? 'bg-slate-800 text-white font-semibold'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Lap list if recorded */}
          {laps.length > 0 && (
            <div className="max-h-24 overflow-y-auto space-y-1 text-xs font-mono text-slate-400 border-t border-slate-800 pt-2">
              {laps.map((lapSec, i) => (
                <div key={i} className="flex justify-between px-2 py-0.5">
                  <span>Lap {i + 1}</span>
                  <span className="text-slate-200 tabular-nums">{formatTime(lapSec)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Stopwatch Action Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleStartPause}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-transform active:scale-[0.98] ${
                isActive
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  : 'bg-emerald-400 hover:bg-emerald-300 text-slate-950'
              }`}
            >
              {isActive ? (
                <>
                  <Pause className="w-4 h-4 fill-slate-950" /> Pause Timer
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-slate-950" /> {seconds === 0 ? 'Start Workout' : 'Resume'}
                </>
              )}
            </button>

            {isActive && (
              <button
                onClick={handleAddLap}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors"
                title="Mark interval / lap"
              >
                Lap
              </button>
            )}

            {seconds > 0 && (
              <button
                onClick={handleFinish}
                className="py-3 px-4 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-semibold text-sm flex items-center justify-center gap-1.5 transition-colors"
              >
                <Square className="w-4 h-4 fill-white" /> Finish & Save
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
