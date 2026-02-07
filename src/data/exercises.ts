import { Exercise } from '@/types';

export const EXERCISES: Exercise[] = [
  // Chest
  { id: 'bench-press', name: 'Bench Press', muscleGroup: 'Chest', category: 'Compound' },
  { id: 'incline-bench-press', name: 'Incline Bench Press', muscleGroup: 'Chest', category: 'Compound' },
  { id: 'decline-bench-press', name: 'Decline Bench Press', muscleGroup: 'Chest', category: 'Compound' },
  { id: 'dumbbell-bench-press', name: 'Dumbbell Bench Press', muscleGroup: 'Chest', category: 'Compound' },
  { id: 'incline-dumbbell-press', name: 'Incline Dumbbell Press', muscleGroup: 'Chest', category: 'Compound' },
  { id: 'dumbbell-flyes', name: 'Dumbbell Flyes', muscleGroup: 'Chest', category: 'Isolation' },
  { id: 'cable-crossover', name: 'Cable Crossover', muscleGroup: 'Chest', category: 'Isolation' },
  { id: 'pec-deck', name: 'Pec Deck', muscleGroup: 'Chest', category: 'Isolation' },
  { id: 'push-ups', name: 'Push Ups', muscleGroup: 'Chest', category: 'Bodyweight' },
  { id: 'chest-dips', name: 'Chest Dips', muscleGroup: 'Chest', category: 'Compound' },
  { id: 'machine-chest-press', name: 'Machine Chest Press', muscleGroup: 'Chest', category: 'Machine' },
  { id: 'landmine-press', name: 'Landmine Press', muscleGroup: 'Chest', category: 'Compound' },

  // Back
  { id: 'deadlift', name: 'Deadlift', muscleGroup: 'Back', category: 'Compound' },
  { id: 'pull-ups', name: 'Pull Ups', muscleGroup: 'Back', category: 'Compound' },
  { id: 'chin-ups', name: 'Chin Ups', muscleGroup: 'Back', category: 'Compound' },
  { id: 'lat-pulldown', name: 'Lat Pulldown', muscleGroup: 'Back', category: 'Compound' },
  { id: 'barbell-row', name: 'Barbell Row', muscleGroup: 'Back', category: 'Compound' },
  { id: 'dumbbell-row', name: 'Dumbbell Row', muscleGroup: 'Back', category: 'Compound' },
  { id: 'cable-row', name: 'Cable Row', muscleGroup: 'Back', category: 'Compound' },
  { id: 't-bar-row', name: 'T-Bar Row', muscleGroup: 'Back', category: 'Compound' },
  { id: 'seated-row', name: 'Seated Row', muscleGroup: 'Back', category: 'Machine' },
  { id: 'face-pulls', name: 'Face Pulls', muscleGroup: 'Back', category: 'Isolation' },
  { id: 'straight-arm-pulldown', name: 'Straight Arm Pulldown', muscleGroup: 'Back', category: 'Isolation' },
  { id: 'rack-pulls', name: 'Rack Pulls', muscleGroup: 'Back', category: 'Compound' },
  { id: 'pendlay-row', name: 'Pendlay Row', muscleGroup: 'Back', category: 'Compound' },
  { id: 'meadows-row', name: 'Meadows Row', muscleGroup: 'Back', category: 'Compound' },

  // Shoulders
  { id: 'overhead-press', name: 'Overhead Press', muscleGroup: 'Shoulders', category: 'Compound' },
  { id: 'dumbbell-shoulder-press', name: 'Dumbbell Shoulder Press', muscleGroup: 'Shoulders', category: 'Compound' },
  { id: 'arnold-press', name: 'Arnold Press', muscleGroup: 'Shoulders', category: 'Compound' },
  { id: 'lateral-raises', name: 'Lateral Raises', muscleGroup: 'Shoulders', category: 'Isolation' },
  { id: 'front-raises', name: 'Front Raises', muscleGroup: 'Shoulders', category: 'Isolation' },
  { id: 'rear-delt-flyes', name: 'Rear Delt Flyes', muscleGroup: 'Shoulders', category: 'Isolation' },
  { id: 'upright-rows', name: 'Upright Rows', muscleGroup: 'Shoulders', category: 'Compound' },
  { id: 'shrugs', name: 'Shrugs', muscleGroup: 'Shoulders', category: 'Isolation' },
  { id: 'machine-shoulder-press', name: 'Machine Shoulder Press', muscleGroup: 'Shoulders', category: 'Machine' },
  { id: 'cable-lateral-raises', name: 'Cable Lateral Raises', muscleGroup: 'Shoulders', category: 'Isolation' },
  { id: 'reverse-pec-deck', name: 'Reverse Pec Deck', muscleGroup: 'Shoulders', category: 'Isolation' },

  // Biceps
  { id: 'barbell-curl', name: 'Barbell Curl', muscleGroup: 'Biceps', category: 'Isolation' },
  { id: 'dumbbell-curl', name: 'Dumbbell Curl', muscleGroup: 'Biceps', category: 'Isolation' },
  { id: 'hammer-curl', name: 'Hammer Curl', muscleGroup: 'Biceps', category: 'Isolation' },
  { id: 'preacher-curl', name: 'Preacher Curl', muscleGroup: 'Biceps', category: 'Isolation' },
  { id: 'concentration-curl', name: 'Concentration Curl', muscleGroup: 'Biceps', category: 'Isolation' },
  { id: 'cable-curl', name: 'Cable Curl', muscleGroup: 'Biceps', category: 'Isolation' },
  { id: 'incline-dumbbell-curl', name: 'Incline Dumbbell Curl', muscleGroup: 'Biceps', category: 'Isolation' },
  { id: 'spider-curl', name: 'Spider Curl', muscleGroup: 'Biceps', category: 'Isolation' },
  { id: 'ez-bar-curl', name: 'EZ Bar Curl', muscleGroup: 'Biceps', category: 'Isolation' },
  { id: 'reverse-curl', name: 'Reverse Curl', muscleGroup: 'Biceps', category: 'Isolation' },

  // Triceps
  { id: 'close-grip-bench', name: 'Close Grip Bench Press', muscleGroup: 'Triceps', category: 'Compound' },
  { id: 'tricep-pushdown', name: 'Tricep Pushdown', muscleGroup: 'Triceps', category: 'Isolation' },
  { id: 'rope-pushdown', name: 'Rope Pushdown', muscleGroup: 'Triceps', category: 'Isolation' },
  { id: 'skull-crushers', name: 'Skull Crushers', muscleGroup: 'Triceps', category: 'Isolation' },
  { id: 'overhead-tricep-extension', name: 'Overhead Tricep Extension', muscleGroup: 'Triceps', category: 'Isolation' },
  { id: 'dumbbell-kickbacks', name: 'Dumbbell Kickbacks', muscleGroup: 'Triceps', category: 'Isolation' },
  { id: 'tricep-dips', name: 'Tricep Dips', muscleGroup: 'Triceps', category: 'Compound' },
  { id: 'diamond-push-ups', name: 'Diamond Push Ups', muscleGroup: 'Triceps', category: 'Bodyweight' },
  { id: 'jm-press', name: 'JM Press', muscleGroup: 'Triceps', category: 'Compound' },

  // Forearms
  { id: 'wrist-curls', name: 'Wrist Curls', muscleGroup: 'Forearms', category: 'Isolation' },
  { id: 'reverse-wrist-curls', name: 'Reverse Wrist Curls', muscleGroup: 'Forearms', category: 'Isolation' },
  { id: 'farmers-walk', name: 'Farmers Walk', muscleGroup: 'Forearms', category: 'Compound' },
  { id: 'plate-pinch', name: 'Plate Pinch', muscleGroup: 'Forearms', category: 'Isolation' },

  // Core
  { id: 'crunches', name: 'Crunches', muscleGroup: 'Core', category: 'Bodyweight' },
  { id: 'planks', name: 'Planks', muscleGroup: 'Core', category: 'Bodyweight' },
  { id: 'hanging-leg-raises', name: 'Hanging Leg Raises', muscleGroup: 'Core', category: 'Bodyweight' },
  { id: 'cable-crunches', name: 'Cable Crunches', muscleGroup: 'Core', category: 'Isolation' },
  { id: 'ab-wheel-rollout', name: 'Ab Wheel Rollout', muscleGroup: 'Core', category: 'Bodyweight' },
  { id: 'russian-twists', name: 'Russian Twists', muscleGroup: 'Core', category: 'Bodyweight' },
  { id: 'mountain-climbers', name: 'Mountain Climbers', muscleGroup: 'Core', category: 'Bodyweight' },
  { id: 'dead-bug', name: 'Dead Bug', muscleGroup: 'Core', category: 'Bodyweight' },
  { id: 'woodchoppers', name: 'Woodchoppers', muscleGroup: 'Core', category: 'Isolation' },
  { id: 'decline-sit-ups', name: 'Decline Sit Ups', muscleGroup: 'Core', category: 'Bodyweight' },

  // Quads
  { id: 'squats', name: 'Squats', muscleGroup: 'Quads', category: 'Compound' },
  { id: 'front-squats', name: 'Front Squats', muscleGroup: 'Quads', category: 'Compound' },
  { id: 'leg-press', name: 'Leg Press', muscleGroup: 'Quads', category: 'Compound' },
  { id: 'hack-squat', name: 'Hack Squat', muscleGroup: 'Quads', category: 'Compound' },
  { id: 'leg-extension', name: 'Leg Extension', muscleGroup: 'Quads', category: 'Isolation' },
  { id: 'walking-lunges', name: 'Walking Lunges', muscleGroup: 'Quads', category: 'Compound' },
  { id: 'bulgarian-split-squat', name: 'Bulgarian Split Squat', muscleGroup: 'Quads', category: 'Compound' },
  { id: 'goblet-squat', name: 'Goblet Squat', muscleGroup: 'Quads', category: 'Compound' },
  { id: 'sissy-squat', name: 'Sissy Squat', muscleGroup: 'Quads', category: 'Isolation' },
  { id: 'step-ups', name: 'Step Ups', muscleGroup: 'Quads', category: 'Compound' },

  // Hamstrings
  { id: 'romanian-deadlift', name: 'Romanian Deadlift', muscleGroup: 'Hamstrings', category: 'Compound' },
  { id: 'stiff-leg-deadlift', name: 'Stiff Leg Deadlift', muscleGroup: 'Hamstrings', category: 'Compound' },
  { id: 'lying-leg-curl', name: 'Lying Leg Curl', muscleGroup: 'Hamstrings', category: 'Isolation' },
  { id: 'seated-leg-curl', name: 'Seated Leg Curl', muscleGroup: 'Hamstrings', category: 'Isolation' },
  { id: 'good-mornings', name: 'Good Mornings', muscleGroup: 'Hamstrings', category: 'Compound' },
  { id: 'nordic-curl', name: 'Nordic Curl', muscleGroup: 'Hamstrings', category: 'Bodyweight' },
  { id: 'glute-ham-raise', name: 'Glute Ham Raise', muscleGroup: 'Hamstrings', category: 'Compound' },

  // Glutes
  { id: 'hip-thrust', name: 'Hip Thrust', muscleGroup: 'Glutes', category: 'Compound' },
  { id: 'glute-bridge', name: 'Glute Bridge', muscleGroup: 'Glutes', category: 'Isolation' },
  { id: 'cable-kickbacks', name: 'Cable Kickbacks', muscleGroup: 'Glutes', category: 'Isolation' },
  { id: 'sumo-deadlift', name: 'Sumo Deadlift', muscleGroup: 'Glutes', category: 'Compound' },
  { id: 'hip-abduction', name: 'Hip Abduction', muscleGroup: 'Glutes', category: 'Isolation' },
  { id: 'donkey-kicks', name: 'Donkey Kicks', muscleGroup: 'Glutes', category: 'Bodyweight' },
  { id: 'fire-hydrants', name: 'Fire Hydrants', muscleGroup: 'Glutes', category: 'Bodyweight' },

  // Calves
  { id: 'standing-calf-raise', name: 'Standing Calf Raise', muscleGroup: 'Calves', category: 'Isolation' },
  { id: 'seated-calf-raise', name: 'Seated Calf Raise', muscleGroup: 'Calves', category: 'Isolation' },
  { id: 'leg-press-calf-raise', name: 'Leg Press Calf Raise', muscleGroup: 'Calves', category: 'Isolation' },
  { id: 'donkey-calf-raise', name: 'Donkey Calf Raise', muscleGroup: 'Calves', category: 'Isolation' },

  // Full Body
  { id: 'clean-and-jerk', name: 'Clean and Jerk', muscleGroup: 'Full Body', category: 'Olympic' },
  { id: 'snatch', name: 'Snatch', muscleGroup: 'Full Body', category: 'Olympic' },
  { id: 'power-clean', name: 'Power Clean', muscleGroup: 'Full Body', category: 'Olympic' },
  { id: 'thrusters', name: 'Thrusters', muscleGroup: 'Full Body', category: 'Compound' },
  { id: 'burpees', name: 'Burpees', muscleGroup: 'Full Body', category: 'Bodyweight' },
  { id: 'kettlebell-swings', name: 'Kettlebell Swings', muscleGroup: 'Full Body', category: 'Compound' },
  { id: 'turkish-get-up', name: 'Turkish Get Up', muscleGroup: 'Full Body', category: 'Compound' },
  { id: 'man-makers', name: 'Man Makers', muscleGroup: 'Full Body', category: 'Compound' },

  // Cardio
  { id: 'running', name: 'Running', muscleGroup: 'Cardio', category: 'Cardio' },
  { id: 'cycling', name: 'Cycling', muscleGroup: 'Cardio', category: 'Cardio' },
  { id: 'rowing', name: 'Rowing', muscleGroup: 'Cardio', category: 'Cardio' },
  { id: 'stair-climber', name: 'Stair Climber', muscleGroup: 'Cardio', category: 'Cardio' },
  { id: 'elliptical', name: 'Elliptical', muscleGroup: 'Cardio', category: 'Cardio' },
  { id: 'jump-rope', name: 'Jump Rope', muscleGroup: 'Cardio', category: 'Cardio' },
  { id: 'swimming', name: 'Swimming', muscleGroup: 'Cardio', category: 'Cardio' },
  { id: 'hiking', name: 'Hiking', muscleGroup: 'Cardio', category: 'Cardio' },
  { id: 'battle-ropes', name: 'Battle Ropes', muscleGroup: 'Cardio', category: 'Cardio' },
  { id: 'box-jumps', name: 'Box Jumps', muscleGroup: 'Cardio', category: 'Cardio' },
];

export const getExercisesByMuscleGroup = (muscleGroup: string): Exercise[] => {
  return EXERCISES.filter(e => e.muscleGroup === muscleGroup);
};

export const getExerciseById = (id: string): Exercise | undefined => {
  return EXERCISES.find(e => e.id === id);
};
