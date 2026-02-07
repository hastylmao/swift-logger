import { useState, useRef } from 'react';
import { format, getDay } from 'date-fns';
import { 
  Dumbbell, 
  Utensils, 
  Droplets, 
  Camera, 
  Plus, 
  Minus, 
  X, 
  ChevronDown,
  ChevronUp,
  Trash2,
  Zap,
  Target,
  Flame,
  Search,
  MessageSquare,
  Image as ImageIcon,
  Edit3
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { EXERCISES, getExercisesByMuscleGroup } from '@/data/exercises';
import { analyzeNutrition } from '@/utils/nutritionAI';
import { parseWorkoutDescription } from '@/utils/workoutAI';
import { WorkoutExercise, ExerciseSet, Meal, MUSCLE_GROUPS } from '@/types';
import { cn } from '@/utils/cn';

export function TodayView() {
  const today = format(new Date(), 'yyyy-MM-dd');
  const dayOfWeek = getDay(new Date());
  
  const { 
    profile, 
    activeSplit, 
    getLog, 
    addWorkoutExercise,
    removeWorkoutExercise,
    addMeal,
    removeMeal,
    addWater,
    setWater,
    addPostWorkoutImage,
    removePostWorkoutImage,
    calculateTargetCalories,
    calculateWaterGoal
  } = useStore();
  
  const log = getLog(today);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [showMealModal, setShowMealModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    workout: true,
    nutrition: true,
    water: true,
    photos: false,
  });
  
  const targetCalories = calculateTargetCalories();
  const waterGoal = calculateWaterGoal();
  
  const todaysSplit = activeSplit?.days.find(d => d.dayOfWeek === dayOfWeek);
  
  const totalMacros = log.meals.reduce((acc, meal) => ({
    calories: acc.calories + meal.calories,
    protein: acc.protein + meal.protein,
    carbs: acc.carbs + meal.carbs,
    fat: acc.fat + meal.fat,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        addPostWorkoutImage(today, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Status Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-5 border border-cyan-500/20 shadow-lg shadow-cyan-500/5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-cyan-400 text-sm font-medium">
              {format(new Date(), 'EEEE, MMMM d')}
            </p>
            <h2 className="text-white text-2xl font-bold mt-1">
              {profile?.name ? `Hey, ${profile.name.split(' ')[0]}` : 'Daily Status'}
            </h2>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
        </div>
        
        {todaysSplit && (
          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Today's Focus</p>
            <p className="text-white font-semibold">{todaysSplit.label}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {todaysSplit.muscleGroups.map((group) => (
                <span 
                  key={group}
                  className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-xs rounded-full border border-cyan-500/20"
                >
                  {group}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {!activeSplit && (
          <p className="text-slate-400 text-sm">Set up your workout split in Profile</p>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-900 rounded-xl p-3 border border-slate-800">
          <Flame className="w-5 h-5 text-orange-400 mb-1" />
          <p className="text-2xl font-bold text-white">{totalMacros.calories}</p>
          <p className="text-xs text-slate-400">/ {targetCalories} kcal</p>
        </div>
        <div className="bg-slate-900 rounded-xl p-3 border border-slate-800">
          <Target className="w-5 h-5 text-purple-400 mb-1" />
          <p className="text-2xl font-bold text-white">{Math.round(totalMacros.protein)}g</p>
          <p className="text-xs text-slate-400">Protein</p>
        </div>
        <div className="bg-slate-900 rounded-xl p-3 border border-slate-800">
          <Droplets className="w-5 h-5 text-blue-400 mb-1" />
          <p className="text-2xl font-bold text-white">{(log.waterIntake / 1000).toFixed(1)}L</p>
          <p className="text-xs text-slate-400">/ {(waterGoal / 1000).toFixed(1)}L</p>
        </div>
      </div>

      {/* Goal Weight Progress */}
      {profile?.goalWeight && profile?.startingWeight && profile.goalWeight !== profile.weight && (
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl p-4 border border-cyan-500/20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold">Weight Goal Progress</h3>
            <span className="text-cyan-400 text-sm font-medium">
              {(() => {
                const start = profile.startingWeight;
                const current = profile.weight;
                const goal = profile.goalWeight;
                const totalChange = Math.abs(goal - start);
                const currentChange = Math.abs(current - start);
                const isCorrectDirection = (goal > start && current >= start) || (goal < start && current <= start);
                if (!isCorrectDirection || totalChange === 0) return '0%';
                const progress = Math.min((currentChange / totalChange) * 100, 100);
                return `${Math.round(progress)}%`;
              })()}
            </span>
          </div>
          
          <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden mb-3">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
              style={{ 
                width: `${(() => {
                  const start = profile.startingWeight;
                  const current = profile.weight;
                  const goal = profile.goalWeight;
                  const totalChange = Math.abs(goal - start);
                  const currentChange = Math.abs(current - start);
                  const isCorrectDirection = (goal > start && current >= start) || (goal < start && current <= start);
                  if (!isCorrectDirection || totalChange === 0) return 0;
                  return Math.min((currentChange / totalChange) * 100, 100);
                })()}%` 
              }}
            />
          </div>
          
          <div className="flex justify-between text-sm">
            <div className="text-center">
              <p className="text-slate-400 text-xs">Started</p>
              <p className="text-white font-medium">{profile.startingWeight} kg</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-xs">Current</p>
              <p className="text-cyan-400 font-bold">{profile.weight} kg</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-xs">Goal</p>
              <p className="text-white font-medium">{profile.goalWeight} kg</p>
            </div>
          </div>
          
          <div className="mt-3 text-center">
            <p className="text-slate-400 text-sm">
              {Math.abs(profile.goalWeight - profile.weight).toFixed(1)} kg to go
              {profile.goalWeight > profile.weight ? ' (gaining)' : ' (losing)'}
            </p>
          </div>
        </div>
      )}

      {/* Workout Section */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <button
          onClick={() => toggleSection('workout')}
          className="w-full flex items-center justify-between p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-white font-semibold">Workout</h3>
              <p className="text-slate-400 text-sm">{log.workouts.length} exercises logged</p>
            </div>
          </div>
          {expandedSections.workout ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>
        
        {expandedSections.workout && (
          <div className="px-4 pb-4 space-y-3">
            {log.workouts.map((exercise, idx) => (
              <div 
                key={idx} 
                className="bg-slate-800/50 rounded-lg p-3 border border-slate-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium">{exercise.exerciseName}</h4>
                  <button 
                    onClick={() => removeWorkoutExercise(today, idx)}
                    className="text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {exercise.sets.map((set, setIdx) => (
                    <div 
                      key={setIdx}
                      className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300"
                    >
                      {set.weight}kg × {set.reps}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            <button
              onClick={() => setShowWorkoutModal(true)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5" />
              Add Exercise
            </button>
          </div>
        )}
      </div>

      {/* Nutrition Section */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <button
          onClick={() => toggleSection('nutrition')}
          className="w-full flex items-center justify-between p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <Utensils className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-white font-semibold">Nutrition</h3>
              <p className="text-slate-400 text-sm">{log.meals.length} meals logged</p>
            </div>
          </div>
          {expandedSections.nutrition ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>
        
        {expandedSections.nutrition && (
          <div className="px-4 pb-4 space-y-3">
            {/* Macro bars */}
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Calories</span>
                  <span className="text-white">{totalMacros.calories} / {targetCalories}</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full transition-all"
                    style={{ width: `${Math.min((totalMacros.calories / targetCalories) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Protein</span>
                    <span className="text-purple-400">{Math.round(totalMacros.protein)}g</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${Math.min((totalMacros.protein / ((profile?.weight || 70) * 2)) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Carbs</span>
                    <span className="text-blue-400">{Math.round(totalMacros.carbs)}g</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${Math.min((totalMacros.carbs / 300) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Fat</span>
                    <span className="text-yellow-400">{Math.round(totalMacros.fat)}g</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-500 rounded-full"
                      style={{ width: `${Math.min((totalMacros.fat / 80) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {log.meals.map((meal) => (
              <div 
                key={meal.id} 
                className="bg-slate-800/50 rounded-lg p-3 border border-slate-700"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-white text-sm">{meal.description}</p>
                    <p className="text-slate-500 text-xs">{meal.time}</p>
                  </div>
                  <button 
                    onClick={() => removeMeal(today, meal.id)}
                    className="text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex gap-3 text-xs">
                  <span className="text-orange-400">{meal.calories} kcal</span>
                  <span className="text-purple-400">{meal.protein}g P</span>
                  <span className="text-blue-400">{meal.carbs}g C</span>
                  <span className="text-yellow-400">{meal.fat}g F</span>
                </div>
              </div>
            ))}
            
            <button
              onClick={() => setShowMealModal(true)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5" />
              Add Meal
            </button>
          </div>
        )}
      </div>

      {/* Water Section */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <button
          onClick={() => toggleSection('water')}
          className="w-full flex items-center justify-between p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-white font-semibold">Water</h3>
              <p className="text-slate-400 text-sm">{(log.waterIntake / 1000).toFixed(1)}L / {(waterGoal / 1000).toFixed(1)}L</p>
            </div>
          </div>
          {expandedSections.water ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>
        
        {expandedSections.water && (
          <div className="px-4 pb-4">
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden mb-4">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all"
                style={{ width: `${Math.min((log.waterIntake / waterGoal) * 100, 100)}%` }}
              />
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setWater(today, Math.max(0, log.waterIntake - 250))}
                className="w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-slate-700 transition-colors"
              >
                <Minus className="w-5 h-5" />
              </button>
              
              <div className="flex gap-2">
                {[250, 500].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => addWater(today, amount)}
                    className="px-4 py-2 rounded-lg bg-blue-500/10 text-blue-400 text-sm font-medium border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
                  >
                    +{amount}ml
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => addWater(today, 250)}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white flex items-center justify-center hover:opacity-90 transition-opacity"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Photos Section */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <button
          onClick={() => toggleSection('photos')}
          className="w-full flex items-center justify-between p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-white font-semibold">Progress Photos</h3>
              <p className="text-slate-400 text-sm">{log.postWorkoutImages.length} photos</p>
            </div>
          </div>
          {expandedSections.photos ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>
        
        {expandedSections.photos && (
          <div className="px-4 pb-4">
            <div className="grid grid-cols-3 gap-2 mb-3">
              {log.postWorkoutImages.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removePostWorkoutImage(today, idx)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Camera className="w-5 h-5" />
              Add Photo
            </button>
          </div>
        )}
      </div>

      {/* Workout Modal */}
      {showWorkoutModal && (
        <WorkoutModal 
          onClose={() => setShowWorkoutModal(false)} 
          onAdd={(exercise) => {
            addWorkoutExercise(today, exercise);
            // Don't close - let user add more exercises
          }}
          onAddMultiple={(exercises) => {
            exercises.forEach(ex => addWorkoutExercise(today, ex));
            setShowWorkoutModal(false);
          }}
          onDone={() => setShowWorkoutModal(false)}
          suggestedMuscles={todaysSplit?.muscleGroups || []}
        />
      )}

      {/* Meal Modal */}
      {showMealModal && (
        <MealModal 
          onClose={() => setShowMealModal(false)} 
          onAdd={(meal) => {
            addMeal(today, meal);
            setShowMealModal(false);
          }}
        />
      )}
    </div>
  );
}

interface WorkoutModalProps {
  onClose: () => void;
  onAdd: (exercise: WorkoutExercise) => void;
  onAddMultiple: (exercises: WorkoutExercise[]) => void;
  onDone: () => void;
  suggestedMuscles: string[];
}

function WorkoutModal({ onClose, onAdd, onAddMultiple, onDone, suggestedMuscles }: WorkoutModalProps) {
  const [mode, setMode] = useState<'browse' | 'prompt'>('browse');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(
    suggestedMuscles[0] || null
  );
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [sets, setSets] = useState<ExerciseSet[]>([{ reps: 10, weight: 20 }]);
  const [addedCount, setAddedCount] = useState(0);
  
  // Prompt mode state
  const [promptText, setPromptText] = useState('');
  const [parsedWorkout, setParsedWorkout] = useState<ReturnType<typeof parseWorkoutDescription> | null>(null);

  const filteredExercises = selectedMuscle 
    ? getExercisesByMuscleGroup(selectedMuscle).filter(e => 
        e.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : EXERCISES.filter(e => 
        e.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

  const addSet = () => {
    const lastSet = sets[sets.length - 1];
    setSets([...sets, { ...lastSet }]);
  };

  const removeSet = (index: number) => {
    if (sets.length > 1) {
      setSets(sets.filter((_, i) => i !== index));
    }
  };

  const updateSet = (index: number, field: 'reps' | 'weight', value: number) => {
    const newSets = [...sets];
    newSets[index] = { ...newSets[index], [field]: value };
    setSets(newSets);
  };

  const handleAdd = () => {
    const exercise = EXERCISES.find(e => e.id === selectedExercise);
    if (exercise) {
      onAdd({
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        sets,
      });
      setAddedCount(prev => prev + 1);
      // Reset for next exercise
      setSelectedExercise(null);
      setSets([{ reps: 10, weight: 20 }]);
    }
  };

  const handleParseWorkout = () => {
    if (promptText.trim()) {
      const result = parseWorkoutDescription(promptText);
      setParsedWorkout(result);
    }
  };

  const handleAddFromPrompt = () => {
    if (parsedWorkout && parsedWorkout.exercises.length > 0) {
      onAddMultiple(parsedWorkout.exercises);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center">
      <div className="bg-slate-900 w-full max-w-lg rounded-t-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <h3 className="text-white text-lg font-semibold">Add Exercise</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="p-4 border-b border-slate-800 shrink-0">
          <div className="flex gap-2">
            <button
              onClick={() => { setMode('browse'); setParsedWorkout(null); }}
              className={cn(
                "flex-1 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors",
                mode === 'browse' 
                  ? "bg-purple-500 text-white" 
                  : "bg-slate-800 text-slate-400"
              )}
            >
              <Search className="w-4 h-4" />
              Browse
            </button>
            <button
              onClick={() => { setMode('prompt'); setSelectedExercise(null); }}
              className={cn(
                "flex-1 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors",
                mode === 'prompt' 
                  ? "bg-purple-500 text-white" 
                  : "bg-slate-800 text-slate-400"
              )}
            >
              <MessageSquare className="w-4 h-4" />
              Describe
            </button>
          </div>
        </div>

        {mode === 'prompt' ? (
          <div className="flex-1 overflow-auto p-4 space-y-4">
            <div>
              <label className="text-slate-400 text-sm mb-2 block">
                Describe your workout in natural language
              </label>
              <textarea
                value={promptText}
                onChange={(e) => {
                  setPromptText(e.target.value);
                  setParsedWorkout(null);
                }}
                placeholder="e.g., 3 sets of shoulder press, 50 lbs each, set 1 had 8 reps, set 2 had 7 reps, and set 3 had 6 reps. Then 4 sets of lateral raises at 10kg, 12 reps each"
                className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-purple-500 focus:outline-none resize-none h-32"
              />
            </div>

            {!parsedWorkout && (
              <button
                onClick={handleParseWorkout}
                disabled={!promptText.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium disabled:opacity-50"
              >
                Parse Workout
              </button>
            )}

            {parsedWorkout && (
              <div className="space-y-3">
                <div className={cn(
                  "p-3 rounded-lg border",
                  parsedWorkout.confidence === 'high' 
                    ? "bg-green-500/10 border-green-500/30"
                    : parsedWorkout.confidence === 'medium'
                      ? "bg-yellow-500/10 border-yellow-500/30"
                      : "bg-red-500/10 border-red-500/30"
                )}>
                  <p className={cn(
                    "text-sm font-medium",
                    parsedWorkout.confidence === 'high' 
                      ? "text-green-400"
                      : parsedWorkout.confidence === 'medium'
                        ? "text-yellow-400"
                        : "text-red-400"
                  )}>
                    {parsedWorkout.confidence === 'high' && `✓ Parsed ${parsedWorkout.exercises.length} exercise(s)`}
                    {parsedWorkout.confidence === 'medium' && "⚠ Partial match - some exercises not found"}
                    {parsedWorkout.confidence === 'low' && "✗ Couldn't parse - try being more specific"}
                  </p>
                </div>

                {parsedWorkout.exercises.length > 0 && (
                  <div className="space-y-2">
                    {parsedWorkout.exercises.map((ex, idx) => (
                      <div key={idx} className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                        <h4 className="text-white font-medium mb-2">{ex.exerciseName}</h4>
                        <div className="flex flex-wrap gap-2">
                          {ex.sets.map((set, setIdx) => (
                            <div 
                              key={setIdx}
                              className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300"
                            >
                              Set {setIdx + 1}: {set.weight}kg × {set.reps}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setParsedWorkout(null)}
                    className="flex-1 py-3 rounded-xl bg-slate-800 text-white font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleAddFromPrompt}
                    disabled={parsedWorkout.exercises.length === 0}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium disabled:opacity-50"
                  >
                    Add All
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : !selectedExercise ? (
          <div className="flex-1 overflow-auto p-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800 text-white pl-10 pr-4 py-3 rounded-xl border border-slate-700 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedMuscle(null)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                  !selectedMuscle 
                    ? "bg-cyan-500 text-white" 
                    : "bg-slate-800 text-slate-400 hover:text-white"
                )}
              >
                All
              </button>
              {MUSCLE_GROUPS.filter(m => m !== 'Rest').map((muscle) => (
                <button
                  key={muscle}
                  onClick={() => setSelectedMuscle(muscle)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                    selectedMuscle === muscle 
                      ? "bg-cyan-500 text-white" 
                      : suggestedMuscles.includes(muscle)
                        ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                        : "bg-slate-800 text-slate-400 hover:text-white"
                  )}
                >
                  {muscle}
                </button>
              ))}
            </div>
            
            <div className="space-y-2">
              {filteredExercises.map((exercise) => (
                <button
                  key={exercise.id}
                  onClick={() => setSelectedExercise(exercise.id)}
                  className="w-full text-left p-3 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-cyan-500/50 transition-colors"
                >
                  <p className="text-white font-medium">{exercise.name}</p>
                  <p className="text-slate-400 text-sm">{exercise.muscleGroup} • {exercise.category}</p>
                </button>
              ))}
            </div>
            
            {/* Done button in browse mode */}
            {addedCount > 0 && (
              <button
                onClick={onDone}
                className="w-full mt-4 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg shadow-lg shadow-cyan-500/25"
              >
                ✅ Done ({addedCount} exercise{addedCount > 1 ? 's' : ''} added)
              </button>
            )}
          </div>
        ) : (
          <div className="flex-1 overflow-auto p-4 space-y-4">
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
              <p className="text-white font-medium">
                {EXERCISES.find(e => e.id === selectedExercise)?.name}
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-white font-medium">Sets</h4>
                <button
                  onClick={addSet}
                  className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-sm rounded-lg border border-cyan-500/20"
                >
                  + Add Set
                </button>
              </div>
              
              {sets.map((set, index) => (
                <div key={index} className="flex items-center gap-3 bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                  <span className="text-slate-400 text-sm w-12">Set {index + 1}</span>
                  <div className="flex-1">
                    <label className="text-slate-400 text-xs">Weight (kg)</label>
                    <input
                      type="number"
                      value={set.weight}
                      onChange={(e) => updateSet(index, 'weight', parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-700 text-white px-2 py-1 rounded border border-slate-600 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-slate-400 text-xs">Reps</label>
                    <input
                      type="number"
                      value={set.reps}
                      onChange={(e) => updateSet(index, 'reps', parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-700 text-white px-2 py-1 rounded border border-slate-600 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => removeSet(index)}
                    className="text-slate-400 hover:text-red-400 mt-4"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="pt-4">
              <button
                onClick={() => setSelectedExercise(null)}
                className="w-full py-3 rounded-xl bg-slate-800 text-white font-medium"
              >
                ← Back to exercises
              </button>
            </div>
          </div>
        )}
        
        {/* FIXED FOOTER - Always visible */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 shrink-0">
          {selectedExercise ? (
            <div className="space-y-2">
              <button
                onClick={handleAdd}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold"
              >
                ➕ Add Exercise & Continue
              </button>
              <button
                onClick={onDone}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-lg shadow-cyan-500/25"
              >
                ✅ Done {addedCount > 0 ? `(${addedCount} added)` : ''}
              </button>
            </div>
          ) : mode === 'prompt' && parsedWorkout && parsedWorkout.exercises.length > 0 ? (
            <button
              onClick={handleAddFromPrompt}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg shadow-lg shadow-purple-500/25"
            >
              ✅ Add {parsedWorkout.exercises.length} Exercise{parsedWorkout.exercises.length > 1 ? 's' : ''} & Close
            </button>
          ) : addedCount > 0 ? (
            <button
              onClick={onDone}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg shadow-lg shadow-cyan-500/25"
            >
              ✅ Done ({addedCount} exercise{addedCount > 1 ? 's' : ''} added)
            </button>
          ) : (
            <p className="text-center text-slate-500 py-2">Select an exercise above to add it</p>
          )}
        </div>
      </div>
    </div>
  );
}

interface MealModalProps {
  onClose: () => void;
  onAdd: (meal: Meal) => void;
}

function MealModal({ onClose, onAdd }: MealModalProps) {
  const [mode, setMode] = useState<'ai' | 'manual' | 'image'>('ai');
  const [description, setDescription] = useState('');
  const [manualData, setManualData] = useState({
    description: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [aiResult, setAiResult] = useState<ReturnType<typeof analyzeNutrition> | null>(null);
  const [foodImage, setFoodImage] = useState<string | null>(null);
  const [imageDescription, setImageDescription] = useState('');
  const foodImageRef = useRef<HTMLInputElement>(null);

  const handleAnalyze = () => {
    if (description.trim()) {
      const result = analyzeNutrition(description);
      setAiResult(result);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFoodImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageAnalyze = () => {
    if (imageDescription.trim()) {
      const result = analyzeNutrition(imageDescription);
      setAiResult(result);
    }
  };

  const handleSave = () => {
    if (mode === 'manual') {
      const meal: Meal = {
        id: Date.now().toString(),
        description: manualData.description || 'Manual entry',
        calories: manualData.calories,
        protein: manualData.protein,
        carbs: manualData.carbs,
        fat: manualData.fat,
        time: format(new Date(), 'HH:mm'),
      };
      onAdd(meal);
    } else if (aiResult) {
      const meal: Meal = {
        id: Date.now().toString(),
        description: mode === 'image' ? imageDescription : description,
        calories: aiResult.calories,
        protein: aiResult.protein,
        carbs: aiResult.carbs,
        fat: aiResult.fat,
        time: format(new Date(), 'HH:mm'),
      };
      onAdd(meal);
    }
  };

  // Can we save?
  const canSaveManual = manualData.calories > 0 || manualData.protein > 0 || manualData.carbs > 0 || manualData.fat > 0;
  const canSaveAI = aiResult !== null;
  const canSave = mode === 'manual' ? canSaveManual : canSaveAI;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 w-full max-w-lg rounded-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <h3 className="text-white text-lg font-semibold">Log Meal</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Scrollable Content */}
        <div className="p-4 space-y-4 flex-1 overflow-y-auto min-h-0">
          {/* Mode Selector */}
          <div className="flex gap-2">
            <button
              onClick={() => { setMode('ai'); setAiResult(null); setFoodImage(null); }}
              className={cn(
                "flex-1 py-2 rounded-lg font-medium flex items-center justify-center gap-1 transition-colors text-sm",
                mode === 'ai' 
                  ? "bg-green-500 text-white" 
                  : "bg-slate-800 text-slate-400"
              )}
            >
              <MessageSquare className="w-4 h-4" />
              Describe
            </button>
            <button
              onClick={() => { setMode('image'); setAiResult(null); }}
              className={cn(
                "flex-1 py-2 rounded-lg font-medium flex items-center justify-center gap-1 transition-colors text-sm",
                mode === 'image' 
                  ? "bg-green-500 text-white" 
                  : "bg-slate-800 text-slate-400"
              )}
            >
              <ImageIcon className="w-4 h-4" />
              Photo
            </button>
            <button
              onClick={() => { setMode('manual'); setAiResult(null); setFoodImage(null); }}
              className={cn(
                "flex-1 py-2 rounded-lg font-medium flex items-center justify-center gap-1 transition-colors text-sm",
                mode === 'manual' 
                  ? "bg-green-500 text-white" 
                  : "bg-slate-800 text-slate-400"
              )}
            >
              <Edit3 className="w-4 h-4" />
              Manual
            </button>
          </div>
          
          {mode === 'ai' && (
            <div className="space-y-4">
              <div>
                <label className="text-slate-400 text-sm mb-1 block">Describe what you ate</label>
                <textarea
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setAiResult(null);
                  }}
                  placeholder="e.g., 100g greek yogurt with 50g oats and a banana"
                  className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-green-500 focus:outline-none resize-none h-24"
                />
              </div>
              
              {!aiResult && (
                <button
                  onClick={handleAnalyze}
                  disabled={!description.trim()}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium disabled:opacity-50"
                >
                  Analyze Nutrition
                </button>
              )}
            </div>
          )}

          {mode === 'image' && (
            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                ref={foodImageRef}
                onChange={handleImageUpload}
                className="hidden"
              />
              
              {!foodImage ? (
                <button
                  onClick={() => foodImageRef.current?.click()}
                  className="w-full h-32 rounded-xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center gap-2 hover:border-green-500/50 transition-colors"
                >
                  <Camera className="w-8 h-8 text-slate-500" />
                  <p className="text-slate-400 text-sm">Tap to upload food photo</p>
                </button>
              ) : (
                <div className="relative">
                  <img 
                    src={foodImage} 
                    alt="Food" 
                    className="w-full h-32 object-cover rounded-xl"
                  />
                  <button
                    onClick={() => { setFoodImage(null); setAiResult(null); }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {foodImage && (
                <>
                  <div>
                    <label className="text-slate-400 text-sm mb-1 block">
                      Describe what's in the photo
                    </label>
                    <textarea
                      value={imageDescription}
                      onChange={(e) => {
                        setImageDescription(e.target.value);
                        setAiResult(null);
                      }}
                      placeholder="e.g., 300g rice, 150g chicken, broccoli"
                      className="w-full bg-slate-800 text-white px-3 py-2 rounded-xl border border-slate-700 focus:border-green-500 focus:outline-none resize-none h-16"
                    />
                  </div>

                  {!aiResult && (
                    <button
                      onClick={handleImageAnalyze}
                      disabled={!imageDescription.trim()}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium disabled:opacity-50"
                    >
                      Analyze with Description
                    </button>
                  )}
                </>
              )}

              <p className="text-slate-500 text-xs text-center">
                💡 Adding a description with approximate quantities (like "150g chicken") gives more accurate results
              </p>
            </div>
          )}

          {mode === 'manual' && (
            <div className="space-y-4">
              <div>
                <label className="text-slate-400 text-sm mb-1 block">Description (optional)</label>
                <input
                  type="text"
                  value={manualData.description}
                  onChange={(e) => setManualData({ ...manualData, description: e.target.value })}
                  placeholder="e.g., Lunch"
                  className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-green-500 focus:outline-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 text-sm mb-1 block">Calories</label>
                  <input
                    type="number"
                    value={manualData.calories || ''}
                    onChange={(e) => setManualData({ ...manualData, calories: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-sm mb-1 block">Protein (g)</label>
                  <input
                    type="number"
                    value={manualData.protein || ''}
                    onChange={(e) => setManualData({ ...manualData, protein: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-sm mb-1 block">Carbs (g)</label>
                  <input
                    type="number"
                    value={manualData.carbs || ''}
                    onChange={(e) => setManualData({ ...manualData, carbs: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-sm mb-1 block">Fat (g)</label>
                  <input
                    type="number"
                    value={manualData.fat || ''}
                    onChange={(e) => setManualData({ ...manualData, fat: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-green-500 focus:outline-none"
                  />
                </div>
              </div>
              
            </div>
          )}

          {/* AI Result Display (for both ai and image modes) */}
          {aiResult && (mode === 'ai' || mode === 'image') && (
            <div className="space-y-3">
              <div className={cn(
                "p-3 rounded-lg border",
                aiResult.confidence === 'high' 
                  ? "bg-green-500/10 border-green-500/30"
                  : aiResult.confidence === 'medium'
                    ? "bg-yellow-500/10 border-yellow-500/30"
                    : "bg-red-500/10 border-red-500/30"
              )}>
                <p className={cn(
                  "text-sm font-medium",
                  aiResult.confidence === 'high' 
                    ? "text-green-400"
                    : aiResult.confidence === 'medium'
                      ? "text-yellow-400"
                      : "text-red-400"
                )}>
                  {aiResult.confidence === 'high' && "✓ High confidence match"}
                  {aiResult.confidence === 'medium' && "⚠ Partial match - review values"}
                  {aiResult.confidence === 'low' && "✗ Low confidence - consider manual entry"}
                </p>
              </div>
              
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="grid grid-cols-4 gap-3 text-center">
                  <div>
                    <p className="text-2xl font-bold text-orange-400">{aiResult.calories}</p>
                    <p className="text-slate-400 text-xs">kcal</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-400">{aiResult.protein}g</p>
                    <p className="text-slate-400 text-xs">Protein</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-400">{aiResult.carbs}g</p>
                    <p className="text-slate-400 text-xs">Carbs</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-400">{aiResult.fat}g</p>
                    <p className="text-slate-400 text-xs">Fat</p>
                  </div>
                </div>
              </div>
              
              {aiResult.items.length > 0 && (
                <div className="space-y-2">
                  <p className="text-slate-400 text-sm">Detected items:</p>
                  {aiResult.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm bg-slate-800/30 rounded p-2">
                      <span className="text-white capitalize">{item.name}</span>
                      <span className="text-slate-400">{item.calories} kcal</span>
                    </div>
                  ))}
                </div>
              )}
              
            </div>
          )}
        </div>
        
        {/* FIXED FOOTER - Always visible save button */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 shrink-0">
          <button
            onClick={handleSave}
            disabled={!canSave}
            className={cn(
              "w-full py-4 rounded-xl font-bold text-lg transition-all",
              canSave
                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25"
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            )}
          >
            {canSave ? "✅ Save Meal" : "Enter meal info above"}
          </button>
        </div>
      </div>
    </div>
  );
}
