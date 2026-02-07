import { useState } from 'react';
import { format, subDays, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Flame, Dumbbell, Droplets, Camera, X } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/utils/cn';

export function HistoryView() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  const { getLog, calculateTargetCalories, calculateWaterGoal } = useStore();
  
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  const selectedLog = getLog(format(selectedDate, 'yyyy-MM-dd'));
  const targetCalories = calculateTargetCalories();
  const waterGoal = calculateWaterGoal();
  
  const totalMacros = selectedLog.meals.reduce((acc, meal) => ({
    calories: acc.calories + meal.calories,
    protein: acc.protein + meal.protein,
    carbs: acc.carbs + meal.carbs,
    fat: acc.fat + meal.fat,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  
  const totalSets = selectedLog.workouts.reduce((acc, w) => acc + w.sets.length, 0);
  const totalVolume = selectedLog.workouts.reduce((acc, w) => 
    acc + w.sets.reduce((s, set) => s + set.weight * set.reps, 0), 0
  );

  const goToPreviousWeek = () => setSelectedDate(subDays(selectedDate, 7));
  const goToNextWeek = () => setSelectedDate(addDays(selectedDate, 7));

  return (
    <div className="space-y-4 pb-24">
      {/* Week Navigation */}
      <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={goToPreviousWeek}
            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-white font-semibold">
            {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
          </h3>
          <button 
            onClick={goToNextWeek}
            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day) => {
            const dayLog = getLog(format(day, 'yyyy-MM-dd'));
            const hasWorkout = dayLog.workouts.length > 0;
            const hasMeals = dayLog.meals.length > 0;
            const isSelected = isSameDay(day, selectedDate);
            
            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "flex flex-col items-center py-2 rounded-lg transition-all",
                  isSelected 
                    ? "bg-gradient-to-br from-cyan-500 to-blue-600" 
                    : "bg-slate-800/50 hover:bg-slate-800"
                )}
              >
                <span className={cn(
                  "text-xs uppercase mb-1",
                  isSelected ? "text-white/80" : "text-slate-500"
                )}>
                  {format(day, 'EEE')}
                </span>
                <span className={cn(
                  "text-lg font-semibold",
                  isSelected ? "text-white" : isToday(day) ? "text-cyan-400" : "text-slate-300"
                )}>
                  {format(day, 'd')}
                </span>
                <div className="flex gap-0.5 mt-1">
                  {hasWorkout && (
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      isSelected ? "bg-white/80" : "bg-purple-500"
                    )} />
                  )}
                  {hasMeals && (
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      isSelected ? "bg-white/80" : "bg-green-500"
                    )} />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Summary */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-5 border border-cyan-500/20">
        <h2 className="text-white text-xl font-bold mb-4">
          {isToday(selectedDate) ? 'Today' : format(selectedDate, 'EEEE, MMMM d')}
        </h2>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-slate-400 text-sm">Calories</span>
            </div>
            <p className="text-2xl font-bold text-white">{totalMacros.calories}</p>
            <p className="text-xs text-slate-500">/ {targetCalories} target</p>
          </div>
          
          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <Dumbbell className="w-4 h-4 text-purple-400" />
              <span className="text-slate-400 text-sm">Workout</span>
            </div>
            <p className="text-2xl font-bold text-white">{totalSets}</p>
            <p className="text-xs text-slate-500">sets • {Math.round(totalVolume)}kg vol</p>
          </div>
          
          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="w-4 h-4 text-blue-400" />
              <span className="text-slate-400 text-sm">Water</span>
            </div>
            <p className="text-2xl font-bold text-white">{(selectedLog.waterIntake / 1000).toFixed(1)}L</p>
            <p className="text-xs text-slate-500">/ {(waterGoal / 1000).toFixed(1)}L goal</p>
          </div>
          
          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <Camera className="w-4 h-4 text-amber-400" />
              <span className="text-slate-400 text-sm">Photos</span>
            </div>
            <p className="text-2xl font-bold text-white">{selectedLog.postWorkoutImages.length}</p>
            <p className="text-xs text-slate-500">progress pics</p>
          </div>
        </div>
      </div>

      {/* Macros Breakdown */}
      {selectedLog.meals.length > 0 && (
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <h3 className="text-white font-semibold mb-3">Macros Breakdown</h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
              <p className="text-2xl font-bold text-purple-400">{totalMacros.protein}g</p>
              <p className="text-xs text-slate-400">Protein</p>
            </div>
            <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
              <p className="text-2xl font-bold text-blue-400">{totalMacros.carbs}g</p>
              <p className="text-xs text-slate-400">Carbs</p>
            </div>
            <div className="bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/20">
              <p className="text-2xl font-bold text-yellow-400">{totalMacros.fat}g</p>
              <p className="text-xs text-slate-400">Fat</p>
            </div>
          </div>
        </div>
      )}

      {/* Workout Details */}
      {selectedLog.workouts.length > 0 && (
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <h3 className="text-white font-semibold mb-3">Workout Log</h3>
          <div className="space-y-3">
            {selectedLog.workouts.map((exercise, idx) => (
              <div 
                key={idx} 
                className="bg-slate-800/50 rounded-lg p-3 border border-slate-700"
              >
                <h4 className="text-white font-medium mb-2">{exercise.exerciseName}</h4>
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
          </div>
        </div>
      )}

      {/* Meals Details */}
      {selectedLog.meals.length > 0 && (
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <h3 className="text-white font-semibold mb-3">Meals</h3>
          <div className="space-y-2">
            {selectedLog.meals.map((meal) => (
              <div 
                key={meal.id} 
                className="bg-slate-800/50 rounded-lg p-3 border border-slate-700"
              >
                <div className="flex justify-between items-start mb-1">
                  <p className="text-white text-sm">{meal.description}</p>
                  <span className="text-slate-500 text-xs">{meal.time}</span>
                </div>
                <div className="flex gap-3 text-xs">
                  <span className="text-orange-400">{meal.calories} kcal</span>
                  <span className="text-purple-400">{meal.protein}g P</span>
                  <span className="text-blue-400">{meal.carbs}g C</span>
                  <span className="text-yellow-400">{meal.fat}g F</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Photos */}
      {selectedLog.postWorkoutImages.length > 0 && (
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <h3 className="text-white font-semibold mb-3">Progress Photos</h3>
          <div className="grid grid-cols-3 gap-2">
            {selectedLog.postWorkoutImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setViewingImage(img)}
                className="aspect-square rounded-lg overflow-hidden"
              >
                <img src={img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {selectedLog.workouts.length === 0 && selectedLog.meals.length === 0 && (
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-8 text-center">
          <p className="text-slate-400">No data logged for this day</p>
        </div>
      )}

      {/* Image Viewer Modal */}
      {viewingImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setViewingImage(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white"
            onClick={() => setViewingImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <img 
            src={viewingImage} 
            alt="" 
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
