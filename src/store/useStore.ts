import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format } from 'date-fns';
import { 
  UserProfile, 
  Split, 
  DailyLog, 
  WorkoutExercise, 
  Meal,
  ACTIVITY_MULTIPLIERS,
  GOAL_MODIFIERS 
} from '@/types';
import { DEFAULT_SPLITS } from '@/data/splits';
import { UnlockedAchievement } from '@/data/achievements';

interface AppState {
  // User
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  
  // Splits
  activeSplit: Split | null;
  customSplits: Split[];
  setActiveSplit: (split: Split) => void;
  addCustomSplit: (split: Split) => void;
  deleteCustomSplit: (id: string) => void;
  
  // Daily Logs
  logs: Record<string, DailyLog>;
  getTodayLog: () => DailyLog;
  getLog: (date: string) => DailyLog;
  
  // Workout
  addWorkoutExercise: (date: string, exercise: WorkoutExercise) => void;
  updateWorkoutExercise: (date: string, index: number, exercise: WorkoutExercise) => void;
  removeWorkoutExercise: (date: string, index: number) => void;
  
  // Meals
  addMeal: (date: string, meal: Meal) => void;
  updateMeal: (date: string, mealId: string, meal: Meal) => void;
  removeMeal: (date: string, mealId: string) => void;
  
  // Water
  addWater: (date: string, amount: number) => void;
  setWater: (date: string, amount: number) => void;
  
  // Images
  addPostWorkoutImage: (date: string, image: string) => void;
  removePostWorkoutImage: (date: string, index: number) => void;
  
  // Notes
  setNotes: (date: string, notes: string) => void;
  
  // Achievements
  unlockedAchievements: UnlockedAchievement[];
  unlockAchievement: (id: string) => void;
  
  // Calculations
  calculateBMR: () => number;
  calculateTDEE: () => number;
  calculateTargetCalories: () => number;
  calculateWaterGoal: () => number;

  // Reset Action (Added)
  reset: () => void;
}

const createEmptyLog = (date: string): DailyLog => ({
  date,
  workouts: [],
  meals: [],
  waterIntake: 0,
  postWorkoutImages: [],
  notes: '',
});

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      profile: null,
      activeSplit: null,
      customSplits: [],
      logs: {},
      unlockedAchievements: [],

      // Reset Action Implementation (Added)
      reset: () => set({
        profile: null,
        activeSplit: null,
        logs: {},
        unlockedAchievements: [],
        customSplits: [],
      }),

      setProfile: (profile) => set({ profile }),

      setActiveSplit: (split) => set({ activeSplit: split }),

      addCustomSplit: (split) => set((state) => ({
        customSplits: [...state.customSplits, split],
      })),

      deleteCustomSplit: (id) => set((state) => ({
        customSplits: state.customSplits.filter(s => s.id !== id),
        activeSplit: state.activeSplit?.id === id ? null : state.activeSplit,
      })),

      getTodayLog: () => {
        const today = format(new Date(), 'yyyy-MM-dd');
        return get().getLog(today);
      },

      getLog: (date) => {
        const logs = get().logs;
        return logs[date] || createEmptyLog(date);
      },

      addWorkoutExercise: (date, exercise) => set((state) => {
        const log = state.logs[date] || createEmptyLog(date);
        return {
          logs: {
            ...state.logs,
            [date]: {
              ...log,
              workouts: [...log.workouts, exercise],
            },
          },
        };
      }),

      updateWorkoutExercise: (date, index, exercise) => set((state) => {
        const log = state.logs[date] || createEmptyLog(date);
        const workouts = [...log.workouts];
        workouts[index] = exercise;
        return {
          logs: {
            ...state.logs,
            [date]: { ...log, workouts },
          },
        };
      }),

      removeWorkoutExercise: (date, index) => set((state) => {
        const log = state.logs[date] || createEmptyLog(date);
        const workouts = log.workouts.filter((_, i) => i !== index);
        return {
          logs: {
            ...state.logs,
            [date]: { ...log, workouts },
          },
        };
      }),

      addMeal: (date, meal) => set((state) => {
        const log = state.logs[date] || createEmptyLog(date);
        return {
          logs: {
            ...state.logs,
            [date]: {
              ...log,
              meals: [...log.meals, meal],
            },
          },
        };
      }),

      updateMeal: (date, mealId, meal) => set((state) => {
        const log = state.logs[date] || createEmptyLog(date);
        const meals = log.meals.map(m => m.id === mealId ? meal : m);
        return {
          logs: {
            ...state.logs,
            [date]: { ...log, meals },
          },
        };
      }),

      removeMeal: (date, mealId) => set((state) => {
        const log = state.logs[date] || createEmptyLog(date);
        const meals = log.meals.filter(m => m.id !== mealId);
        return {
          logs: {
            ...state.logs,
            [date]: { ...log, meals },
          },
        };
      }),

      addWater: (date, amount) => set((state) => {
        const log = state.logs[date] || createEmptyLog(date);
        return {
          logs: {
            ...state.logs,
            [date]: {
              ...log,
              waterIntake: log.waterIntake + amount,
            },
          },
        };
      }),

      setWater: (date, amount) => set((state) => {
        const log = state.logs[date] || createEmptyLog(date);
        return {
          logs: {
            ...state.logs,
            [date]: { ...log, waterIntake: amount },
          },
        };
      }),

      addPostWorkoutImage: (date, image) => set((state) => {
        const log = state.logs[date] || createEmptyLog(date);
        return {
          logs: {
            ...state.logs,
            [date]: {
              ...log,
              postWorkoutImages: [...log.postWorkoutImages, image],
            },
          },
        };
      }),

      removePostWorkoutImage: (date, index) => set((state) => {
        const log = state.logs[date] || createEmptyLog(date);
        const images = log.postWorkoutImages.filter((_, i) => i !== index);
        return {
          logs: {
            ...state.logs,
            [date]: { ...log, postWorkoutImages: images },
          },
        };
      }),

      setNotes: (date, notes) => set((state) => {
        const log = state.logs[date] || createEmptyLog(date);
        return {
          logs: {
            ...state.logs,
            [date]: { ...log, notes },
          },
        };
      }),

      unlockAchievement: (id) => set((state) => {
        if (state.unlockedAchievements.find(a => a.id === id)) {
          return state;
        }
        return {
          unlockedAchievements: [
            ...state.unlockedAchievements,
            { id, unlockedAt: new Date().toISOString() }
          ],
        };
      }),

      calculateBMR: () => {
        const profile = get().profile;
        if (!profile) return 0;
        
        if (profile.gender === 'male') {
          return 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
        } else {
          return 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;
        }
      },

      calculateTDEE: () => {
        const bmr = get().calculateBMR();
        const profile = get().profile;
        if (!profile) return 0;
        
        return Math.round(bmr * ACTIVITY_MULTIPLIERS[profile.activityLevel].multiplier);
      },

      calculateTargetCalories: () => {
        const tdee = get().calculateTDEE();
        const profile = get().profile;
        if (!profile) return 0;
        
        return Math.round(tdee + GOAL_MODIFIERS[profile.goal].modifier);
      },

      calculateWaterGoal: () => {
        const profile = get().profile;
        if (!profile) return 2500;
        
        return Math.round(profile.weight * 35);
      },
    }),
    {
      name: 'workout-logger-storage',
    }
  )
);

export const getAllSplits = (): Split[] => {
  const customSplits = useStore.getState().customSplits;
  return [...DEFAULT_SPLITS, ...customSplits];
};