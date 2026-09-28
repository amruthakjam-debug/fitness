import React, { useState } from 'react';
import { UserProfile } from '../types/fitness';
import { X, User, Download, Upload, RotateCcw, Check, Sparkles } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onExportData: () => void;
  onImportData: (jsonStr: string) => void;
  onResetData: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  onExportData,
  onImportData,
  onResetData,
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (field: keyof UserProfile, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        onImportData(content);
        setImportStatus('Fitness backup restored successfully!');
        setTimeout(() => setImportStatus(null), 3000);
      } catch {
        setImportStatus('Invalid JSON backup file format');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-semibold text-white">Athlete Profile & Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-6 space-y-6 max-h-[82vh] overflow-y-auto">
          {/* User Bio Card */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="w-14 h-14 rounded-full overflow-hidden border border-emerald-500/40 shrink-0">
              <img
                src={formData.avatarUrl || '/src/assets/images/fitness_user_avatar_1790611996655.jpg'}
                alt={formData.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-bold text-white">{formData.name}</div>
              <div className="text-xs text-slate-400 capitalize">
                {formData.fitnessLevel} Athlete · {formData.primaryFocus.replace('_', ' ')}
              </div>
            </div>
          </div>

          {/* Form fields */}
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-300">Display Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Age</label>
                <input
                  type="number"
                  min="12"
                  max="120"
                  value={formData.age}
                  onChange={(e) => handleChange('age', Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleChange('gender', e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 capitalize"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300">Height (cm)</label>
                <input
                  type="number"
                  min="80"
                  max="250"
                  value={formData.heightCm}
                  onChange={(e) => handleChange('heightCm', Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Starting Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  min="30"
                  max="300"
                  value={formData.startWeightKg}
                  onChange={(e) => handleChange('startWeightKg', Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-emerald-400 font-medium">Target Goal Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  min="30"
                  max="300"
                  value={formData.targetWeightKg}
                  onChange={(e) => handleChange('targetWeightKg', Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-emerald-400 font-bold font-mono focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Fitness Level</label>
                <select
                  value={formData.fitnessLevel}
                  onChange={(e) => handleChange('fitnessLevel', e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 capitalize"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300">Primary Focus</label>
                <select
                  value={formData.primaryFocus}
                  onChange={(e) => handleChange('primaryFocus', e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 capitalize"
                >
                  <option value="fat_loss">Fat Loss & Leaning</option>
                  <option value="muscle_gain">Muscle & Strength Gain</option>
                  <option value="endurance">Cardio Endurance</option>
                  <option value="general_health">General Health & Longevity</option>
                </select>
              </div>
            </div>
          </div>

          {/* Backup & Data Actions */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              Data Management & Backup
            </span>

            {importStatus && (
              <div className="p-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
                {importStatus}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onExportData}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON Backup</span>
              </button>

              <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Import JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={() => {
                  if (confirm('Reset all fitness data back to sample values?')) {
                    onResetData();
                    onClose();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg transition-colors ml-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo Data</span>
              </button>
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
              className="px-5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-sm"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
