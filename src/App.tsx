/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  BodyMeasurement,
  DailyGoalTargets,
  DailyLog,
  Meal,
  UserProfile,
  Workout,
} from './types/fitness';
import {
  calculateStreak,
  computeAchievements,
  getInitialState,
  loadSavedState,
  saveStateToStorage,
} from './utils/storage';
import { getTodayDateString } from './utils/fitnessCalculators';
import { Header } from './components/Header';
import { DailyOverview } from './components/DailyOverview';
import { WorkoutSection } from './components/WorkoutSection';
import { NutritionSection } from './components/NutritionSection';
import { BodyProgressSection } from './components/BodyProgressSection';
import { AchievementsSection } from './components/AchievementsSection';
import { GoalsModal } from './components/GoalsModal';
import { LogWorkoutModal } from './components/LogWorkoutModal';
import { LiveWorkoutModal } from './components/LiveWorkoutModal';
import { LogMealModal } from './components/LogMealModal';
import { RecordWeightModal } from './components/RecordWeightModal';
import { ProfileModal } from './components/ProfileModal';

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTab, setCurrentTab] = useState<
    'overview' | 'workouts' | 'nutrition' | 'progress' | 'milestones'
  >('overview');
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());

  // Core Fitness State
  const [targets, setTargets] = useState<DailyGoalTargets>(getInitialState().targets);
  const [profile, setProfile] = useState<UserProfile>(getInitialState().profile);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [dayLogs, setDayLogs] = useState<Record<string, DailyLog>>({});
  const [bodyMeasurements, setBodyMeasurements] = useState<BodyMeasurement[]>([]);

  // Modals state
  const [isGoalsModalOpen, setIsGoalsModalOpen] = useState(false);
  const [isLogWorkoutModalOpen, setIsLogWorkoutModalOpen] = useState(false);
  const [isLiveWorkoutModalOpen, setIsLiveWorkoutModalOpen] = useState(false);
  const [isLogMealModalOpen, setIsLogMealModalOpen] = useState(false);
  const [isRecordWeightModalOpen, setIsRecordWeightModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Load initial saved state on mount
  useEffect(() => {
    const saved = loadSavedState();
    setTargets(saved.targets);
    setProfile(saved.profile);
    setWorkouts(saved.workouts);
    setMeals(saved.meals);
    setDayLogs(saved.dayLogs);
    setBodyMeasurements(saved.bodyMeasurements);
    setIsLoaded(true);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    saveStateToStorage({
      targets,
      profile,
      workouts,
      meals,
      dayLogs,
      bodyMeasurements,
    });
  }, [isLoaded, targets, profile, workouts, meals, dayLogs, bodyMeasurements]);

  // Current day log (fallback if not yet logged)
  const currentDayLog: DailyLog = useMemo(() => {
    if (dayLogs[selectedDate]) {
      return dayLogs[selectedDate];
    }
    return {
      date: selectedDate,
      steps: 0,
      activeMinutes: 0,
      waterMl: 0,
      sleepHours: 8,
    };
  }, [dayLogs, selectedDate]);

  // Latest user weight for calculations
  const latestWeightKg = useMemo(() => {
    if (bodyMeasurements.length === 0) return profile.startWeightKg;
    const sorted = [...bodyMeasurements].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return sorted[sorted.length - 1].weightKg;
  }, [bodyMeasurements, profile.startWeightKg]);

  // Streak calculations
  const { currentStreak } = useMemo(() => {
    return calculateStreak(dayLogs, workouts, targets);
  }, [dayLogs, workouts, targets]);

  // Achievements
  const achievements = useMemo(() => {
    return computeAchievements(workouts, dayLogs, bodyMeasurements, profile);
  }, [workouts, dayLogs, bodyMeasurements, profile]);

  // Handlers
  const handleUpdateDailyLog = (updated: Partial<DailyLog>) => {
    setDayLogs((prev) => {
      const existing = prev[selectedDate] || {
        date: selectedDate,
        steps: 0,
        activeMinutes: 0,
        waterMl: 0,
        sleepHours: 8,
      };
      return {
        ...prev,
        [selectedDate]: {
          ...existing,
          ...updated,
        },
      };
    });
  };

  const handleAddWorkout = (newWorkout: Workout) => {
    setWorkouts((prev) => [newWorkout, ...prev]);

    // Also update that day's active minutes in dayLogs
    setDayLogs((prev) => {
      const logDate = newWorkout.date;
      const existing = prev[logDate] || {
        date: logDate,
        steps: 0,
        activeMinutes: 0,
        waterMl: 0,
        sleepHours: 8,
      };
      return {
        ...prev,
        [logDate]: {
          ...existing,
          activeMinutes: existing.activeMinutes + newWorkout.durationMinutes,
        },
      };
    });
  };

  const handleDeleteWorkout = (workoutId: string) => {
    setWorkouts((prev) => prev.filter((w) => w.id !== workoutId));
  };

  const handleAddMeal = (newMeal: Meal) => {
    setMeals((prev) => [...prev, newMeal]);
  };

  const handleDeleteMeal = (mealId: string) => {
    setMeals((prev) => prev.filter((m) => m.id !== mealId));
  };

  const handleUpdateWater = (newAmount: number) => {
    handleUpdateDailyLog({ waterMl: newAmount });
  };

  const handleAddMeasurement = (newMeasurement: BodyMeasurement) => {
    setBodyMeasurements((prev) => [...prev, newMeasurement]);
  };

  const handleDeleteMeasurement = (measurementId: string) => {
    setBodyMeasurements((prev) => prev.filter((m) => m.id !== measurementId));
  };

  const handleExportData = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      targets,
      profile,
      workouts,
      meals,
      dayLogs,
      bodyMeasurements,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pulsetrack_backup_${getTodayDateString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (jsonStr: string) => {
    const data = JSON.parse(jsonStr);
    if (data.targets) setTargets(data.targets);
    if (data.profile) setProfile(data.profile);
    if (data.workouts) setWorkouts(data.workouts);
    if (data.meals) setMeals(data.meals);
    if (data.dayLogs) setDayLogs(data.dayLogs);
    if (data.bodyMeasurements) setBodyMeasurements(data.bodyMeasurements);
  };

  const handleResetData = () => {
    const defaults = getInitialState();
    setTargets(defaults.targets);
    setProfile(defaults.profile);
    setWorkouts(defaults.workouts);
    setMeals(defaults.meals);
    setDayLogs(defaults.dayLogs);
    setBodyMeasurements(defaults.bodyMeasurements);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* 3-Zone Header Contract */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenGoalsModal={() => setIsGoalsModalOpen(true)}
        onOpenLogWorkoutModal={() => setIsLogWorkoutModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        streak={currentStreak}
        profile={profile}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6">
        {currentTab === 'overview' && (
          <DailyOverview
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            targets={targets}
            currentLog={currentDayLog}
            workouts={workouts}
            meals={meals}
            profile={profile}
            streak={currentStreak}
            onUpdateDailyLog={handleUpdateDailyLog}
            onOpenLiveWorkout={() => setIsLiveWorkoutModalOpen(true)}
            onOpenLogWorkout={() => setIsLogWorkoutModalOpen(true)}
            onOpenLogMeal={() => setIsLogMealModalOpen(true)}
            onOpenLogWeight={() => setIsRecordWeightModalOpen(true)}
            onOpenGoalsModal={() => setIsGoalsModalOpen(true)}
          />
        )}

        {currentTab === 'workouts' && (
          <WorkoutSection
            workouts={workouts}
            onOpenLogWorkout={() => setIsLogWorkoutModalOpen(true)}
            onOpenLiveWorkout={() => setIsLiveWorkoutModalOpen(true)}
            onDeleteWorkout={handleDeleteWorkout}
          />
        )}

        {currentTab === 'nutrition' && (
          <NutritionSection
            selectedDate={selectedDate}
            meals={meals}
            waterMl={currentDayLog.waterMl}
            targets={targets}
            onAddMeal={() => setIsLogMealModalOpen(true)}
            onDeleteMeal={handleDeleteMeal}
            onUpdateWater={handleUpdateWater}
          />
        )}

        {currentTab === 'progress' && (
          <BodyProgressSection
            measurements={bodyMeasurements}
            profile={profile}
            onOpenRecordModal={() => setIsRecordWeightModalOpen(true)}
            onDeleteMeasurement={handleDeleteMeasurement}
          />
        )}

        {currentTab === 'milestones' && (
          <AchievementsSection achievements={achievements} />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-6 px-4 sm:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">PulseTrack</span>
            <span aria-hidden="true">·</span>
            <span>Personal Fitness & Daily Goal Architecture</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsGoalsModalOpen(true)}
              className="hover:text-white transition-colors"
            >
              Goal Targets
            </button>
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="hover:text-white transition-colors"
            >
              Data Backup & Settings
            </button>
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      <GoalsModal
        isOpen={isGoalsModalOpen}
        onClose={() => setIsGoalsModalOpen(false)}
        targets={targets}
        onSaveTargets={setTargets}
      />

      <LogWorkoutModal
        isOpen={isLogWorkoutModalOpen}
        onClose={() => setIsLogWorkoutModalOpen(false)}
        userWeightKg={latestWeightKg}
        initialDate={selectedDate}
        onAddWorkout={handleAddWorkout}
      />

      <LiveWorkoutModal
        isOpen={isLiveWorkoutModalOpen}
        onClose={() => setIsLiveWorkoutModalOpen(false)}
        userWeightKg={latestWeightKg}
        onFinishWorkout={handleAddWorkout}
      />

      <LogMealModal
        isOpen={isLogMealModalOpen}
        onClose={() => setIsLogMealModalOpen(false)}
        selectedDate={selectedDate}
        onAddMeal={handleAddMeal}
      />

      <RecordWeightModal
        isOpen={isRecordWeightModalOpen}
        onClose={() => setIsRecordWeightModalOpen(false)}
        latestWeightKg={latestWeightKg}
        onAddMeasurement={handleAddMeasurement}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSaveProfile={setProfile}
        onExportData={handleExportData}
        onImportData={handleImportData}
        onResetData={handleResetData}
      />
    </div>
  );
}
