export interface UserProfile {
  name: string;
  username?: string; // unique username for social features
  bio?: string;
  height: number; // cm
  weight: number; // kg
  startingWeight?: number; // kg - when user started tracking
  goalWeight?: number; // kg - target weight
  age: number;
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'heavy_cut' | 'normal_cut' | 'light_cut' | 'maintain' | 'light_bulk' | 'normal_bulk' | 'heavy_bulk';
  // Privacy settings
  privacy?: {
    showWorkouts: boolean;
    showNutrition: boolean;
    showPhotos: boolean;
    showStats: boolean;
  };
}

// Gemini API key stored separately from profile
export interface AppSettings {
  geminiApiKey?: string;
}

export interface Split {
  id: string;
  name: string;
  days: SplitDay[];
  isCustom: boolean;
}

export interface SplitDay {
  dayOfWeek: number; // 0-6, Sunday-Saturday
  muscleGroups: string[];
  label: string;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  category: string;
}

export interface ExerciseSet {
  reps: number;
  weight: number;
}

export interface WorkoutExercise {
  exerciseId: string;
  exerciseName: string;
  sets: ExerciseSet[];
}

export interface Meal {
  id: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  workouts: WorkoutExercise[];
  meals: Meal[];
  waterIntake: number; // ml
  postWorkoutImages: string[]; // base64 strings
  notes: string;
}

export type TabType = 'today' | 'log' | 'history' | 'profile';

export const MUSCLE_GROUPS = [
  'Chest',
  'Back',
  'Shoulders',
  'Biceps',
  'Triceps',
  'Forearms',
  'Core',
  'Quads',
  'Hamstrings',
  'Glutes',
  'Calves',
  'Full Body',
  'Cardio',
  'Rest'
] as const;

export const GOAL_MODIFIERS: Record<UserProfile['goal'], { label: string; modifier: number }> = {
  heavy_cut: { label: 'Heavy Cut', modifier: -750 },
  normal_cut: { label: 'Normal Cut', modifier: -500 },
  light_cut: { label: 'Light Cut', modifier: -250 },
  maintain: { label: 'Maintain', modifier: 0 },
  light_bulk: { label: 'Light Bulk', modifier: 250 },
  normal_bulk: { label: 'Normal Bulk', modifier: 500 },
  heavy_bulk: { label: 'Heavy Bulk', modifier: 750 },
};

export const ACTIVITY_MULTIPLIERS: Record<UserProfile['activityLevel'], { label: string; multiplier: number }> = {
  sedentary: { label: 'Sedentary (desk job)', multiplier: 1.2 },
  light: { label: 'Lightly Active (1-2 days/week)', multiplier: 1.375 },
  moderate: { label: 'Moderately Active (3-5 days/week)', multiplier: 1.55 },
  active: { label: 'Very Active (6-7 days/week)', multiplier: 1.725 },
  very_active: { label: 'Extremely Active (athlete)', multiplier: 1.9 },
};
