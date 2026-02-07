import { DailyLog } from '@/types';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'workout' | 'nutrition' | 'consistency' | 'strength' | 'volume' | 'hydration' | 'milestone' | 'special';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  check: (data: AchievementCheckData) => boolean;
}

export interface AchievementCheckData {
  logs: Record<string, DailyLog>;
  currentLog: DailyLog;
  allTimeStats: {
    totalWorkouts: number;
    totalSets: number;
    totalReps: number;
    totalVolume: number;
    totalMeals: number;
    totalCalories: number;
    totalProtein: number;
    totalWater: number;
    totalPhotos: number;
    maxWeight: number;
    maxReps: number;
    maxVolumeSingleDay: number;
    longestStreak: number;
    currentStreak: number;
    uniqueExercises: number;
    daysLogged: number;
  };
  todayStats: {
    workouts: number;
    sets: number;
    reps: number;
    volume: number;
    meals: number;
    calories: number;
    protein: number;
    water: number;
    photos: number;
  };
}

export interface UnlockedAchievement {
  id: string;
  unlockedAt: string;
}

// Generate all 300+ achievements
export const ACHIEVEMENTS: Achievement[] = [
  // ========== FIRST STEPS (Common) ==========
  { id: 'first-workout', name: 'First Steps', description: 'Log your first workout', icon: '🎯', category: 'workout', rarity: 'common', check: (d) => d.allTimeStats.totalWorkouts >= 1 },
  { id: 'first-meal', name: 'Fuel Up', description: 'Log your first meal', icon: '🍽️', category: 'nutrition', rarity: 'common', check: (d) => d.allTimeStats.totalMeals >= 1 },
  { id: 'first-water', name: 'Stay Hydrated', description: 'Log water for the first time', icon: '💧', category: 'hydration', rarity: 'common', check: (d) => d.allTimeStats.totalWater >= 250 },
  { id: 'first-photo', name: 'Captured', description: 'Upload your first progress photo', icon: '📸', category: 'milestone', rarity: 'common', check: (d) => d.allTimeStats.totalPhotos >= 1 },
  { id: 'first-set', name: 'Rep It Out', description: 'Complete your first set', icon: '💪', category: 'workout', rarity: 'common', check: (d) => d.allTimeStats.totalSets >= 1 },

  // ========== WORKOUT COUNT ACHIEVEMENTS ==========
  { id: 'workout-5', name: 'Getting Started', description: 'Complete 5 workouts', icon: '🏋️', category: 'workout', rarity: 'common', check: (d) => d.allTimeStats.totalWorkouts >= 5 },
  { id: 'workout-10', name: 'Building Momentum', description: 'Complete 10 workouts', icon: '🏋️', category: 'workout', rarity: 'common', check: (d) => d.allTimeStats.totalWorkouts >= 10 },
  { id: 'workout-25', name: 'Quarter Century', description: 'Complete 25 workouts', icon: '🏋️', category: 'workout', rarity: 'uncommon', check: (d) => d.allTimeStats.totalWorkouts >= 25 },
  { id: 'workout-50', name: 'Half Century', description: 'Complete 50 workouts', icon: '🏋️', category: 'workout', rarity: 'uncommon', check: (d) => d.allTimeStats.totalWorkouts >= 50 },
  { id: 'workout-75', name: 'Three Quarters', description: 'Complete 75 workouts', icon: '🏋️', category: 'workout', rarity: 'rare', check: (d) => d.allTimeStats.totalWorkouts >= 75 },
  { id: 'workout-100', name: 'Century Club', description: 'Complete 100 workouts', icon: '💯', category: 'workout', rarity: 'rare', check: (d) => d.allTimeStats.totalWorkouts >= 100 },
  { id: 'workout-150', name: 'Dedicated', description: 'Complete 150 workouts', icon: '🔥', category: 'workout', rarity: 'rare', check: (d) => d.allTimeStats.totalWorkouts >= 150 },
  { id: 'workout-200', name: 'Two Hundred Strong', description: 'Complete 200 workouts', icon: '🔥', category: 'workout', rarity: 'epic', check: (d) => d.allTimeStats.totalWorkouts >= 200 },
  { id: 'workout-250', name: 'Iron Will', description: 'Complete 250 workouts', icon: '⚔️', category: 'workout', rarity: 'epic', check: (d) => d.allTimeStats.totalWorkouts >= 250 },
  { id: 'workout-300', name: 'Spartan', description: 'Complete 300 workouts', icon: '🛡️', category: 'workout', rarity: 'epic', check: (d) => d.allTimeStats.totalWorkouts >= 300 },
  { id: 'workout-365', name: 'Year of Gains', description: 'Complete 365 workouts', icon: '📅', category: 'workout', rarity: 'epic', check: (d) => d.allTimeStats.totalWorkouts >= 365 },
  { id: 'workout-500', name: 'Half Thousand', description: 'Complete 500 workouts', icon: '👑', category: 'workout', rarity: 'legendary', check: (d) => d.allTimeStats.totalWorkouts >= 500 },
  { id: 'workout-750', name: 'Legend in Making', description: 'Complete 750 workouts', icon: '🌟', category: 'workout', rarity: 'legendary', check: (d) => d.allTimeStats.totalWorkouts >= 750 },
  { id: 'workout-1000', name: 'Thousand Strong', description: 'Complete 1000 workouts', icon: '🏆', category: 'workout', rarity: 'legendary', check: (d) => d.allTimeStats.totalWorkouts >= 1000 },

  // ========== SET COUNT ACHIEVEMENTS ==========
  { id: 'sets-10', name: 'Ten Sets', description: 'Complete 10 total sets', icon: '📊', category: 'volume', rarity: 'common', check: (d) => d.allTimeStats.totalSets >= 10 },
  { id: 'sets-50', name: 'Fifty Sets', description: 'Complete 50 total sets', icon: '📊', category: 'volume', rarity: 'common', check: (d) => d.allTimeStats.totalSets >= 50 },
  { id: 'sets-100', name: 'Century Sets', description: 'Complete 100 total sets', icon: '📊', category: 'volume', rarity: 'common', check: (d) => d.allTimeStats.totalSets >= 100 },
  { id: 'sets-250', name: 'Set Collector', description: 'Complete 250 total sets', icon: '📊', category: 'volume', rarity: 'uncommon', check: (d) => d.allTimeStats.totalSets >= 250 },
  { id: 'sets-500', name: 'Set Master', description: 'Complete 500 total sets', icon: '📊', category: 'volume', rarity: 'uncommon', check: (d) => d.allTimeStats.totalSets >= 500 },
  { id: 'sets-1000', name: 'Thousand Sets', description: 'Complete 1000 total sets', icon: '📈', category: 'volume', rarity: 'rare', check: (d) => d.allTimeStats.totalSets >= 1000 },
  { id: 'sets-2500', name: 'Set Addict', description: 'Complete 2500 total sets', icon: '📈', category: 'volume', rarity: 'rare', check: (d) => d.allTimeStats.totalSets >= 2500 },
  { id: 'sets-5000', name: 'Set Warrior', description: 'Complete 5000 total sets', icon: '⚡', category: 'volume', rarity: 'epic', check: (d) => d.allTimeStats.totalSets >= 5000 },
  { id: 'sets-10000', name: 'Set Legend', description: 'Complete 10000 total sets', icon: '🌟', category: 'volume', rarity: 'legendary', check: (d) => d.allTimeStats.totalSets >= 10000 },
  { id: 'sets-25000', name: 'Set God', description: 'Complete 25000 total sets', icon: '👑', category: 'volume', rarity: 'legendary', check: (d) => d.allTimeStats.totalSets >= 25000 },

  // ========== REP COUNT ACHIEVEMENTS ==========
  { id: 'reps-100', name: 'First Hundred Reps', description: 'Complete 100 total reps', icon: '🔄', category: 'volume', rarity: 'common', check: (d) => d.allTimeStats.totalReps >= 100 },
  { id: 'reps-500', name: 'Five Hundred Reps', description: 'Complete 500 total reps', icon: '🔄', category: 'volume', rarity: 'common', check: (d) => d.allTimeStats.totalReps >= 500 },
  { id: 'reps-1000', name: 'Rep Thousand', description: 'Complete 1000 total reps', icon: '🔄', category: 'volume', rarity: 'uncommon', check: (d) => d.allTimeStats.totalReps >= 1000 },
  { id: 'reps-5000', name: 'Rep Machine', description: 'Complete 5000 total reps', icon: '🔄', category: 'volume', rarity: 'rare', check: (d) => d.allTimeStats.totalReps >= 5000 },
  { id: 'reps-10000', name: 'Ten Thousand Reps', description: 'Complete 10000 total reps', icon: '🔄', category: 'volume', rarity: 'rare', check: (d) => d.allTimeStats.totalReps >= 10000 },
  { id: 'reps-25000', name: 'Rep King', description: 'Complete 25000 total reps', icon: '🔄', category: 'volume', rarity: 'epic', check: (d) => d.allTimeStats.totalReps >= 25000 },
  { id: 'reps-50000', name: 'Rep Emperor', description: 'Complete 50000 total reps', icon: '🔄', category: 'volume', rarity: 'epic', check: (d) => d.allTimeStats.totalReps >= 50000 },
  { id: 'reps-100000', name: 'Hundred Thousand Reps', description: 'Complete 100000 total reps', icon: '🔄', category: 'volume', rarity: 'legendary', check: (d) => d.allTimeStats.totalReps >= 100000 },

  // ========== VOLUME (WEIGHT LIFTED) ACHIEVEMENTS ==========
  { id: 'volume-1k', name: 'First Thousand', description: 'Lift 1,000 kg total', icon: '🏋️', category: 'strength', rarity: 'common', check: (d) => d.allTimeStats.totalVolume >= 1000 },
  { id: 'volume-5k', name: 'Five Thousand', description: 'Lift 5,000 kg total', icon: '🏋️', category: 'strength', rarity: 'common', check: (d) => d.allTimeStats.totalVolume >= 5000 },
  { id: 'volume-10k', name: 'Ten Thousand', description: 'Lift 10,000 kg total', icon: '🏋️', category: 'strength', rarity: 'uncommon', check: (d) => d.allTimeStats.totalVolume >= 10000 },
  { id: 'volume-25k', name: 'Twenty Five K', description: 'Lift 25,000 kg total', icon: '💪', category: 'strength', rarity: 'uncommon', check: (d) => d.allTimeStats.totalVolume >= 25000 },
  { id: 'volume-50k', name: 'Fifty Thousand', description: 'Lift 50,000 kg total', icon: '💪', category: 'strength', rarity: 'rare', check: (d) => d.allTimeStats.totalVolume >= 50000 },
  { id: 'volume-100k', name: 'Hundred Thousand', description: 'Lift 100,000 kg total', icon: '🔥', category: 'strength', rarity: 'rare', check: (d) => d.allTimeStats.totalVolume >= 100000 },
  { id: 'volume-250k', name: 'Quarter Million', description: 'Lift 250,000 kg total', icon: '🔥', category: 'strength', rarity: 'epic', check: (d) => d.allTimeStats.totalVolume >= 250000 },
  { id: 'volume-500k', name: 'Half Million', description: 'Lift 500,000 kg total', icon: '⚡', category: 'strength', rarity: 'epic', check: (d) => d.allTimeStats.totalVolume >= 500000 },
  { id: 'volume-1m', name: 'Million Pound Club', description: 'Lift 1,000,000 kg total', icon: '🏆', category: 'strength', rarity: 'legendary', check: (d) => d.allTimeStats.totalVolume >= 1000000 },
  { id: 'volume-2m', name: 'Two Million', description: 'Lift 2,000,000 kg total', icon: '👑', category: 'strength', rarity: 'legendary', check: (d) => d.allTimeStats.totalVolume >= 2000000 },
  { id: 'volume-5m', name: 'Five Million', description: 'Lift 5,000,000 kg total', icon: '🌟', category: 'strength', rarity: 'legendary', check: (d) => d.allTimeStats.totalVolume >= 5000000 },

  // ========== SINGLE DAY VOLUME ACHIEVEMENTS ==========
  { id: 'day-volume-1k', name: 'Solid Session', description: 'Lift 1,000 kg in a single day', icon: '📊', category: 'strength', rarity: 'common', check: (d) => d.todayStats.volume >= 1000 || d.allTimeStats.maxVolumeSingleDay >= 1000 },
  { id: 'day-volume-2k', name: 'Heavy Day', description: 'Lift 2,000 kg in a single day', icon: '📊', category: 'strength', rarity: 'uncommon', check: (d) => d.todayStats.volume >= 2000 || d.allTimeStats.maxVolumeSingleDay >= 2000 },
  { id: 'day-volume-5k', name: 'Monster Session', description: 'Lift 5,000 kg in a single day', icon: '📊', category: 'strength', rarity: 'rare', check: (d) => d.todayStats.volume >= 5000 || d.allTimeStats.maxVolumeSingleDay >= 5000 },
  { id: 'day-volume-10k', name: 'Absolute Unit', description: 'Lift 10,000 kg in a single day', icon: '📊', category: 'strength', rarity: 'epic', check: (d) => d.todayStats.volume >= 10000 || d.allTimeStats.maxVolumeSingleDay >= 10000 },
  { id: 'day-volume-15k', name: 'Iron Giant', description: 'Lift 15,000 kg in a single day', icon: '📊', category: 'strength', rarity: 'legendary', check: (d) => d.todayStats.volume >= 15000 || d.allTimeStats.maxVolumeSingleDay >= 15000 },

  // ========== MAX WEIGHT ACHIEVEMENTS ==========
  { id: 'max-weight-20', name: 'Beginner Gains', description: 'Lift 20 kg on a single set', icon: '🏋️', category: 'strength', rarity: 'common', check: (d) => d.allTimeStats.maxWeight >= 20 },
  { id: 'max-weight-40', name: 'Warming Up', description: 'Lift 40 kg on a single set', icon: '🏋️', category: 'strength', rarity: 'common', check: (d) => d.allTimeStats.maxWeight >= 40 },
  { id: 'max-weight-60', name: 'Getting Serious', description: 'Lift 60 kg on a single set', icon: '🏋️', category: 'strength', rarity: 'uncommon', check: (d) => d.allTimeStats.maxWeight >= 60 },
  { id: 'max-weight-80', name: 'Strong', description: 'Lift 80 kg on a single set', icon: '💪', category: 'strength', rarity: 'uncommon', check: (d) => d.allTimeStats.maxWeight >= 80 },
  { id: 'max-weight-100', name: 'Triple Digits', description: 'Lift 100 kg on a single set', icon: '💪', category: 'strength', rarity: 'rare', check: (d) => d.allTimeStats.maxWeight >= 100 },
  { id: 'max-weight-120', name: 'Beast Mode', description: 'Lift 120 kg on a single set', icon: '🔥', category: 'strength', rarity: 'rare', check: (d) => d.allTimeStats.maxWeight >= 120 },
  { id: 'max-weight-140', name: 'Powerhouse', description: 'Lift 140 kg on a single set', icon: '🔥', category: 'strength', rarity: 'epic', check: (d) => d.allTimeStats.maxWeight >= 140 },
  { id: 'max-weight-160', name: 'Elite', description: 'Lift 160 kg on a single set', icon: '⚡', category: 'strength', rarity: 'epic', check: (d) => d.allTimeStats.maxWeight >= 160 },
  { id: 'max-weight-180', name: 'Superhuman', description: 'Lift 180 kg on a single set', icon: '🏆', category: 'strength', rarity: 'epic', check: (d) => d.allTimeStats.maxWeight >= 180 },
  { id: 'max-weight-200', name: 'Two Plates Each Side', description: 'Lift 200 kg on a single set', icon: '👑', category: 'strength', rarity: 'legendary', check: (d) => d.allTimeStats.maxWeight >= 200 },
  { id: 'max-weight-250', name: 'Quarter Ton', description: 'Lift 250 kg on a single set', icon: '🌟', category: 'strength', rarity: 'legendary', check: (d) => d.allTimeStats.maxWeight >= 250 },
  { id: 'max-weight-300', name: 'Three Hundred', description: 'Lift 300 kg on a single set', icon: '🌟', category: 'strength', rarity: 'legendary', check: (d) => d.allTimeStats.maxWeight >= 300 },

  // ========== STREAK ACHIEVEMENTS ==========
  { id: 'streak-3', name: 'Three Day Streak', description: 'Work out 3 days in a row', icon: '🔥', category: 'consistency', rarity: 'common', check: (d) => d.allTimeStats.currentStreak >= 3 || d.allTimeStats.longestStreak >= 3 },
  { id: 'streak-5', name: 'Five Day Streak', description: 'Work out 5 days in a row', icon: '🔥', category: 'consistency', rarity: 'common', check: (d) => d.allTimeStats.currentStreak >= 5 || d.allTimeStats.longestStreak >= 5 },
  { id: 'streak-7', name: 'Week Warrior', description: 'Work out 7 days in a row', icon: '🔥', category: 'consistency', rarity: 'uncommon', check: (d) => d.allTimeStats.currentStreak >= 7 || d.allTimeStats.longestStreak >= 7 },
  { id: 'streak-14', name: 'Two Week Terror', description: 'Work out 14 days in a row', icon: '🔥', category: 'consistency', rarity: 'uncommon', check: (d) => d.allTimeStats.currentStreak >= 14 || d.allTimeStats.longestStreak >= 14 },
  { id: 'streak-21', name: 'Three Weeks Strong', description: 'Work out 21 days in a row', icon: '⚡', category: 'consistency', rarity: 'rare', check: (d) => d.allTimeStats.currentStreak >= 21 || d.allTimeStats.longestStreak >= 21 },
  { id: 'streak-30', name: 'Monthly Master', description: 'Work out 30 days in a row', icon: '⚡', category: 'consistency', rarity: 'rare', check: (d) => d.allTimeStats.currentStreak >= 30 || d.allTimeStats.longestStreak >= 30 },
  { id: 'streak-45', name: 'Six Weeks', description: 'Work out 45 days in a row', icon: '🏆', category: 'consistency', rarity: 'epic', check: (d) => d.allTimeStats.currentStreak >= 45 || d.allTimeStats.longestStreak >= 45 },
  { id: 'streak-60', name: 'Two Months', description: 'Work out 60 days in a row', icon: '🏆', category: 'consistency', rarity: 'epic', check: (d) => d.allTimeStats.currentStreak >= 60 || d.allTimeStats.longestStreak >= 60 },
  { id: 'streak-90', name: 'Quarterly Champion', description: 'Work out 90 days in a row', icon: '👑', category: 'consistency', rarity: 'epic', check: (d) => d.allTimeStats.currentStreak >= 90 || d.allTimeStats.longestStreak >= 90 },
  { id: 'streak-180', name: 'Half Year Hero', description: 'Work out 180 days in a row', icon: '🌟', category: 'consistency', rarity: 'legendary', check: (d) => d.allTimeStats.currentStreak >= 180 || d.allTimeStats.longestStreak >= 180 },
  { id: 'streak-365', name: 'Unbroken', description: 'Work out 365 days in a row', icon: '🌟', category: 'consistency', rarity: 'legendary', check: (d) => d.allTimeStats.currentStreak >= 365 || d.allTimeStats.longestStreak >= 365 },

  // ========== MEAL LOGGING ACHIEVEMENTS ==========
  { id: 'meals-5', name: 'Meal Logger', description: 'Log 5 meals', icon: '🍽️', category: 'nutrition', rarity: 'common', check: (d) => d.allTimeStats.totalMeals >= 5 },
  { id: 'meals-10', name: 'Tracking Nutrition', description: 'Log 10 meals', icon: '🍽️', category: 'nutrition', rarity: 'common', check: (d) => d.allTimeStats.totalMeals >= 10 },
  { id: 'meals-25', name: 'Diet Conscious', description: 'Log 25 meals', icon: '🍽️', category: 'nutrition', rarity: 'common', check: (d) => d.allTimeStats.totalMeals >= 25 },
  { id: 'meals-50', name: 'Nutrition Nerd', description: 'Log 50 meals', icon: '📋', category: 'nutrition', rarity: 'uncommon', check: (d) => d.allTimeStats.totalMeals >= 50 },
  { id: 'meals-100', name: 'Century Meals', description: 'Log 100 meals', icon: '📋', category: 'nutrition', rarity: 'uncommon', check: (d) => d.allTimeStats.totalMeals >= 100 },
  { id: 'meals-250', name: 'Macro Master', description: 'Log 250 meals', icon: '🎯', category: 'nutrition', rarity: 'rare', check: (d) => d.allTimeStats.totalMeals >= 250 },
  { id: 'meals-500', name: 'Nutrition Ninja', description: 'Log 500 meals', icon: '🎯', category: 'nutrition', rarity: 'rare', check: (d) => d.allTimeStats.totalMeals >= 500 },
  { id: 'meals-1000', name: 'Thousand Meals', description: 'Log 1000 meals', icon: '🏆', category: 'nutrition', rarity: 'epic', check: (d) => d.allTimeStats.totalMeals >= 1000 },
  { id: 'meals-2500', name: 'Nutrition Expert', description: 'Log 2500 meals', icon: '👑', category: 'nutrition', rarity: 'legendary', check: (d) => d.allTimeStats.totalMeals >= 2500 },

  // ========== CALORIE ACHIEVEMENTS ==========
  { id: 'calories-10k', name: 'First Ten K', description: 'Log 10,000 total calories', icon: '🔥', category: 'nutrition', rarity: 'common', check: (d) => d.allTimeStats.totalCalories >= 10000 },
  { id: 'calories-50k', name: 'Fifty Thousand Cals', description: 'Log 50,000 total calories', icon: '🔥', category: 'nutrition', rarity: 'common', check: (d) => d.allTimeStats.totalCalories >= 50000 },
  { id: 'calories-100k', name: 'Hundred K Calories', description: 'Log 100,000 total calories', icon: '🔥', category: 'nutrition', rarity: 'uncommon', check: (d) => d.allTimeStats.totalCalories >= 100000 },
  { id: 'calories-250k', name: 'Quarter Million Cals', description: 'Log 250,000 total calories', icon: '⚡', category: 'nutrition', rarity: 'rare', check: (d) => d.allTimeStats.totalCalories >= 250000 },
  { id: 'calories-500k', name: 'Half Million Cals', description: 'Log 500,000 total calories', icon: '⚡', category: 'nutrition', rarity: 'rare', check: (d) => d.allTimeStats.totalCalories >= 500000 },
  { id: 'calories-1m', name: 'Million Calorie Club', description: 'Log 1,000,000 total calories', icon: '🏆', category: 'nutrition', rarity: 'epic', check: (d) => d.allTimeStats.totalCalories >= 1000000 },

  // ========== PROTEIN ACHIEVEMENTS ==========
  { id: 'protein-100', name: 'Protein Starter', description: 'Log 100g of protein', icon: '🥩', category: 'nutrition', rarity: 'common', check: (d) => d.allTimeStats.totalProtein >= 100 },
  { id: 'protein-500', name: 'Protein Pack', description: 'Log 500g of protein', icon: '🥩', category: 'nutrition', rarity: 'common', check: (d) => d.allTimeStats.totalProtein >= 500 },
  { id: 'protein-1k', name: 'Kilo of Protein', description: 'Log 1,000g of protein', icon: '🥩', category: 'nutrition', rarity: 'uncommon', check: (d) => d.allTimeStats.totalProtein >= 1000 },
  { id: 'protein-5k', name: 'Protein Beast', description: 'Log 5,000g of protein', icon: '🥩', category: 'nutrition', rarity: 'rare', check: (d) => d.allTimeStats.totalProtein >= 5000 },
  { id: 'protein-10k', name: 'Protein King', description: 'Log 10,000g of protein', icon: '🥩', category: 'nutrition', rarity: 'epic', check: (d) => d.allTimeStats.totalProtein >= 10000 },
  { id: 'protein-25k', name: 'Protein God', description: 'Log 25,000g of protein', icon: '🥩', category: 'nutrition', rarity: 'legendary', check: (d) => d.allTimeStats.totalProtein >= 25000 },

  // ========== DAILY PROTEIN ACHIEVEMENTS ==========
  { id: 'daily-protein-50', name: 'Fifty Grams', description: 'Hit 50g protein in a day', icon: '💪', category: 'nutrition', rarity: 'common', check: (d) => d.todayStats.protein >= 50 },
  { id: 'daily-protein-100', name: 'Century Protein', description: 'Hit 100g protein in a day', icon: '💪', category: 'nutrition', rarity: 'common', check: (d) => d.todayStats.protein >= 100 },
  { id: 'daily-protein-150', name: 'Protein Machine', description: 'Hit 150g protein in a day', icon: '💪', category: 'nutrition', rarity: 'uncommon', check: (d) => d.todayStats.protein >= 150 },
  { id: 'daily-protein-200', name: 'Two Hundred Protein', description: 'Hit 200g protein in a day', icon: '🔥', category: 'nutrition', rarity: 'rare', check: (d) => d.todayStats.protein >= 200 },
  { id: 'daily-protein-250', name: 'Protein Overload', description: 'Hit 250g protein in a day', icon: '⚡', category: 'nutrition', rarity: 'epic', check: (d) => d.todayStats.protein >= 250 },

  // ========== WATER ACHIEVEMENTS ==========
  { id: 'water-1l', name: 'First Liter', description: 'Drink 1 liter of water total', icon: '💧', category: 'hydration', rarity: 'common', check: (d) => d.allTimeStats.totalWater >= 1000 },
  { id: 'water-10l', name: 'Ten Liters', description: 'Drink 10 liters of water total', icon: '💧', category: 'hydration', rarity: 'common', check: (d) => d.allTimeStats.totalWater >= 10000 },
  { id: 'water-50l', name: 'Fifty Liters', description: 'Drink 50 liters of water total', icon: '💧', category: 'hydration', rarity: 'uncommon', check: (d) => d.allTimeStats.totalWater >= 50000 },
  { id: 'water-100l', name: 'Hundred Liters', description: 'Drink 100 liters of water total', icon: '🌊', category: 'hydration', rarity: 'rare', check: (d) => d.allTimeStats.totalWater >= 100000 },
  { id: 'water-500l', name: 'Five Hundred Liters', description: 'Drink 500 liters of water total', icon: '🌊', category: 'hydration', rarity: 'epic', check: (d) => d.allTimeStats.totalWater >= 500000 },
  { id: 'water-1000l', name: 'Thousand Liters', description: 'Drink 1000 liters of water total', icon: '🌊', category: 'hydration', rarity: 'legendary', check: (d) => d.allTimeStats.totalWater >= 1000000 },

  // ========== DAILY WATER ACHIEVEMENTS ==========
  { id: 'daily-water-1l', name: 'Hydrated', description: 'Drink 1L water in a day', icon: '💧', category: 'hydration', rarity: 'common', check: (d) => d.todayStats.water >= 1000 },
  { id: 'daily-water-2l', name: 'Well Hydrated', description: 'Drink 2L water in a day', icon: '💧', category: 'hydration', rarity: 'common', check: (d) => d.todayStats.water >= 2000 },
  { id: 'daily-water-3l', name: 'Super Hydrated', description: 'Drink 3L water in a day', icon: '💧', category: 'hydration', rarity: 'uncommon', check: (d) => d.todayStats.water >= 3000 },
  { id: 'daily-water-4l', name: 'Hydration Master', description: 'Drink 4L water in a day', icon: '🌊', category: 'hydration', rarity: 'rare', check: (d) => d.todayStats.water >= 4000 },
  { id: 'daily-water-5l', name: 'Aqua Champion', description: 'Drink 5L water in a day', icon: '🌊', category: 'hydration', rarity: 'epic', check: (d) => d.todayStats.water >= 5000 },

  // ========== PHOTO ACHIEVEMENTS ==========
  { id: 'photos-5', name: 'Documenting Progress', description: 'Upload 5 progress photos', icon: '📸', category: 'milestone', rarity: 'common', check: (d) => d.allTimeStats.totalPhotos >= 5 },
  { id: 'photos-10', name: 'Photographer', description: 'Upload 10 progress photos', icon: '📸', category: 'milestone', rarity: 'common', check: (d) => d.allTimeStats.totalPhotos >= 10 },
  { id: 'photos-25', name: 'Visual Journey', description: 'Upload 25 progress photos', icon: '📷', category: 'milestone', rarity: 'uncommon', check: (d) => d.allTimeStats.totalPhotos >= 25 },
  { id: 'photos-50', name: 'Transformation', description: 'Upload 50 progress photos', icon: '📷', category: 'milestone', rarity: 'rare', check: (d) => d.allTimeStats.totalPhotos >= 50 },
  { id: 'photos-100', name: 'Century Pics', description: 'Upload 100 progress photos', icon: '🖼️', category: 'milestone', rarity: 'epic', check: (d) => d.allTimeStats.totalPhotos >= 100 },
  { id: 'photos-365', name: 'Year in Pictures', description: 'Upload 365 progress photos', icon: '🎬', category: 'milestone', rarity: 'legendary', check: (d) => d.allTimeStats.totalPhotos >= 365 },

  // ========== EXERCISE VARIETY ACHIEVEMENTS ==========
  { id: 'exercises-5', name: 'Getting Variety', description: 'Try 5 different exercises', icon: '🎯', category: 'workout', rarity: 'common', check: (d) => d.allTimeStats.uniqueExercises >= 5 },
  { id: 'exercises-10', name: 'Explorer', description: 'Try 10 different exercises', icon: '🎯', category: 'workout', rarity: 'common', check: (d) => d.allTimeStats.uniqueExercises >= 10 },
  { id: 'exercises-20', name: 'Diverse Training', description: 'Try 20 different exercises', icon: '🎯', category: 'workout', rarity: 'uncommon', check: (d) => d.allTimeStats.uniqueExercises >= 20 },
  { id: 'exercises-30', name: 'Exercise Collector', description: 'Try 30 different exercises', icon: '🏋️', category: 'workout', rarity: 'rare', check: (d) => d.allTimeStats.uniqueExercises >= 30 },
  { id: 'exercises-50', name: 'Movement Master', description: 'Try 50 different exercises', icon: '🏋️', category: 'workout', rarity: 'epic', check: (d) => d.allTimeStats.uniqueExercises >= 50 },
  { id: 'exercises-75', name: 'Exercise Encyclopedia', description: 'Try 75 different exercises', icon: '📚', category: 'workout', rarity: 'legendary', check: (d) => d.allTimeStats.uniqueExercises >= 75 },

  // ========== DAYS LOGGED ACHIEVEMENTS ==========
  { id: 'days-7', name: 'First Week', description: 'Log activity for 7 days', icon: '📅', category: 'consistency', rarity: 'common', check: (d) => d.allTimeStats.daysLogged >= 7 },
  { id: 'days-14', name: 'Two Weeks', description: 'Log activity for 14 days', icon: '📅', category: 'consistency', rarity: 'common', check: (d) => d.allTimeStats.daysLogged >= 14 },
  { id: 'days-30', name: 'Month Strong', description: 'Log activity for 30 days', icon: '📅', category: 'consistency', rarity: 'uncommon', check: (d) => d.allTimeStats.daysLogged >= 30 },
  { id: 'days-60', name: 'Two Months', description: 'Log activity for 60 days', icon: '📅', category: 'consistency', rarity: 'rare', check: (d) => d.allTimeStats.daysLogged >= 60 },
  { id: 'days-90', name: 'Quarter Year', description: 'Log activity for 90 days', icon: '📆', category: 'consistency', rarity: 'rare', check: (d) => d.allTimeStats.daysLogged >= 90 },
  { id: 'days-180', name: 'Half Year', description: 'Log activity for 180 days', icon: '📆', category: 'consistency', rarity: 'epic', check: (d) => d.allTimeStats.daysLogged >= 180 },
  { id: 'days-365', name: 'Year Logger', description: 'Log activity for 365 days', icon: '🗓️', category: 'consistency', rarity: 'epic', check: (d) => d.allTimeStats.daysLogged >= 365 },
  { id: 'days-500', name: 'Five Hundred Days', description: 'Log activity for 500 days', icon: '🗓️', category: 'consistency', rarity: 'legendary', check: (d) => d.allTimeStats.daysLogged >= 500 },
  { id: 'days-1000', name: 'Thousand Day Journey', description: 'Log activity for 1000 days', icon: '🏆', category: 'consistency', rarity: 'legendary', check: (d) => d.allTimeStats.daysLogged >= 1000 },

  // ========== SPECIAL DAILY ACHIEVEMENTS ==========
  { id: 'perfect-day-1', name: 'Perfect Day', description: 'Log workout, meals, and water in one day', icon: '⭐', category: 'special', rarity: 'common', 
    check: (d) => d.todayStats.workouts > 0 && d.todayStats.meals > 0 && d.todayStats.water >= 1000 },
  { id: 'monster-workout', name: 'Monster Workout', description: 'Do 20+ sets in a single day', icon: '👹', category: 'special', rarity: 'uncommon', check: (d) => d.todayStats.sets >= 20 },
  { id: 'marathon-session', name: 'Marathon Session', description: 'Log 5+ exercises in a single day', icon: '🏃', category: 'special', rarity: 'uncommon', check: (d) => d.todayStats.workouts >= 5 },
  { id: 'meal-prepper', name: 'Meal Prepper', description: 'Log 5 meals in a single day', icon: '🍱', category: 'special', rarity: 'uncommon', check: (d) => d.todayStats.meals >= 5 },
  { id: 'bulk-mode', name: 'Bulk Mode', description: 'Log 3000+ calories in a day', icon: '🍔', category: 'special', rarity: 'rare', check: (d) => d.todayStats.calories >= 3000 },
  { id: 'cut-mode', name: 'Cut Mode', description: 'Log under 1500 calories with 100g+ protein', icon: '🥗', category: 'special', rarity: 'rare', 
    check: (d) => d.todayStats.calories > 0 && d.todayStats.calories < 1500 && d.todayStats.protein >= 100 },

  // ========== MILESTONE ACHIEVEMENTS ==========
  { id: 'complete-week', name: 'Complete Week', description: 'Log every day for a full week', icon: '✅', category: 'milestone', rarity: 'uncommon', check: (d) => d.allTimeStats.longestStreak >= 7 },
  { id: 'complete-month', name: 'Complete Month', description: 'Log every day for a full month', icon: '✅', category: 'milestone', rarity: 'rare', check: (d) => d.allTimeStats.longestStreak >= 30 },
  { id: 'muscle-builder', name: 'Muscle Builder', description: 'Log 500 sets and 5000g protein', icon: '💪', category: 'milestone', rarity: 'rare', 
    check: (d) => d.allTimeStats.totalSets >= 500 && d.allTimeStats.totalProtein >= 5000 },
  { id: 'iron-will', name: 'Iron Will', description: 'Complete 100 workouts with 50k+ volume', icon: '🔩', category: 'milestone', rarity: 'epic', 
    check: (d) => d.allTimeStats.totalWorkouts >= 100 && d.allTimeStats.totalVolume >= 50000 },
  { id: 'dedication', name: 'True Dedication', description: '200 workouts, 1000 meals logged, 30 day streak', icon: '💎', category: 'milestone', rarity: 'legendary', 
    check: (d) => d.allTimeStats.totalWorkouts >= 200 && d.allTimeStats.totalMeals >= 1000 && d.allTimeStats.longestStreak >= 30 },

  // ========== SINGLE SESSION ACHIEVEMENTS ==========
  { id: 'high-reps-15', name: 'Endurance Set', description: 'Complete a set of 15+ reps', icon: '🔄', category: 'workout', rarity: 'common', check: (d) => d.allTimeStats.maxReps >= 15 },
  { id: 'high-reps-20', name: 'Twenty Reps', description: 'Complete a set of 20+ reps', icon: '🔄', category: 'workout', rarity: 'uncommon', check: (d) => d.allTimeStats.maxReps >= 20 },
  { id: 'high-reps-25', name: 'Twenty Five Reps', description: 'Complete a set of 25+ reps', icon: '🔄', category: 'workout', rarity: 'rare', check: (d) => d.allTimeStats.maxReps >= 25 },
  { id: 'high-reps-50', name: 'Fifty Rep Set', description: 'Complete a set of 50+ reps', icon: '🔥', category: 'workout', rarity: 'epic', check: (d) => d.allTimeStats.maxReps >= 50 },
  { id: 'high-reps-100', name: 'Century Set', description: 'Complete a set of 100+ reps', icon: '💯', category: 'workout', rarity: 'legendary', check: (d) => d.allTimeStats.maxReps >= 100 },

  // Generate more achievements to reach 300+
  ...generateAdditionalAchievements(),
];

function generateAdditionalAchievements(): Achievement[] {
  const additional: Achievement[] = [];
  
  // More workout milestones
  for (let i = 400; i <= 900; i += 100) {
    if (i === 500 || i === 750) continue; // Skip existing ones
    additional.push({
      id: `workout-${i}`,
      name: `${i} Workouts`,
      description: `Complete ${i} workouts`,
      icon: i >= 700 ? '👑' : '🔥',
      category: 'workout',
      rarity: i >= 700 ? 'legendary' : 'epic',
      check: (d) => d.allTimeStats.totalWorkouts >= i,
    });
  }

  // More set milestones
  [1500, 2000, 3000, 3500, 4000, 4500, 6000, 7000, 7500, 8000, 9000, 15000, 20000].forEach(count => {
    if ([1000, 2500, 5000, 10000, 25000].includes(count)) return;
    additional.push({
      id: `sets-${count}`,
      name: `${count.toLocaleString()} Sets`,
      description: `Complete ${count.toLocaleString()} total sets`,
      icon: count >= 10000 ? '🌟' : count >= 5000 ? '⚡' : '📈',
      category: 'volume',
      rarity: count >= 10000 ? 'legendary' : count >= 5000 ? 'epic' : 'rare',
      check: (d) => d.allTimeStats.totalSets >= count,
    });
  });

  // More rep milestones
  [2000, 3000, 4000, 7500, 15000, 20000, 30000, 40000, 75000].forEach(count => {
    if ([1000, 5000, 10000, 25000, 50000, 100000].includes(count)) return;
    additional.push({
      id: `reps-${count}`,
      name: `${count.toLocaleString()} Reps`,
      description: `Complete ${count.toLocaleString()} total reps`,
      icon: count >= 50000 ? '🌟' : count >= 20000 ? '⚡' : '🔄',
      category: 'volume',
      rarity: count >= 50000 ? 'legendary' : count >= 20000 ? 'epic' : 'rare',
      check: (d) => d.allTimeStats.totalReps >= count,
    });
  });

  // More volume milestones
  [15000, 20000, 30000, 35000, 40000, 45000, 75000, 150000, 200000, 300000, 400000, 750000].forEach(count => {
    if ([10000, 25000, 50000, 100000, 250000, 500000, 1000000, 2000000, 5000000].includes(count)) return;
    additional.push({
      id: `volume-${count / 1000}k`,
      name: `${(count / 1000).toLocaleString()}K Volume`,
      description: `Lift ${count.toLocaleString()} kg total`,
      icon: count >= 500000 ? '🏆' : count >= 100000 ? '🔥' : '💪',
      category: 'strength',
      rarity: count >= 500000 ? 'legendary' : count >= 100000 ? 'epic' : 'rare',
      check: (d) => d.allTimeStats.totalVolume >= count,
    });
  });

  // More streak achievements
  [10, 25, 35, 40, 50, 55, 65, 70, 75, 80, 85, 100, 120, 150].forEach(days => {
    if ([3, 5, 7, 14, 21, 30, 45, 60, 90, 180, 365].includes(days)) return;
    additional.push({
      id: `streak-${days}`,
      name: `${days} Day Streak`,
      description: `Work out ${days} days in a row`,
      icon: days >= 100 ? '👑' : days >= 50 ? '🏆' : '⚡',
      category: 'consistency',
      rarity: days >= 100 ? 'legendary' : days >= 50 ? 'epic' : 'rare',
      check: (d) => d.allTimeStats.currentStreak >= days || d.allTimeStats.longestStreak >= days,
    });
  });

  // More meal achievements
  [15, 35, 75, 150, 200, 350, 400, 600, 750, 800, 900].forEach(count => {
    if ([5, 10, 25, 50, 100, 250, 500, 1000, 2500].includes(count)) return;
    additional.push({
      id: `meals-${count}`,
      name: `${count} Meals Logged`,
      description: `Log ${count} meals`,
      icon: count >= 500 ? '🏆' : count >= 200 ? '🎯' : '🍽️',
      category: 'nutrition',
      rarity: count >= 500 ? 'epic' : count >= 200 ? 'rare' : 'uncommon',
      check: (d) => d.allTimeStats.totalMeals >= count,
    });
  });

  // More water achievements
  [5000, 15000, 20000, 25000, 30000, 40000, 75000, 150000, 200000, 250000, 300000, 400000, 750000].forEach(ml => {
    if ([1000, 10000, 50000, 100000, 500000, 1000000].includes(ml)) return;
    const liters = ml / 1000;
    additional.push({
      id: `water-${liters}l`,
      name: `${liters}L Total Water`,
      description: `Drink ${liters} liters of water total`,
      icon: liters >= 500 ? '🌊' : liters >= 100 ? '💧' : '💧',
      category: 'hydration',
      rarity: liters >= 500 ? 'legendary' : liters >= 100 ? 'epic' : liters >= 30 ? 'rare' : 'uncommon',
      check: (d) => d.allTimeStats.totalWater >= ml,
    });
  });

  // Weight milestones in increments
  [30, 50, 70, 90, 110, 130, 150, 170, 190, 220, 240, 260, 280].forEach(weight => {
    if ([20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 250, 300].includes(weight)) return;
    additional.push({
      id: `max-weight-${weight}`,
      name: `${weight}kg Lift`,
      description: `Lift ${weight} kg on a single set`,
      icon: weight >= 200 ? '👑' : weight >= 150 ? '⚡' : '💪',
      category: 'strength',
      rarity: weight >= 200 ? 'legendary' : weight >= 150 ? 'epic' : weight >= 100 ? 'rare' : 'uncommon',
      check: (d) => d.allTimeStats.maxWeight >= weight,
    });
  });

  // More calorie milestones
  [25000, 75000, 150000, 200000, 300000, 350000, 400000, 450000, 600000, 750000, 800000, 900000].forEach(cal => {
    if ([10000, 50000, 100000, 250000, 500000, 1000000].includes(cal)) return;
    additional.push({
      id: `calories-${cal / 1000}k`,
      name: `${(cal / 1000).toLocaleString()}K Calories`,
      description: `Log ${cal.toLocaleString()} total calories`,
      icon: cal >= 500000 ? '🏆' : cal >= 200000 ? '⚡' : '🔥',
      category: 'nutrition',
      rarity: cal >= 500000 ? 'legendary' : cal >= 200000 ? 'epic' : 'rare',
      check: (d) => d.allTimeStats.totalCalories >= cal,
    });
  });

  // More protein achievements
  [250, 750, 1500, 2000, 2500, 3000, 3500, 4000, 6000, 7500, 8000, 9000, 15000, 20000].forEach(g => {
    if ([100, 500, 1000, 5000, 10000, 25000].includes(g)) return;
    additional.push({
      id: `protein-${g}`,
      name: `${g.toLocaleString()}g Protein`,
      description: `Log ${g.toLocaleString()}g of protein`,
      icon: g >= 10000 ? '👑' : g >= 5000 ? '🥩' : '🥩',
      category: 'nutrition',
      rarity: g >= 10000 ? 'legendary' : g >= 5000 ? 'epic' : g >= 2000 ? 'rare' : 'uncommon',
      check: (d) => d.allTimeStats.totalProtein >= g,
    });
  });

  // More photo achievements
  [15, 20, 30, 35, 40, 45, 75, 100, 150, 200, 250, 300].forEach(count => {
    if ([5, 10, 25, 50, 365].includes(count)) return;
    additional.push({
      id: `photos-${count}`,
      name: `${count} Progress Photos`,
      description: `Upload ${count} progress photos`,
      icon: count >= 200 ? '🎬' : count >= 100 ? '🖼️' : '📷',
      category: 'milestone',
      rarity: count >= 200 ? 'legendary' : count >= 100 ? 'epic' : count >= 50 ? 'rare' : 'uncommon',
      check: (d) => d.allTimeStats.totalPhotos >= count,
    });
  });

  // More exercise variety
  [15, 25, 35, 40, 45, 60, 70, 80, 90, 100].forEach(count => {
    if ([5, 10, 20, 30, 50, 75].includes(count)) return;
    additional.push({
      id: `exercises-${count}`,
      name: `${count} Exercises`,
      description: `Try ${count} different exercises`,
      icon: count >= 75 ? '📚' : count >= 50 ? '🏋️' : '🎯',
      category: 'workout',
      rarity: count >= 75 ? 'legendary' : count >= 50 ? 'epic' : count >= 30 ? 'rare' : 'uncommon',
      check: (d) => d.allTimeStats.uniqueExercises >= count,
    });
  });

  // More day logged achievements
  [21, 45, 75, 100, 120, 150, 200, 250, 300, 400, 450, 600, 700, 750, 800, 900].forEach(days => {
    if ([7, 14, 30, 60, 90, 180, 365, 500, 1000].includes(days)) return;
    additional.push({
      id: `days-${days}`,
      name: `${days} Days Logged`,
      description: `Log activity for ${days} days`,
      icon: days >= 500 ? '🏆' : days >= 200 ? '🗓️' : '📆',
      category: 'consistency',
      rarity: days >= 500 ? 'legendary' : days >= 200 ? 'epic' : days >= 100 ? 'rare' : 'uncommon',
      check: (d) => d.allTimeStats.daysLogged >= days,
    });
  });

  // Special combo achievements
  const specialCombos: Achievement[] = [
    { id: 'morning-warrior', name: 'Consistent Logger', description: 'Log 50 days with both workout and meals', icon: '🌅', category: 'special', rarity: 'rare',
      check: (d) => {
        let count = 0;
        Object.values(d.logs).forEach(log => {
          if (log.workouts.length > 0 && log.meals.length > 0) count++;
        });
        return count >= 50;
      }
    },
    { id: 'hydration-streak-7', name: 'Hydration Week', description: 'Hit 2L+ water for 7 days straight', icon: '💧', category: 'special', rarity: 'rare',
      check: (d) => d.allTimeStats.daysLogged >= 7 && d.allTimeStats.totalWater >= 14000 },
    { id: 'balanced-life', name: 'Balanced Life', description: 'Log 100 days with workout, meals, and 2L water', icon: '⚖️', category: 'special', rarity: 'epic',
      check: (d) => {
        let count = 0;
        Object.values(d.logs).forEach(log => {
          if (log.workouts.length > 0 && log.meals.length > 0 && log.waterIntake >= 2000) count++;
        });
        return count >= 100;
      }
    },
    { id: 'all-rounder', name: 'All Rounder', description: 'Try 50+ exercises, log 500+ meals', icon: '🎖️', category: 'special', rarity: 'epic',
      check: (d) => d.allTimeStats.uniqueExercises >= 50 && d.allTimeStats.totalMeals >= 500 },
    { id: 'volume-king', name: 'Volume King', description: 'Lift 500k+ kg with 200+ workouts', icon: '👑', category: 'special', rarity: 'legendary',
      check: (d) => d.allTimeStats.totalVolume >= 500000 && d.allTimeStats.totalWorkouts >= 200 },
    { id: 'nutrition-master', name: 'Nutrition Master', description: 'Log 2000 meals with 50k+ protein', icon: '🥇', category: 'special', rarity: 'legendary',
      check: (d) => d.allTimeStats.totalMeals >= 2000 && d.allTimeStats.totalProtein >= 50000 },
    { id: 'ultimate-dedication', name: 'Ultimate Dedication', description: '500 workouts, 90 day streak, 1M volume', icon: '🌟', category: 'special', rarity: 'legendary',
      check: (d) => d.allTimeStats.totalWorkouts >= 500 && d.allTimeStats.longestStreak >= 90 && d.allTimeStats.totalVolume >= 1000000 },
  ];

  return [...additional, ...specialCombos];
}

// Helper to calculate stats from logs
export function calculateAchievementStats(logs: Record<string, DailyLog>, currentLog: DailyLog): AchievementCheckData {
  const allTimeStats = {
    totalWorkouts: 0,
    totalSets: 0,
    totalReps: 0,
    totalVolume: 0,
    totalMeals: 0,
    totalCalories: 0,
    totalProtein: 0,
    totalWater: 0,
    totalPhotos: 0,
    maxWeight: 0,
    maxReps: 0,
    maxVolumeSingleDay: 0,
    longestStreak: 0,
    currentStreak: 0,
    uniqueExercises: 0,
    daysLogged: 0,
  };

  const exerciseSet = new Set<string>();
  const sortedDates = Object.keys(logs).sort().reverse();
  
  // Calculate current streak
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    const dateStr = checkDate.toISOString().split('T')[0];
    const log = logs[dateStr];
    if (log && (log.workouts.length > 0 || log.meals.length > 0 || log.waterIntake > 0)) {
      if (i === 0 || streak > 0) streak++;
    } else if (i > 0) {
      break;
    }
  }
  allTimeStats.currentStreak = streak;

  // Calculate longest streak
  let maxStreak = 0;
  let currentStreakCount = 0;
  for (let i = sortedDates.length - 1; i >= 0; i--) {
    const log = logs[sortedDates[i]];
    if (log && (log.workouts.length > 0 || log.meals.length > 0 || log.waterIntake > 0)) {
      currentStreakCount++;
      maxStreak = Math.max(maxStreak, currentStreakCount);
    } else {
      currentStreakCount = 0;
    }
  }
  allTimeStats.longestStreak = Math.max(maxStreak, allTimeStats.currentStreak);

  // Calculate all-time stats
  Object.values(logs).forEach(log => {
    if (log.workouts.length > 0 || log.meals.length > 0 || log.waterIntake > 0) {
      allTimeStats.daysLogged++;
    }

    allTimeStats.totalWorkouts += log.workouts.length;
    allTimeStats.totalMeals += log.meals.length;
    allTimeStats.totalWater += log.waterIntake;
    allTimeStats.totalPhotos += log.postWorkoutImages.length;

    let dayVolume = 0;
    log.workouts.forEach(workout => {
      exerciseSet.add(workout.exerciseId);
      workout.sets.forEach(set => {
        allTimeStats.totalSets++;
        allTimeStats.totalReps += set.reps;
        allTimeStats.totalVolume += set.weight * set.reps;
        dayVolume += set.weight * set.reps;
        allTimeStats.maxWeight = Math.max(allTimeStats.maxWeight, set.weight);
        allTimeStats.maxReps = Math.max(allTimeStats.maxReps, set.reps);
      });
    });
    allTimeStats.maxVolumeSingleDay = Math.max(allTimeStats.maxVolumeSingleDay, dayVolume);

    log.meals.forEach(meal => {
      allTimeStats.totalCalories += meal.calories;
      allTimeStats.totalProtein += meal.protein;
    });
  });

  allTimeStats.uniqueExercises = exerciseSet.size;

  // Calculate today's stats
  let todayVolume = 0;
  let todayReps = 0;
  currentLog.workouts.forEach(workout => {
    workout.sets.forEach(set => {
      todayVolume += set.weight * set.reps;
      todayReps += set.reps;
    });
  });

  const todayStats = {
    workouts: currentLog.workouts.length,
    sets: currentLog.workouts.reduce((sum, w) => sum + w.sets.length, 0),
    reps: todayReps,
    volume: todayVolume,
    meals: currentLog.meals.length,
    calories: currentLog.meals.reduce((sum, m) => sum + m.calories, 0),
    protein: currentLog.meals.reduce((sum, m) => sum + m.protein, 0),
    water: currentLog.waterIntake,
    photos: currentLog.postWorkoutImages.length,
  };

  return { logs, currentLog, allTimeStats, todayStats };
}

// Check for new achievements
export function checkNewAchievements(
  data: AchievementCheckData,
  unlockedAchievements: UnlockedAchievement[]
): Achievement[] {
  const unlockedIds = new Set(unlockedAchievements.map(a => a.id));
  const newlyUnlocked: Achievement[] = [];

  ACHIEVEMENTS.forEach(achievement => {
    if (!unlockedIds.has(achievement.id)) {
      try {
        if (achievement.check(data)) {
          newlyUnlocked.push(achievement);
        }
      } catch {
        // Skip if check fails
      }
    }
  });

  return newlyUnlocked;
}

export const RARITY_COLORS = {
  common: { bg: 'bg-slate-500/20', border: 'border-slate-500/30', text: 'text-slate-400' },
  uncommon: { bg: 'bg-green-500/20', border: 'border-green-500/30', text: 'text-green-400' },
  rare: { bg: 'bg-blue-500/20', border: 'border-blue-500/30', text: 'text-blue-400' },
  epic: { bg: 'bg-purple-500/20', border: 'border-purple-500/30', text: 'text-purple-400' },
  legendary: { bg: 'bg-amber-500/20', border: 'border-amber-500/30', text: 'text-amber-400' },
};
