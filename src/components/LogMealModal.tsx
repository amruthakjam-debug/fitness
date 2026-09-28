import React, { useState } from 'react';
import { Meal } from '../types/fitness';
import { getTodayDateString } from '../utils/fitnessCalculators';
import { X, Utensils, Sparkles } from 'lucide-react';

interface LogMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  onAddMeal: (meal: Meal) => void;
}

export const LogMealModal: React.FC<LogMealModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  onAddMeal,
}) => {
  const [mealType, setMealType] = useState<Meal['type']>('breakfast');
  const [name, setName] = useState('');
  const [calories, setCalories] = useState(400);
  const [proteinG, setProteinG] = useState(30);
  const [carbsG, setCarbsG] = useState(45);
  const [fatG, setFatG] = useState(12);
  const [time, setTime] = useState('12:30');

  if (!isOpen) return null;

  const presets = [
    {
      name: 'Oatmeal, Whey & Blueberries',
      type: 'breakfast' as const,
      calories: 420,
      proteinG: 32,
      carbsG: 54,
      fatG: 8,
    },
    {
      name: 'Grilled Chicken, Jasmine Rice & Greens',
      type: 'lunch' as const,
      calories: 520,
      proteinG: 48,
      carbsG: 55,
      fatG: 8,
    },
    {
      name: 'Salmon Fillet, Roasted Sweet Potatoes',
      type: 'dinner' as const,
      calories: 610,
      proteinG: 42,
      carbsG: 46,
      fatG: 22,
    },
    {
      name: 'Greek Yogurt with Almonds & Honey',
      type: 'snack' as const,
      calories: 240,
      proteinG: 20,
      carbsG: 18,
      fatG: 10,
    },
    {
      name: 'Post-Workout Whey Protein Shake',
      type: 'snack' as const,
      calories: 160,
      proteinG: 30,
      carbsG: 4,
      fatG: 2,
    },
  ];

  const applyPreset = (p: typeof presets[0]) => {
    setName(p.name);
    setMealType(p.type);
    setCalories(p.calories);
    setProteinG(p.proteinG);
    setCarbsG(p.carbsG);
    setFatG(p.fatG);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newMeal: Meal = {
      id: `m-${Date.now()}`,
      date: selectedDate || getTodayDateString(),
      time,
      type: mealType,
      name: name.trim(),
      calories: Number(calories),
      proteinG: Number(proteinG),
      carbsG: Number(carbsG),
      fatG: Number(fatG),
    };

    onAddMeal(newMeal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Utensils className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-semibold text-white">Log Food & Nutrition</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Quick presets */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
              Quick Meal Presets
            </span>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-amber-400/50 transition-colors flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>{p.name.split(',')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Meal Type Tabs */}
          <div className="grid grid-cols-4 gap-2">
            {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setMealType(type)}
                className={`py-2 text-xs font-medium rounded-lg capitalize border transition-colors ${
                  mealType === type
                    ? 'bg-amber-500/15 border-amber-500 text-amber-400 font-semibold'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Name & Time */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-1">
              <label className="text-xs text-slate-300">Food / Recipe Name</label>
              <input
                type="text"
                placeholder="e.g. Scrambled Eggs with Avocado"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-300">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          {/* Calories */}
          <div className="space-y-1">
            <label className="text-xs text-slate-300">Total Calories (kcal)</label>
            <input
              type="number"
              min="0"
              max="5000"
              value={calories}
              onChange={(e) => setCalories(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono font-bold focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          {/* Macros */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-emerald-400 font-medium">Protein (g)</label>
              <input
                type="number"
                min="0"
                max="500"
                value={proteinG}
                onChange={(e) => setProteinG(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-cyan-400 font-medium">Carbs (g)</label>
              <input
                type="number"
                min="0"
                max="500"
                value={carbsG}
                onChange={(e) => setCarbsG(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-amber-400 font-medium">Fat (g)</label>
              <input
                type="number"
                min="0"
                max="500"
                value={fatG}
                onChange={(e) => setFatG(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Footer */}
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
              className="px-5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm"
            >
              Log Food
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
