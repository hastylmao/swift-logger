import { useState, useMemo } from 'react';
import { Search, Trophy, Lock } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { ACHIEVEMENTS, Achievement, RARITY_COLORS, calculateAchievementStats } from '@/data/achievements';
import { cn } from '@/utils/cn';

type CategoryFilter = 'all' | Achievement['category'];
type RarityFilter = 'all' | Achievement['rarity'];

export function AchievementsView() {
  const { logs, getTodayLog, unlockedAchievements } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [rarityFilter, setRarityFilter] = useState<RarityFilter>('all');
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);

  const unlockedIds = useMemo(() => new Set(unlockedAchievements.map(a => a.id)), [unlockedAchievements]);
  
  // Calculate stats for potential progress display
  const _stats = useMemo(() => {
    const currentLog = getTodayLog();
    return calculateAchievementStats(logs, currentLog);
  }, [logs, getTodayLog]);
  void _stats; // Available for future use

  const filteredAchievements = useMemo(() => {
    return ACHIEVEMENTS.filter(achievement => {
      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        if (!achievement.name.toLowerCase().includes(search) && 
            !achievement.description.toLowerCase().includes(search)) {
          return false;
        }
      }

      // Category filter
      if (categoryFilter !== 'all' && achievement.category !== categoryFilter) {
        return false;
      }

      // Rarity filter
      if (rarityFilter !== 'all' && achievement.rarity !== rarityFilter) {
        return false;
      }

      // Unlocked filter
      if (showUnlockedOnly && !unlockedIds.has(achievement.id)) {
        return false;
      }

      return true;
    });
  }, [searchTerm, categoryFilter, rarityFilter, showUnlockedOnly, unlockedIds]);

  // Group by category for display
  const groupedAchievements = useMemo(() => {
    const groups: Record<string, Achievement[]> = {};
    filteredAchievements.forEach(a => {
      if (!groups[a.category]) groups[a.category] = [];
      groups[a.category].push(a);
    });
    return groups;
  }, [filteredAchievements]);

  const totalUnlocked = unlockedAchievements.length;
  const totalAchievements = ACHIEVEMENTS.length;
  const progressPercentage = (totalUnlocked / totalAchievements) * 100;

  const categories: { value: CategoryFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'workout', label: 'Workout' },
    { value: 'nutrition', label: 'Nutrition' },
    { value: 'consistency', label: 'Consistency' },
    { value: 'strength', label: 'Strength' },
    { value: 'volume', label: 'Volume' },
    { value: 'hydration', label: 'Hydration' },
    { value: 'milestone', label: 'Milestone' },
    { value: 'special', label: 'Special' },
  ];

  const rarities: { value: RarityFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'common', label: 'Common' },
    { value: 'uncommon', label: 'Uncommon' },
    { value: 'rare', label: 'Rare' },
    { value: 'epic', label: 'Epic' },
    { value: 'legendary', label: 'Legendary' },
  ];

  const categoryLabels: Record<string, string> = {
    workout: '💪 Workout',
    nutrition: '🍽️ Nutrition',
    consistency: '🔥 Consistency',
    strength: '🏋️ Strength',
    volume: '📊 Volume',
    hydration: '💧 Hydration',
    milestone: '🎯 Milestone',
    special: '⭐ Special',
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Progress Header */}
      <div className="bg-gradient-to-br from-amber-500/20 via-slate-900 to-slate-900 rounded-2xl p-5 border border-amber-500/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-amber-400 text-sm font-medium mb-1">Achievement Progress</p>
            <p className="text-4xl font-bold text-white">{totalUnlocked}</p>
            <p className="text-slate-400 text-sm">of {totalAchievements} unlocked</p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
            <Trophy className="w-8 h-8 text-white" />
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-right text-amber-400 text-xs mt-1">{progressPercentage.toFixed(1)}%</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-slate-900 rounded-xl p-3 border border-slate-800 text-center">
          <p className="text-lg font-bold text-slate-400">{ACHIEVEMENTS.filter(a => a.rarity === 'common' && unlockedIds.has(a.id)).length}</p>
          <p className="text-xs text-slate-500">Common</p>
        </div>
        <div className="bg-slate-900 rounded-xl p-3 border border-green-500/20 text-center">
          <p className="text-lg font-bold text-green-400">{ACHIEVEMENTS.filter(a => a.rarity === 'uncommon' && unlockedIds.has(a.id)).length}</p>
          <p className="text-xs text-slate-500">Uncommon</p>
        </div>
        <div className="bg-slate-900 rounded-xl p-3 border border-blue-500/20 text-center">
          <p className="text-lg font-bold text-blue-400">{ACHIEVEMENTS.filter(a => a.rarity === 'rare' && unlockedIds.has(a.id)).length}</p>
          <p className="text-xs text-slate-500">Rare</p>
        </div>
        <div className="bg-slate-900 rounded-xl p-3 border border-purple-500/20 text-center">
          <p className="text-lg font-bold text-purple-400">{ACHIEVEMENTS.filter(a => a.rarity === 'epic' && unlockedIds.has(a.id)).length}</p>
          <p className="text-xs text-slate-500">Epic</p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl p-3 border border-amber-500/20 text-center">
        <p className="text-2xl font-bold text-amber-400">{ACHIEVEMENTS.filter(a => a.rarity === 'legendary' && unlockedIds.has(a.id)).length}</p>
        <p className="text-xs text-amber-400/70">Legendary Achievements</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search achievements..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900 text-white pl-10 pr-4 py-3 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
        />
      </div>

      {/* Filters */}
      <div className="space-y-2">
        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setCategoryFilter(cat.value)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                categoryFilter === cat.value
                  ? "bg-amber-500 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Rarity filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {rarities.map(rarity => (
            <button
              key={rarity.value}
              onClick={() => setRarityFilter(rarity.value)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                rarityFilter === rarity.value
                  ? rarity.value === 'all' 
                    ? "bg-cyan-500 text-white"
                    : cn(RARITY_COLORS[rarity.value as Achievement['rarity']].bg, RARITY_COLORS[rarity.value as Achievement['rarity']].text, "border", RARITY_COLORS[rarity.value as Achievement['rarity']].border)
                  : "bg-slate-800 text-slate-400 hover:text-white"
              )}
            >
              {rarity.label}
            </button>
          ))}
        </div>

        {/* Toggle unlocked only */}
        <button
          onClick={() => setShowUnlockedOnly(!showUnlockedOnly)}
          className={cn(
            "w-full py-2 rounded-lg text-sm font-medium transition-colors",
            showUnlockedOnly
              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
              : "bg-slate-800 text-slate-400"
          )}
        >
          {showUnlockedOnly ? '✓ Showing Unlocked Only' : 'Show All Achievements'}
        </button>
      </div>

      {/* Results count */}
      <p className="text-slate-500 text-sm">
        Showing {filteredAchievements.length} of {totalAchievements} achievements
      </p>

      {/* Achievements List */}
      <div className="space-y-6">
        {Object.entries(groupedAchievements).map(([category, achievements]) => (
          <div key={category}>
            <h3 className="text-white font-semibold mb-3">{categoryLabels[category] || category}</h3>
            <div className="space-y-2">
              {achievements.map(achievement => {
                const isUnlocked = unlockedIds.has(achievement.id);
                const colors = RARITY_COLORS[achievement.rarity];
                const unlockedData = unlockedAchievements.find(a => a.id === achievement.id);
                
                return (
                  <div
                    key={achievement.id}
                    className={cn(
                      "rounded-xl p-3 border transition-all",
                      isUnlocked 
                        ? cn(colors.bg, colors.border)
                        : "bg-slate-900/50 border-slate-800 opacity-60"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {/* Icon */}
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center text-2xl",
                        isUnlocked 
                          ? "bg-white/10" 
                          : "bg-slate-800"
                      )}>
                        {isUnlocked ? achievement.icon : <Lock className="w-5 h-5 text-slate-600" />}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className={cn(
                            "font-medium truncate",
                            isUnlocked ? "text-white" : "text-slate-500"
                          )}>
                            {achievement.name}
                          </h4>
                          <span className={cn(
                            "px-1.5 py-0.5 rounded text-[10px] font-medium capitalize shrink-0",
                            colors.bg, colors.text
                          )}>
                            {achievement.rarity}
                          </span>
                        </div>
                        <p className={cn(
                          "text-sm truncate",
                          isUnlocked ? "text-slate-400" : "text-slate-600"
                        )}>
                          {achievement.description}
                        </p>
                        {isUnlocked && unlockedData && (
                          <p className="text-xs text-slate-500 mt-1">
                            Unlocked {new Date(unlockedData.unlockedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500">No achievements match your filters</p>
        </div>
      )}
    </div>
  );
}
