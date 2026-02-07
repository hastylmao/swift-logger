import { useMemo } from 'react';
import { format, subDays, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns';
import { 
  TrendingUp, 
  Flame, 
  Dumbbell, 
  Target,
  Calendar,
  Award
} from 'lucide-react';
import { useStore } from '@/store/useStore';

export function StatsView() {
  const { logs, calculateTargetCalories } = useStore();
  const targetCalories = calculateTargetCalories();

  const stats = useMemo(() => {
    const today = new Date();
    const last7Days = eachDayOfInterval({
      start: subDays(today, 6),
      end: today,
    });
    const last30Days = eachDayOfInterval({
      start: subDays(today, 29),
      end: today,
    });

    // Workout streak
    let currentStreak = 0;
    for (let i = 0; i < 365; i++) {
      const date = format(subDays(today, i), 'yyyy-MM-dd');
      const log = logs[date];
      if (log && log.workouts.length > 0) {
        currentStreak++;
      } else if (i > 0) {
        break;
      }
    }

    // Total workouts this week
    const thisWeekStart = startOfWeek(today, { weekStartsOn: 1 });
    const thisWeekEnd = endOfWeek(today, { weekStartsOn: 1 });
    const thisWeekDays = eachDayOfInterval({ start: thisWeekStart, end: thisWeekEnd });
    const workoutsThisWeek = thisWeekDays.filter(day => {
      const log = logs[format(day, 'yyyy-MM-dd')];
      return log && log.workouts.length > 0;
    }).length;

    // Average calories last 7 days
    let totalCalories7Days = 0;
    let daysWithMeals = 0;
    last7Days.forEach(day => {
      const log = logs[format(day, 'yyyy-MM-dd')];
      if (log && log.meals.length > 0) {
        totalCalories7Days += log.meals.reduce((sum, m) => sum + m.calories, 0);
        daysWithMeals++;
      }
    });
    const avgCalories = daysWithMeals > 0 ? Math.round(totalCalories7Days / daysWithMeals) : 0;

    // Total volume this month
    let totalVolume = 0;
    let totalSets = 0;
    last30Days.forEach(day => {
      const log = logs[format(day, 'yyyy-MM-dd')];
      if (log) {
        log.workouts.forEach(w => {
          w.sets.forEach(s => {
            totalVolume += s.weight * s.reps;
            totalSets++;
          });
        });
      }
    });

    // Weekly calorie data for chart
    const weeklyData = last7Days.map(day => {
      const log = logs[format(day, 'yyyy-MM-dd')];
      const calories = log ? log.meals.reduce((sum, m) => sum + m.calories, 0) : 0;
      return {
        day: format(day, 'EEE'),
        calories,
        percentage: targetCalories > 0 ? (calories / targetCalories) * 100 : 0,
      };
    });

    return {
      currentStreak,
      workoutsThisWeek,
      avgCalories,
      totalVolume,
      totalSets,
      weeklyData,
    };
  }, [logs, targetCalories]);

  return (
    <div className="space-y-4 pb-24">
      {/* Streak Card */}
      <div className="bg-gradient-to-br from-orange-500/20 via-slate-900 to-slate-900 rounded-2xl p-5 border border-orange-500/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-400 text-sm font-medium mb-1">Current Streak</p>
            <p className="text-5xl font-bold text-white">{stats.currentStreak}</p>
            <p className="text-slate-400 text-sm">consecutive days</p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <Flame className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <Dumbbell className="w-4 h-4 text-purple-400" />
            <span className="text-slate-400 text-sm">This Week</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.workoutsThisWeek}</p>
          <p className="text-slate-500 text-xs">workouts</p>
        </div>
        
        <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400 text-sm">Avg Calories</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.avgCalories}</p>
          <p className="text-slate-500 text-xs">last 7 days</p>
        </div>
        
        <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-slate-400 text-sm">Monthly Volume</span>
          </div>
          <p className="text-3xl font-bold text-white">{(stats.totalVolume / 1000).toFixed(1)}k</p>
          <p className="text-slate-500 text-xs">kg lifted</p>
        </div>
        
        <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-yellow-400" />
            <span className="text-slate-400 text-sm">Total Sets</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.totalSets}</p>
          <p className="text-slate-500 text-xs">this month</p>
        </div>
      </div>

      {/* Weekly Calories Chart */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
        <h3 className="text-white font-semibold mb-4">Weekly Calories</h3>
        <div className="flex items-end justify-between gap-2 h-32">
          {stats.weeklyData.map((day, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full bg-slate-800 rounded-t-lg overflow-hidden flex-1 flex flex-col justify-end">
                <div 
                  className="bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t-lg transition-all"
                  style={{ 
                    height: `${Math.min(day.percentage, 100)}%`,
                    minHeight: day.calories > 0 ? '4px' : '0'
                  }}
                />
              </div>
              <span className="text-slate-500 text-xs">{day.day}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-slate-500">
          <span>0</span>
          <span className="text-cyan-400">{targetCalories} target</span>
        </div>
      </div>

      {/* Tips Card */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-1">Stay Consistent</h3>
            <p className="text-slate-400 text-sm">
              {stats.currentStreak === 0 
                ? "Start your streak today! Log at least one workout to begin."
                : stats.currentStreak < 7
                  ? `Great start! ${7 - stats.currentStreak} more days to hit your first week.`
                  : stats.currentStreak < 30
                    ? `Amazing progress! Keep going to hit a 30-day streak.`
                    : "You're a machine! Keep up the incredible consistency."
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
