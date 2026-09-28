import React from 'react';
import { Achievement } from '../types/fitness';
import {
  Award,
  Zap,
  Flame,
  Footprints,
  Navigation,
  Scale,
  CheckCircle2,
  Lock,
  Sparkles,
} from 'lucide-react';
import { fireAchievementCelebration } from '../utils/confetti';

interface AchievementsSectionProps {
  achievements: Achievement[];
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({
  achievements,
}) => {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercent = Math.round((unlockedCount / totalCount) * 100);

  const getIcon = (iconName: string, unlocked: boolean) => {
    const iconClass = unlocked ? 'text-amber-400' : 'text-slate-500';
    switch (iconName) {
      case 'zap':
        return <Zap className={`w-5 h-5 ${iconClass}`} />;
      case 'activity':
        return <Award className={`w-5 h-5 ${iconClass}`} />;
      case 'footprints':
        return <Footprints className={`w-5 h-5 ${iconClass}`} />;
      case 'flame':
        return <Flame className={`w-5 h-5 ${iconClass}`} />;
      case 'navigation':
        return <Navigation className={`w-5 h-5 ${iconClass}`} />;
      case 'scale':
        return <Scale className={`w-5 h-5 ${iconClass}`} />;
      default:
        return <Sparkles className={`w-5 h-5 ${iconClass}`} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <Award className="w-4 h-4 text-amber-400" />
            <span>PROGRESS TROPHY ROOM</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Fitness Milestones & Badges
          </h2>
          <p className="text-xs text-slate-300">
            Earned through continuous dedication, workouts logged, and goals met.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold font-mono text-white tabular-nums">
              {unlockedCount} / {totalCount}
            </div>
            <div className="text-xs text-slate-400 font-mono tabular-nums">
              {completionPercent}% unlocked
            </div>
          </div>
          <button
            onClick={fireAchievementCelebration}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Celebrate!</span>
          </button>
        </div>
      </div>

      {/* Achievement Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((item) => {
          const percent = Math.min(100, Math.round((item.progress / item.maxProgress) * 100));

          return (
            <div
              key={item.id}
              className={`p-5 rounded-xl border transition-all flex flex-col justify-between ${
                item.unlocked
                  ? 'bg-slate-900/80 border-amber-500/30 shadow-sm shadow-amber-950/20'
                  : 'bg-slate-950/40 border-slate-800/80 opacity-75'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                      item.unlocked
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                        : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                  >
                    {getIcon(item.icon, item.unlocked)}
                  </div>
                  {item.unlocked ? (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3" /> Unlocked
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  )}
                </div>

                <h3 className="text-base font-semibold text-white">{item.title}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs font-mono tabular-nums mb-1.5 text-slate-400">
                  <span>Progress</span>
                  <span className={item.unlocked ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                    {item.progress.toLocaleString()} / {item.maxProgress.toLocaleString()} ({percent}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      item.unlocked ? 'bg-amber-400' : 'bg-slate-600'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
