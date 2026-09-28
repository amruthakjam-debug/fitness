import React from 'react';
import { DailyGoalTargets, Meal } from '../types/fitness';
import { formatFriendlyDate } from '../utils/fitnessCalculators';
import {
  Droplet,
  Utensils,
  Plus,
  Trash2,
  PieChart,
  RotateCcw,
} from 'lucide-react';
import { fireGoalCelebration } from '../utils/confetti';

interface NutritionSectionProps {
  selectedDate: string;
  meals: Meal[];
  waterMl: number;
  targets: DailyGoalTargets;
  onAddMeal: () => void;
  onDeleteMeal: (id: string) => void;
  onUpdateWater: (newAmount: number) => void;
}

export const NutritionSection: React.FC<NutritionSectionProps> = ({
  selectedDate,
  meals,
  waterMl,
  targets,
  onAddMeal,
  onDeleteMeal,
  onUpdateWater,
}) => {
  // Filter meals for the currently selected date
  const dayMeals = meals.filter((m) => m.date === selectedDate);

  const totalCalories = dayMeals.reduce((sum, m) => sum + m.calories, 0);
  const totalProtein = dayMeals.reduce((sum, m) => sum + m.proteinG, 0);
  const totalCarbs = dayMeals.reduce((sum, m) => sum + m.carbsG, 0);
  const totalFat = dayMeals.reduce((sum, m) => sum + m.fatG, 0);

  // Targets (approximate default targets based on typical fitness plans)
  const targetCaloriesBudget = 2200;
  const targetProteinG = 140;
  const targetCarbsG = 220;
  const targetFatG = 65;

  const waterPercent = Math.min(100, Math.round((waterMl / targets.waterMl) * 100));

  const handleAddWater = (amount: number) => {
    const next = waterMl + amount;
    onUpdateWater(next);
    if (next >= targets.waterMl && waterMl < targets.waterMl) {
      fireGoalCelebration();
    }
  };

  const mealTypes: Array<{ key: Meal['type']; label: string }> = [
    { key: 'breakfast', label: 'Breakfast' },
    { key: 'lunch', label: 'Lunch' },
    { key: 'dinner', label: 'Dinner' },
    { key: 'snack', label: 'Snacks & Supplements' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner: Hydration & Macro Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hydration Station */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplet className="w-5 h-5 text-cyan-400 fill-cyan-400/20" />
              <h2 className="text-base font-semibold text-white">Daily Hydration</h2>
            </div>
            <button
              onClick={() => onUpdateWater(0)}
              className="p-1 text-slate-500 hover:text-slate-300 transition-colors"
              title="Reset water for this day"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="my-6">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-3xl font-extrabold font-mono text-cyan-400 tabular-nums">
                {waterMl} <span className="text-sm font-normal text-slate-400">ml</span>
              </span>
              <span className="text-xs font-mono text-slate-400 tabular-nums">
                Goal: {targets.waterMl} ml ({waterPercent}%)
              </span>
            </div>

            {/* Visual water level bar */}
            <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-sky-400 transition-all duration-500"
                style={{ width: `${waterPercent}%` }}
              />
            </div>
          </div>

          <div>
            <span className="text-xs text-slate-400 block mb-2">Quick Log Water:</span>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => handleAddWater(150)}
                className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 rounded-lg transition-colors text-center"
              >
                +150ml
              </button>
              <button
                onClick={() => handleAddWater(250)}
                className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 rounded-lg transition-colors text-center"
              >
                +250ml
              </button>
              <button
                onClick={() => handleAddWater(500)}
                className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 rounded-lg transition-colors text-center"
              >
                +500ml
              </button>
              <button
                onClick={() => handleAddWater(750)}
                className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 rounded-lg transition-colors text-center"
              >
                +750ml
              </button>
            </div>
          </div>
        </div>

        {/* Caloric Intake & Energy Balance */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Utensils className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-semibold text-white">Caloric Intake</h2>
            </div>
            <button
              onClick={onAddMeal}
              className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Meal</span>
            </button>
          </div>

          <div className="my-6">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-3xl font-extrabold font-mono text-white tabular-nums">
                {totalCalories} <span className="text-sm font-normal text-slate-400">kcal</span>
              </span>
              <span className="text-xs font-mono text-slate-400 tabular-nums">
                Budget: {targetCaloriesBudget} kcal
              </span>
            </div>

            <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.round((totalCalories / targetCaloriesBudget) * 100))}%`,
                }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span>
              Remaining:{' '}
              <strong className="text-slate-200 font-mono tabular-nums">
                {Math.max(0, targetCaloriesBudget - totalCalories)} kcal
              </strong>
            </span>
            <span>{dayMeals.length} meals logged</span>
          </div>
        </div>

        {/* Macronutrient Distribution */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-semibold text-white">Daily Macronutrients</h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">Grams logged</span>
          </div>

          <div className="space-y-3.5 my-4">
            {/* Protein */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Protein</span>
                <span className="font-mono text-slate-400 tabular-nums">
                  <strong className="text-emerald-400">{totalProtein}g</strong> / {targetProteinG}g
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-400 transition-all"
                  style={{ width: `${Math.min(100, (totalProtein / targetProteinG) * 100)}%` }}
                />
              </div>
            </div>

            {/* Carbs */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Carbohydrates</span>
                <span className="font-mono text-slate-400 tabular-nums">
                  <strong className="text-cyan-400">{totalCarbs}g</strong> / {targetCarbsG}g
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-cyan-400 transition-all"
                  style={{ width: `${Math.min(100, (totalCarbs / targetCarbsG) * 100)}%` }}
                />
              </div>
            </div>

            {/* Fats */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Fats</span>
                <span className="font-mono text-slate-400 tabular-nums">
                  <strong className="text-amber-400">{totalFat}g</strong> / {targetFatG}g
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-amber-400 transition-all"
                  style={{ width: `${Math.min(100, (totalFat / targetFatG) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-500 text-center">
            P: {Math.round((totalProtein * 4) / (totalCalories || 1) * 100)}% · C: {Math.round((totalCarbs * 4) / (totalCalories || 1) * 100)}% · F: {Math.round((totalFat * 9) / (totalCalories || 1) * 100)}%
          </div>
        </div>
      </div>

      {/* Meals Grouped by Type */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-semibold text-white">
              Food & Meal Diary ({formatFriendlyDate(selectedDate)})
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Review and record what you eat throughout the day
            </p>
          </div>
          <button
            onClick={onAddMeal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Food</span>
          </button>
        </div>

        <div className="space-y-6">
          {mealTypes.map((mt) => {
            const items = dayMeals.filter((m) => m.type === mt.key);
            const sectionCalories = items.reduce((s, m) => s + m.calories, 0);

            return (
              <div key={mt.key} className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 pb-1 border-b border-slate-800/60">
                  <span className="font-semibold text-slate-200">{mt.label}</span>
                  <span className="font-mono tabular-nums">{sectionCalories} kcal</span>
                </div>

                {items.length === 0 ? (
                  <div className="py-2.5 text-xs text-slate-500 italic">No items logged yet</div>
                ) : (
                  <div className="divide-y divide-slate-800/40">
                    {items.map((meal) => (
                      <div
                        key={meal.id}
                        className="py-2.5 flex items-center justify-between gap-4 text-xs group"
                      >
                        <div className="space-y-0.5">
                          <div className="font-medium text-white text-sm">{meal.name}</div>
                          <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px] tabular-nums">
                            <span>{meal.time}</span>
                            <span aria-hidden="true">·</span>
                            <span>{meal.proteinG}g protein</span>
                            <span aria-hidden="true">·</span>
                            <span>{meal.carbsG}g carbs</span>
                            <span aria-hidden="true">·</span>
                            <span>{meal.fatG}g fat</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-mono font-semibold text-slate-200 text-sm tabular-nums">
                            {meal.calories} kcal
                          </span>
                          <button
                            onClick={() => onDeleteMeal(meal.id)}
                            className="p-1 text-slate-600 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                            title="Delete food entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
