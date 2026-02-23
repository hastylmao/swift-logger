import { useState } from 'react';
import { 
  Search, 
  Users, 
  UserPlus,
  Trophy,
  Dumbbell,
  Flame,
  Target,
  X,
  Check,
  ChevronRight,
  User as UserIcon,
  Calendar,
  Utensils,
  Droplets,
  MessageSquare
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { cn } from '@/utils/cn';
import { UserProfile, DailyLog } from '@/types';
import { format, parseISO } from 'date-fns';
// We import exercises to map IDs to muscle groups
import { EXERCISES } from '@/data/exercises';

interface PublicProfile {
  id: string;
  username: string;
  bio?: string;
  profile_data?: UserProfile;
  logs?: Record<string, DailyLog>;
  stats?: {
    totalWorkouts: number;
    totalSets: number;
    currentStreak: number;
    totalVolume: number;
  };
  privacy?: {
    showWorkouts: boolean;
    showNutrition: boolean;
    showPhotos: boolean;
    showStats: boolean;
  };
}

export function CompareView() {
  const { profile, logs } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<PublicProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<PublicProfile | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [following, setFollowing] = useState<string[]>([]);
  const [followers, _setFollowers] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'search' | 'following' | 'followers'>('search');

  // Calculate local user stats
  const myStats = {
    totalWorkouts: Object.values(logs).reduce((sum, log) => sum + log.workouts.length, 0),
    totalSets: Object.values(logs).reduce((sum, log) => 
      sum + log.workouts.reduce((s, w) => s + w.sets.length, 0), 0),
    totalVolume: Object.values(logs).reduce((sum, log) => 
      sum + log.workouts.reduce((s, w) => 
        s + w.sets.reduce((v, set) => v + set.weight * set.reps, 0), 0), 0),
    currentStreak: (() => {
      let streak = 0;
      const today = new Date();
      for (let i = 0; i < 365; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const log = logs[dateStr];
        if (log && log.workouts.length > 0) {
          streak++;
        } else if (i > 0) {
          break;
        }
      }
      return streak;
    })(),
  };

  const handleSearch = async () => {
    if (!searchTerm.trim() || !isSupabaseConfigured()) return;
    
    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('user_data')
        .select('*')
        .ilike('data->profile->>username', `%${searchTerm.toLowerCase()}%`)
        .limit(10);

      if (error) throw error;
      
      const results = (data || []).map((row: any) => {
        const userData = row.data || {};
        const userProfile = userData.profile || {};
        const userLogs = (userData.logs || {}) as Record<string, DailyLog>;

        const stats = {
          totalWorkouts: Object.values(userLogs).reduce((sum: number, log: any) => sum + (log.workouts?.length || 0), 0),
          totalSets: Object.values(userLogs).reduce((sum: number, log: any) => 
            sum + (log.workouts?.reduce((s: number, w: any) => s + (w.sets?.length || 0), 0) || 0), 0),
          totalVolume: Object.values(userLogs).reduce((sum: number, log: any) => 
            sum + (log.workouts?.reduce((s: number, w: any) => 
              s + (w.sets?.reduce((v: number, set: any) => v + (set.weight * set.reps), 0) || 0), 0) || 0), 0),
          currentStreak: (() => {
            let streak = 0;
            const today = new Date();
            for (let i = 0; i < 365; i++) {
              const date = new Date(today);
              date.setDate(date.getDate() - i);
              const dateStr = date.toISOString().split('T')[0];
              const log = userLogs[dateStr];
              if (log && log.workouts && log.workouts.length > 0) {
                streak++;
              } else if (i > 0) {
                break;
              }
            }
            return streak;
          })()
        };

        return {
          id: row.user_id,
          username: userProfile.username || 'Unknown',
          bio: userProfile.bio,
          profile_data: userProfile,
          privacy: userProfile.privacy,
          logs: userLogs,
          stats: stats
        };
      });

      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleFollow = async (userId: string) => {
    if (following.includes(userId)) {
      setFollowing(following.filter(id => id !== userId));
    } else {
      setFollowing([...following, userId]);
    }
  };

  if (!isSupabaseConfigured()) {
    return (
      <div className="space-y-4 pb-24">
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 text-center">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-white font-semibold mb-2">Social Features Require Supabase</h3>
          <p className="text-slate-400 text-sm mb-4">
            To compare progress with friends, set up your profile with a username and connect to Supabase.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-500/20 via-slate-900 to-slate-900 rounded-2xl p-5 border border-purple-500/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-white text-xl font-bold">Compare & Connect</h2>
            <p className="text-slate-400 text-sm">Find friends and compare progress</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* My Username */}
        {profile?.username ? (
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
            <p className="text-slate-400 text-xs mb-1">Your Username</p>
            <p className="text-cyan-400 font-mono">@{profile.username}</p>
          </div>
        ) : (
          <div className="bg-amber-500/10 rounded-lg p-3 border border-amber-500/30">
            <p className="text-amber-400 text-sm">
              Set up your username in Profile to be discoverable by friends!
            </p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'search', label: 'Search', icon: <Search className="w-4 h-4" /> },
          { id: 'following', label: `Following (${following.length})`, icon: <UserPlus className="w-4 h-4" /> },
          { id: 'followers', label: `Followers (${followers.length})`, icon: <Users className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              "flex-1 py-2 rounded-lg font-medium flex items-center justify-center gap-1 transition-colors text-sm",
              activeTab === tab.id
                ? "bg-purple-500 text-white"
                : "bg-slate-800 text-slate-400"
            )}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Search Tab */}
      {activeTab === 'search' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full bg-slate-900 text-white pl-10 pr-4 py-3 rounded-xl border border-slate-800 focus:border-purple-500 focus:outline-none"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching || !searchTerm.trim()}
              className="px-4 py-3 rounded-xl bg-purple-500 text-white font-medium disabled:opacity-50"
            >
              {isSearching ? '...' : 'Search'}
            </button>
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-2">
              <p className="text-slate-400 text-sm">{searchResults.length} users found</p>
              {searchResults.map((user) => (
                <button
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className="w-full bg-slate-900 rounded-xl p-4 border border-slate-800 hover:border-purple-500/50 transition-colors text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">@{user.username}</p>
                        {user.bio && (
                          <p className="text-slate-400 text-sm truncate max-w-[200px]">{user.bio}</p>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* My Stats */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
        <h3 className="text-white font-semibold mb-3">My Stats</h3>
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={<Dumbbell className="w-4 h-4" />} label="Workouts" value={myStats.totalWorkouts} color="purple" />
          <StatCard icon={<Target className="w-4 h-4" />} label="Total Sets" value={myStats.totalSets} color="cyan" />
          <StatCard icon={<Trophy className="w-4 h-4" />} label="Volume" value={`${(myStats.totalVolume / 1000).toFixed(1)}k kg`} color="amber" />
          <StatCard icon={<Flame className="w-4 h-4" />} label="Streak" value={`${myStats.currentStreak} days`} color="orange" />
        </div>
      </div>

      {/* User Profile Modal */}
      {selectedUser && (
        <UserProfileModal
          user={selectedUser}
          isFollowing={following.includes(selectedUser.id)}
          onFollow={() => handleFollow(selectedUser.id)}
          onClose={() => setSelectedUser(null)}
          myStats={myStats}
        />
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: any, label: string, value: string | number, color: any }) {
  const colorClasses: any = {
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  };
  return (
    <div className={cn("rounded-lg p-3 border", colorClasses[color])}>
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-slate-400 text-xs">{label}</span>
      </div>
      <p className="text-lg font-bold text-white">{value}</p>
    </div>
  );
}

interface UserProfileModalProps {
  user: PublicProfile;
  isFollowing: boolean;
  onFollow: () => void;
  onClose: () => void;
  myStats: any;
}

function UserProfileModal({ user, isFollowing, onFollow, onClose, myStats }: UserProfileModalProps) {
  // Sort logs by date (newest first)
  const sortedLogs = Object.entries(user.logs || {})
    .sort(([dateA], [dateB]) => dateB.localeCompare(dateA));
  
  const userStats = user.stats || { totalWorkouts: 0, totalSets: 0, currentStreak: 0, totalVolume: 0 };
  const canShowWorkouts = user.privacy?.showWorkouts !== false;
  const canShowNutrition = user.privacy?.showNutrition !== false;

  // Helper to determine muscle groups hit from exercises
  const getMusclesHit = (workoutExercises: any[]) => {
    const muscles = new Set<string>();
    workoutExercises.forEach(w => {
      // Find exercise in database to get muscle group
      const exerciseDef = EXERCISES.find(e => e.name === w.exerciseName || e.id === w.exerciseId);
      if (exerciseDef) {
        muscles.add(exerciseDef.muscleGroup);
      } else {
        // Fallback or guess based on name
        if (w.exerciseName.toLowerCase().includes('bench')) muscles.add('Chest');
        if (w.exerciseName.toLowerCase().includes('squat')) muscles.add('Legs');
        if (w.exerciseName.toLowerCase().includes('curl')) muscles.add('Biceps');
      }
    });
    return Array.from(muscles);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center">
      <div className="bg-slate-900 w-full max-w-lg rounded-t-3xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <h3 className="text-white text-lg font-semibold">@{user.username}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* User Info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-white text-xl font-bold">@{user.username}</h2>
              {user.bio && <p className="text-slate-400">{user.bio}</p>}
            </div>
          </div>

          <button
            onClick={onFollow}
            className={cn(
              "w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors",
              isFollowing
                ? "bg-slate-800 text-slate-300"
                : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            )}
          >
            {isFollowing ? <><Check className="w-5 h-5" /> Following</> : <><UserPlus className="w-5 h-5" /> Follow</>}
          </button>

          {/* Stats Summary */}
          {user.privacy?.showStats !== false ? (
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
               <h4 className="text-slate-300 text-sm font-semibold mb-3">Comparison</h4>
               <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div className="text-slate-500">Stat</div>
                  <div className="text-cyan-400">You</div>
                  <div className="text-purple-400">@{user.username}</div>
                  
                  <div className="col-span-3 h-px bg-slate-700 my-1" />
                  
                  <div className="text-slate-400 text-left">Workouts</div>
                  <div className="font-bold">{myStats.totalWorkouts}</div>
                  <div className="font-bold">{userStats.totalWorkouts}</div>

                  <div className="text-slate-400 text-left">Streak</div>
                  <div className="font-bold">{myStats.currentStreak}</div>
                  <div className="font-bold">{userStats.currentStreak}</div>
               </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-800/30 rounded-xl text-center text-slate-500 text-sm">
              Stats are private
            </div>
          )}

          {/* --- HISTORY LOGS SECTION --- */}
          <div>
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              Recent Activity
            </h3>

            {sortedLogs.length === 0 ? (
              <p className="text-slate-500 text-center py-4">No logs available.</p>
            ) : (
              <div className="space-y-4">
                {sortedLogs.map(([date, log]) => {
                  const dailyCalories = log.meals.reduce((acc, m) => acc + m.calories, 0);
                  const dailyProtein = log.meals.reduce((acc, m) => acc + m.protein, 0);
                  const dailyCarbs = log.meals.reduce((acc, m) => acc + m.carbs, 0);
                  const dailyFat = log.meals.reduce((acc, m) => acc + m.fat, 0);
                  const musclesHit = getMusclesHit(log.workouts);

                  return (
                    <div key={date} className="bg-slate-800/40 rounded-xl p-4 border border-slate-800">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-white font-medium">
                          {format(parseISO(date), 'EEEE, MMM d')}
                        </h4>
                      </div>

                      <div className="space-y-4">
                        {/* 1. MUSCLES HIT TAGS */}
                        {canShowWorkouts && musclesHit.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {musclesHit.map(m => (
                              <span key={m} className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full border border-purple-500/30">
                                {m}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* 2. WORKOUT DETAILS */}
                        {canShowWorkouts && log.workouts.length > 0 && (
                          <div className="space-y-2 bg-slate-900/40 rounded-lg p-3">
                            <h5 className="text-xs text-slate-400 uppercase tracking-wider font-bold flex items-center gap-1">
                              <Dumbbell className="w-3 h-3" /> Workout
                            </h5>
                            {log.workouts.map((w, i) => (
                              <div key={i} className="text-sm">
                                <div className="text-purple-300 font-medium">{w.exerciseName}</div>
                                <div className="text-slate-400 text-xs mt-1 flex flex-wrap gap-2">
                                  {w.sets.map((set, sIdx) => (
                                    <span key={sIdx} className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                                      {set.weight}kg × {set.reps}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* 3. NUTRITION DETAILS */}
                        {canShowNutrition && (log.meals.length > 0 || log.waterIntake > 0) && (
                          <div className="space-y-2 bg-slate-900/40 rounded-lg p-3">
                             <h5 className="text-xs text-slate-400 uppercase tracking-wider font-bold flex items-center gap-1">
                               <Utensils className="w-3 h-3" /> Nutrition
                             </h5>
                             
                             {/* Daily Totals */}
                             <div className="grid grid-cols-4 gap-2 mb-3">
                               <div className="bg-slate-800 p-2 rounded text-center">
                                 <div className="text-xs text-slate-400">Cals</div>
                                 <div className="text-white font-bold">{dailyCalories}</div>
                               </div>
                               <div className="bg-slate-800 p-2 rounded text-center">
                                 <div className="text-xs text-slate-400">Prot</div>
                                 <div className="text-emerald-400 font-bold">{dailyProtein}g</div>
                               </div>
                               <div className="bg-slate-800 p-2 rounded text-center">
                                 <div className="text-xs text-slate-400">Carbs</div>
                                 <div className="text-amber-400 font-bold">{dailyCarbs}g</div>
                               </div>
                               <div className="bg-slate-800 p-2 rounded text-center">
                                 <div className="text-xs text-slate-400">Fat</div>
                                 <div className="text-rose-400 font-bold">{dailyFat}g</div>
                               </div>
                             </div>

                             {/* Individual Meals */}
                             {log.meals.map((meal, mIdx) => (
                               <div key={mIdx} className="text-xs border-l-2 border-slate-700 pl-2 py-1">
                                 <div className="text-slate-300 font-medium">{meal.description}</div>
                                 <div className="text-slate-500">
                                   {meal.calories}kcal • P: {meal.protein} C: {meal.carbs} F: {meal.fat}
                                 </div>
                               </div>
                             ))}

                             {/* Water */}
                             {log.waterIntake > 0 && (
                               <div className="flex items-center gap-2 text-xs text-cyan-400 mt-2 pt-2 border-t border-slate-800">
                                 <Droplets className="w-3 h-3" />
                                 <span>Water Intake: <b>{log.waterIntake}ml</b></span>
                               </div>
                             )}
                          </div>
                        )}

                        {/* Notes */}
                        {log.notes && (
                          <div className="bg-amber-500/5 p-2 rounded-lg text-xs text-amber-200/80 italic flex gap-2">
                             <MessageSquare className="w-3 h-3 mt-0.5 shrink-0" />
                             "{log.notes}"
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
