import React, { useState } from 'react';
import { BodyMeasurement, UserProfile } from '../types/fitness';
import { calculateBMI, formatFriendlyDate, kgToLbs } from '../utils/fitnessCalculators';
import {
  Scale,
  TrendingDown,
  TrendingUp,
  Plus,
  Trash2,
  Calendar,
  Activity,
} from 'lucide-react';

interface BodyProgressSectionProps {
  measurements: BodyMeasurement[];
  profile: UserProfile;
  onOpenRecordModal: () => void;
  onDeleteMeasurement: (id: string) => void;
}

export const BodyProgressSection: React.FC<BodyProgressSectionProps> = ({
  measurements,
  profile,
  onOpenRecordModal,
  onDeleteMeasurement,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<BodyMeasurement | null>(null);

  // Sorted by date ascending for chart
  const sortedMeasurements = [...measurements].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const latest: Partial<BodyMeasurement> & { weightKg: number; date: string } =
    sortedMeasurements.length > 0
      ? sortedMeasurements[sortedMeasurements.length - 1]
      : { weightKg: profile.startWeightKg, date: '' };

  const startWeight = profile.startWeightKg;
  const currentWeight = latest.weightKg;
  const targetWeight = profile.targetWeightKg;
  const totalChangeKg = Number((currentWeight - startWeight).toFixed(1));
  const remainingToGoalKg = Number(Math.abs(currentWeight - targetWeight).toFixed(1));

  const isLossGoal = profile.primaryFocus === 'fat_loss';
  const hasAchievedGoal = isLossGoal ? currentWeight <= targetWeight : currentWeight >= targetWeight;

  const { bmi, category: bmiCategory, color: bmiColor } = calculateBMI(
    currentWeight,
    profile.heightCm
  );

  // SVG Chart Dimensions
  const chartWidth = 700;
  const chartHeight = 220;
  const paddingX = 45;
  const paddingY = 30;

  // Min and max weights for scaling
  const allWeights = sortedMeasurements.map((m) => m.weightKg);
  allWeights.push(targetWeight);
  allWeights.push(startWeight);

  const minWeight = Math.floor(Math.min(...allWeights) - 1);
  const maxWeight = Math.ceil(Math.max(...allWeights) + 1);

  const getX = (index: number, total: number) => {
    if (total <= 1) return paddingX + (chartWidth - 2 * paddingX) / 2;
    return paddingX + (index / (total - 1)) * (chartWidth - 2 * paddingX);
  };

  const getY = (val: number) => {
    const range = maxWeight - minWeight || 1;
    return chartHeight - paddingY - ((val - minWeight) / range) * (chartHeight - 2 * paddingY);
  };

  // Generate SVG path for line
  const points = sortedMeasurements.map((m, i) => ({
    x: getX(i, sortedMeasurements.length),
    y: getY(m.weightKg),
    item: m,
  }));

  const linePath = points.reduce((path, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${path} L ${pt.x} ${pt.y}`;
  }, '');

  const targetY = getY(targetWeight);

  return (
    <div className="space-y-6">
      {/* Top Stat Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Weight */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Current Weight</span>
            <Scale className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold font-mono text-white tabular-nums">
              {currentWeight}
            </span>
            <span className="text-xs text-slate-400">kg ({kgToLbs(currentWeight)} lbs)</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center gap-1">
            {totalChangeKg < 0 ? (
              <span className="text-emerald-400 flex items-center gap-0.5 font-mono tabular-nums">
                <TrendingDown className="w-3.5 h-3.5" /> {Math.abs(totalChangeKg)} kg lost
              </span>
            ) : totalChangeKg > 0 ? (
              <span className="text-amber-400 flex items-center gap-0.5 font-mono tabular-nums">
                <TrendingUp className="w-3.5 h-3.5" /> +{totalChangeKg} kg gained
              </span>
            ) : (
              <span className="text-slate-400 font-mono">No change from baseline</span>
            )}
            <span className="text-slate-500">from start</span>
          </div>
        </div>

        {/* Target Weight */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Target Goal</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold font-mono text-cyan-400 tabular-nums">
              {targetWeight}
            </span>
            <span className="text-xs text-slate-400">kg ({kgToLbs(targetWeight)} lbs)</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            {hasAchievedGoal ? (
              <span className="text-emerald-400 font-medium">Goal weight achieved! 🎉</span>
            ) : (
              <span className="font-mono tabular-nums">
                {remainingToGoalKg} kg remaining to goal
              </span>
            )}
          </div>
        </div>

        {/* BMI Card */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Body Mass Index (BMI)</span>
            <span className={`text-xs font-medium ${bmiColor}`}>{bmiCategory}</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold font-mono text-white tabular-nums">
              {bmi}
            </span>
            <span className="text-xs text-slate-400 font-mono">kg/m²</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Height: <span className="font-mono text-slate-200">{profile.heightCm} cm</span> · Healthy: 18.5 - 24.9
          </div>
        </div>

        {/* Body Fat / Measurements */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Body Composition</span>
            <span className="text-xs text-purple-400 font-mono">Est. Fat</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold font-mono text-purple-400 tabular-nums">
              {latest.bodyFatPercent ? `${latest.bodyFatPercent}%` : 'N/A'}
            </span>
            {latest.waistCm && (
              <span className="text-xs text-slate-400 font-mono">· Waist: {latest.waistCm}cm</span>
            )}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            {sortedMeasurements.length} weigh-ins recorded
          </div>
        </div>
      </div>

      {/* Weight History Line Chart */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-semibold text-white">Weight Progression Trajectory</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Hover over points to inspect check-in dates and notes
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="inline-block w-3 h-0.5 bg-emerald-400" />
              <span>Recorded Weight</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="inline-block w-3 h-0.5 border-t border-dashed border-cyan-400" />
              <span>Goal ({targetWeight} kg)</span>
            </div>
            <button
              onClick={onOpenRecordModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Record Check-in</span>
            </button>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="relative mt-6 overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto max-h-72 select-none"
          >
            {/* Grid lines */}
            {[minWeight, Math.round((minWeight + maxWeight) / 2), maxWeight].map((val) => {
              const y = getY(val);
              return (
                <g key={val}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={chartWidth - paddingX}
                    y2={y}
                    stroke="#1e293b"
                    strokeWidth="1"
                  />
                  <text
                    x={paddingX - 8}
                    y={y + 4}
                    fill="#64748b"
                    fontSize="10"
                    fontFamily="monospace"
                    textAnchor="end"
                  >
                    {val} kg
                  </text>
                </g>
              );
            })}

            {/* Target Weight Dashed Line */}
            <line
              x1={paddingX}
              y1={targetY}
              x2={chartWidth - paddingX}
              y2={targetY}
              stroke="#06b6d4"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />

            {/* Main Weight Progression Line */}
            {points.length > 1 && (
              <path
                d={linePath}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Interactive Data Points */}
            {points.map((pt, idx) => (
              <g
                key={pt.item.id || idx}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredPoint(pt.item)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="5"
                  fill="#10b981"
                  stroke="#0f172a"
                  strokeWidth="2"
                  className="hover:scale-125 transition-transform"
                />
                {/* Date label at bottom */}
                <text
                  x={pt.x}
                  y={chartHeight - 8}
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {pt.item.date ? pt.item.date.slice(5) : ''}
                </text>
              </g>
            ))}
          </svg>

          {/* Hover Tooltip Box */}
          {hoveredPoint && (
            <div className="absolute top-2 right-4 bg-slate-950/95 border border-slate-700 p-3 rounded-lg text-xs shadow-xl backdrop-blur-md pointer-events-none">
              <div className="font-semibold text-white">
                {formatFriendlyDate(hoveredPoint.date)}
              </div>
              <div className="text-emerald-400 font-mono text-sm font-bold mt-0.5">
                {hoveredPoint.weightKg} kg ({kgToLbs(hoveredPoint.weightKg)} lbs)
              </div>
              {hoveredPoint.bodyFatPercent && (
                <div className="text-slate-400 text-[11px]">
                  Body Fat: {hoveredPoint.bodyFatPercent}%
                </div>
              )}
              {hoveredPoint.notes && (
                <div className="text-slate-300 italic text-[11px] mt-1 max-w-xs">
                  "{hoveredPoint.notes}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Measurement History Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Check-in Log History</h3>
          <span className="text-xs text-slate-400">{measurements.length} total entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-mono uppercase text-[11px]">
              <tr>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-4">Weight</th>
                <th className="py-3 px-4">Change</th>
                <th className="py-3 px-4">Body Fat</th>
                <th className="py-3 px-4">Waist</th>
                <th className="py-3 px-6">Notes</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono tabular-nums">
              {[...sortedMeasurements].reverse().map((entry, idx, arr) => {
                const prev = arr[idx + 1];
                const change = prev ? Number((entry.weightKg - prev.weightKg).toFixed(1)) : null;

                return (
                  <tr key={entry.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-6 font-sans text-slate-200">
                      {formatFriendlyDate(entry.date)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      {entry.weightKg} kg
                    </td>
                    <td className="py-3.5 px-4">
                      {change === null ? (
                        <span className="text-slate-500 font-sans text-xs">Baseline</span>
                      ) : change < 0 ? (
                        <span className="text-emerald-400">{change} kg</span>
                      ) : change > 0 ? (
                        <span className="text-rose-400">+{change} kg</span>
                      ) : (
                        <span className="text-slate-400">0.0 kg</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {entry.bodyFatPercent ? `${entry.bodyFatPercent}%` : '—'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {entry.waistCm ? `${entry.waistCm} cm` : '—'}
                    </td>
                    <td className="py-3.5 px-6 font-sans text-slate-400 max-w-xs truncate">
                      {entry.notes || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onDeleteMeasurement(entry.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                        title="Delete log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
