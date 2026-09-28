import React, { useState } from 'react';
import { BodyMeasurement } from '../types/fitness';
import { getTodayDateString } from '../utils/fitnessCalculators';
import { X, Scale } from 'lucide-react';

interface RecordWeightModalProps {
  isOpen: boolean;
  onClose: () => void;
  latestWeightKg: number;
  onAddMeasurement: (measurement: BodyMeasurement) => void;
}

export const RecordWeightModal: React.FC<RecordWeightModalProps> = ({
  isOpen,
  onClose,
  latestWeightKg,
  onAddMeasurement,
}) => {
  const [date, setDate] = useState(getTodayDateString());
  const [weightKg, setWeightKg] = useState(latestWeightKg || 70.0);
  const [bodyFatPercent, setBodyFatPercent] = useState<string>('');
  const [waistCm, setWaistCm] = useState<string>('');
  const [chestCm, setChestCm] = useState<string>('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMeasurement: BodyMeasurement = {
      id: `bm-${Date.now()}`,
      date,
      weightKg: Number(weightKg),
      bodyFatPercent: bodyFatPercent ? Number(bodyFatPercent) : undefined,
      waistCm: waistCm ? Number(waistCm) : undefined,
      chestCm: chestCm ? Number(chestCm) : undefined,
      notes: notes.trim() || undefined,
    };

    onAddMeasurement(newMeasurement);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-semibold text-white">Record Body Check-in</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-slate-300">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-purple-400 font-semibold">Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              min="20"
              max="350"
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-base text-white font-mono font-bold focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-slate-300">Body Fat %</label>
              <input
                type="number"
                step="0.1"
                min="3"
                max="60"
                placeholder="e.g. 21.5"
                value={bodyFatPercent}
                onChange={(e) => setBodyFatPercent(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-300">Waist (cm)</label>
              <input
                type="number"
                step="0.5"
                placeholder="e.g. 78"
                value={waistCm}
                onChange={(e) => setWaistCm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-300">Chest (cm)</label>
              <input
                type="number"
                step="0.5"
                placeholder="e.g. 92"
                value={chestCm}
                onChange={(e) => setChestCm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-300">Progress Notes (Optional)</label>
            <textarea
              rows={2}
              placeholder="e.g. Fasted weigh-in, feeling leaner."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

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
              className="px-5 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors shadow-sm"
            >
              Save Weigh-in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
