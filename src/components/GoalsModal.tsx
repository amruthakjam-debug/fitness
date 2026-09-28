import React, { useState } from 'react';
import { DailyGoalTargets } from '../types/fitness';
import { X, Target, Flame, Footprints, Clock, Droplet, Moon, Sparkles } from 'lucide-react';
import { fireGoalCelebration } from '../utils/confetti';

interface GoalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  targets: DailyGoalTargets;
  onSaveTargets: (newTargets: DailyGoalTargets) => void;
}

export const GoalsModal: React.FC<GoalsModalProps> = ({
  isOpen,
  onClose,
  targets,
  onSaveTargets,
}) => {
  const [calories, setCalories] = useState(targets.calories);
  const [steps, setSteps] = useState(targets.steps);
  const [activeMinutes, setActiveMinutes] = useState(targets.activeMinutes);
  const [waterMl, setWaterMl] = useState(targets.waterMl);
  const [sleepHours, setSleepHours] = useState(targets.sleepHours || 8);

  if (!isOpen) return null;

  const presets = [
    {
      name: 'Weight Loss & Deficit',
      description: 'Elevated caloric burn & step output for fat loss',
      values: { calories: 750, steps: 11000, activeMinutes: 50, waterMl: 3200, sleepHours: 8 },
    },
    {
      name: 'Strength & Hypertrophy',
      description: 'Focus on focused resistance volume & recovery',
      values: { calories: 550, steps: 8500, activeMinutes: 45, waterMl: 2800, sleepHours: 8.5 },
    },
    {
      name: 'Endurance & Cardio',
      description: 'High aerobic volume and rigorous hydration',
      values: { calories: 850, steps: 12500, activeMinutes: 60, waterMl: 3500, sleepHours: 8 },
    },
    {
      name: 'Health & Vitality',
      description: 'Balanced baseline for sustained longevity',
      values: { calories: 600, steps: 10000, activeMinutes: 45, waterMl: 2600, sleepHours: 7.5 },
    },
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    setCalories(preset.values.calories);
    setSteps(preset.values.steps);
    setActiveMinutes(preset.values.activeMinutes);
    setWaterMl(preset.values.waterMl);
    setSleepHours(preset.values.sleepHours);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveTargets({
      calories: Math.max(100, Number(calories)),
      steps: Math.max(1000, Number(steps)),
      activeMinutes: Math.max(10, Number(activeMinutes)),
      waterMl: Math.max(500, Number(waterMl)),
      sleepHours: Math.max(4, Number(sleepHours)),
    });
    fireGoalCelebration();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-semibold text-white">Customize Daily Goals</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Quick Presets */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Preset Archetypes
              </span>
              <span className="text-[11px] text-slate-500">Tap to populate</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="p-2.5 text-left rounded-lg bg-slate-950/60 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/40 transition-all text-xs group"
                >
                  <div className="font-semibold text-white group-hover:text-emerald-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{p.name}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">{p.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Goal Inputs */}
          <div className="space-y-4">
            {/* Calories */}
            <div className="space-y-1.5">
              <label className="flex items-center justify-between text-xs font-medium text-slate-300">
                <span className="flex items-center gap-1.5 text-rose-400">
                  <Flame className="w-4 h-4" /> Active Caloric Target
                </span>
                <span className="font-mono text-slate-400">{calories} kcal</span>
              </label>
              <input
                type="number"
                min="100"
                max="5000"
                step="25"
                value={calories}
                onChange={(e) => setCalories(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            {/* Steps */}
            <div className="space-y-1.5">
              <label className="flex items-center justify-between text-xs font-medium text-slate-300">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Footprints className="w-4 h-4" /> Daily Step Target
                </span>
                <span className="font-mono text-slate-400">{steps.toLocaleString()} steps</span>
              </label>
              <input
                type="number"
                min="1000"
                max="50000"
                step="500"
                value={steps}
                onChange={(e) => setSteps(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            {/* Active Minutes */}
            <div className="space-y-1.5">
              <label className="flex items-center justify-between text-xs font-medium text-slate-300">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <Clock className="w-4 h-4" /> Exercise Minutes
                </span>
                <span className="font-mono text-slate-400">{activeMinutes} min</span>
              </label>
              <input
                type="number"
                min="10"
                max="300"
                step="5"
                value={activeMinutes}
                onChange={(e) => setActiveMinutes(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            {/* Water Target */}
            <div className="space-y-1.5">
              <label className="flex items-center justify-between text-xs font-medium text-slate-300">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <Droplet className="w-4 h-4" /> Hydration Goal
                </span>
                <span className="font-mono text-slate-400">{waterMl} ml</span>
              </label>
              <input
                type="number"
                min="500"
                max="10000"
                step="100"
                value={waterMl}
                onChange={(e) => setWaterMl(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            {/* Sleep Target */}
            <div className="space-y-1.5">
              <label className="flex items-center justify-between text-xs font-medium text-slate-300">
                <span className="flex items-center gap-1.5 text-indigo-400">
                  <Moon className="w-4 h-4" /> Target Night Sleep
                </span>
                <span className="font-mono text-slate-400">{sleepHours} hours</span>
              </label>
              <input
                type="number"
                min="4"
                max="14"
                step="0.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Footer Buttons */}
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
              Save Goals
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
