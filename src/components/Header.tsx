import React from 'react';
import { UserProfile } from '../types/fitness';
import { Target, Plus, Flame } from 'lucide-react';

interface HeaderProps {
  currentTab: 'overview' | 'workouts' | 'nutrition' | 'progress' | 'milestones';
  onSelectTab: (tab: 'overview' | 'workouts' | 'nutrition' | 'progress' | 'milestones') => void;
  onOpenGoalsModal: () => void;
  onOpenLogWorkoutModal: () => void;
  onOpenProfileModal: () => void;
  streak: number;
  profile: UserProfile;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenGoalsModal,
  onOpenLogWorkoutModal,
  onOpenProfileModal,
  streak,
  profile,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Brand title, single line text wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectTab('overview')}
            className="text-left font-bold text-xl tracking-tight text-white hover:text-emerald-400 transition-colors flex items-center gap-2 focus:outline-none"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>PulseTrack</span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (single-line, clean text tabs) */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2 text-sm font-medium text-slate-400">
          <button
            onClick={() => onSelectTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'overview'
                ? 'text-white bg-slate-800/90 font-semibold'
                : 'hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onSelectTab('workouts')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'workouts'
                ? 'text-white bg-slate-800/90 font-semibold'
                : 'hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Workouts
          </button>
          <button
            onClick={() => onSelectTab('nutrition')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'nutrition'
                ? 'text-white bg-slate-800/90 font-semibold'
                : 'hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Nutrition & Water
          </button>
          <button
            onClick={() => onSelectTab('progress')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'progress'
                ? 'text-white bg-slate-800/90 font-semibold'
                : 'hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Body Progress
          </button>
          <button
            onClick={() => onSelectTab('milestones')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'milestones'
                ? 'text-white bg-slate-800/90 font-semibold'
                : 'hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Milestones
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Streak indicator */}
          <div
            title={`${streak}-day active streak!`}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-md"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="tabular-nums">{streak}d</span>
          </div>

          {/* Goal adjustment button */}
          <button
            onClick={onOpenGoalsModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors whitespace-nowrap"
          >
            <Target className="w-3.5 h-3.5 text-emerald-400" />
            <span>Daily Goals</span>
          </button>

          {/* Quick Log button */}
          <button
            onClick={onOpenLogWorkoutModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-emerald-950"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Log Activity</span>
          </button>

          {/* Profile Avatar trigger */}
          <button
            onClick={onOpenProfileModal}
            className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-700 hover:border-emerald-400 transition-colors focus:outline-none shrink-0"
            title="Profile & Settings"
          >
            <img
              src={profile.avatarUrl || '/src/assets/images/fitness_user_avatar_1790611996655.jpg'}
              alt={profile.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback if image fails to load
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-slate-800 flex items-center justify-center text-xs font-semibold text-slate-200">
              {profile.name.charAt(0)}
            </div>
          </button>
        </div>
      </div>

      {/* Mobile nav subrow */}
      <div className="md:hidden flex items-center justify-between gap-1 pt-2.5 mt-2 border-t border-slate-850 overflow-x-auto no-scrollbar">
        <button
          onClick={() => onSelectTab('overview')}
          className={`px-2.5 py-1 text-xs rounded transition-colors whitespace-nowrap ${
            currentTab === 'overview' ? 'text-white bg-slate-800 font-medium' : 'text-slate-400'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => onSelectTab('workouts')}
          className={`px-2.5 py-1 text-xs rounded transition-colors whitespace-nowrap ${
            currentTab === 'workouts' ? 'text-white bg-slate-800 font-medium' : 'text-slate-400'
          }`}
        >
          Workouts
        </button>
        <button
          onClick={() => onSelectTab('nutrition')}
          className={`px-2.5 py-1 text-xs rounded transition-colors whitespace-nowrap ${
            currentTab === 'nutrition' ? 'text-white bg-slate-800 font-medium' : 'text-slate-400'
          }`}
        >
          Nutrition
        </button>
        <button
          onClick={() => onSelectTab('progress')}
          className={`px-2.5 py-1 text-xs rounded transition-colors whitespace-nowrap ${
            currentTab === 'progress' ? 'text-white bg-slate-800 font-medium' : 'text-slate-400'
          }`}
        >
          Progress
        </button>
        <button
          onClick={() => onSelectTab('milestones')}
          className={`px-2.5 py-1 text-xs rounded transition-colors whitespace-nowrap ${
            currentTab === 'milestones' ? 'text-white bg-slate-800 font-medium' : 'text-slate-400'
          }`}
        >
          Milestones
        </button>
        <button
          onClick={onOpenGoalsModal}
          className="px-2 py-1 text-xs text-emerald-400 hover:text-emerald-300 whitespace-nowrap"
        >
          Goals
        </button>
      </div>
    </header>
  );
};
