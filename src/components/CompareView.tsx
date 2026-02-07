import { useState } from 'react';
import { 
  Search, 
  Users, 
  UserPlus,
  Trophy,
  Dumbbell,
  Flame,
  Target,
  Eye,
  X,
  Check,
  ChevronRight,
  User as UserIcon
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { cn } from '@/utils/cn';
import { UserProfile } from '@/types';

interface PublicProfile {
  id: string;
  username: string;
  bio?: string;
  profile_data?: UserProfile;
  stats?: {
    totalWorkouts: number;
    totalSets: number;
    currentStreak: number;
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

  // Calculate current user stats
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
        .from('profiles')
        .select('*')
        .ilike('username', `%${searchTerm.toLowerCase()}%`)
        .limit(10);

      if (error) throw error;
      
      setSearchResults((data || []).map((p: Record<string, unknown>) => ({
        id: p.id as string,
        username: p.username as string,
        bio: (p.profile_data as UserProfile | undefined)?.bio,
        profile_data: p.profile_data as UserProfile | undefined,
        privacy: (p.profile_data as UserProfile | undefined)?.privacy,
      })));
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
    // In production, this would save to Supabase
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
          <p className="text-slate-500 text-xs">
            Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.
          </p>
        </div>

        {/* My Stats (still show local stats) */}
        <div className="bg-gradient-to-br from-cyan-500/20 via-slate-900 to-slate-900 rounded-2xl p-5 border border-cyan-500/30">
          <h3 className="text-white font-semibold mb-4">My Stats</h3>
          <div className="grid grid-cols-2 gap-3">
            <StatCard icon={<Dumbbell className="w-4 h-4" />} label="Workouts" value={myStats.totalWorkouts} color="purple" />
            <StatCard icon={<Target className="w-4 h-4" />} label="Total Sets" value={myStats.totalSets} color="cyan" />
            <StatCard icon={<Trophy className="w-4 h-4" />} label="Volume" value={`${(myStats.totalVolume / 1000).toFixed(1)}k`} color="amber" />
            <StatCard icon={<Flame className="w-4 h-4" />} label="Streak" value={myStats.currentStreak} color="orange" />
          </div>
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
          {/* Search Input */}
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

          {/* Search Results */}
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

          {searchTerm && searchResults.length === 0 && !isSearching && (
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 text-center">
              <p className="text-slate-400">No users found matching "{searchTerm}"</p>
            </div>
          )}
        </div>
      )}

      {/* Following Tab */}
      {activeTab === 'following' && (
        <div className="space-y-2">
          {following.length === 0 ? (
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 text-center">
              <UserPlus className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">You're not following anyone yet</p>
              <p className="text-slate-500 text-sm">Search for friends to follow them!</p>
            </div>
          ) : (
            following.map((userId) => (
              <div key={userId} className="bg-slate-900 rounded-xl p-4 border border-slate-800">
                <p className="text-white">User ID: {userId}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Followers Tab */}
      {activeTab === 'followers' && (
        <div className="space-y-2">
          {followers.length === 0 ? (
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 text-center">
              <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No followers yet</p>
              <p className="text-slate-500 text-sm">Share your username with friends!</p>
            </div>
          ) : (
            followers.map((userId) => (
              <div key={userId} className="bg-slate-900 rounded-xl p-4 border border-slate-800">
                <p className="text-white">User ID: {userId}</p>
              </div>
            ))
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

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: 'purple' | 'cyan' | 'amber' | 'orange' | 'green';
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  const colorClasses = {
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    green: 'text-green-400 bg-green-500/10 border-green-500/20',
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
  myStats: {
    totalWorkouts: number;
    totalSets: number;
    totalVolume: number;
    currentStreak: number;
  };
}

function UserProfileModal({ user, isFollowing, onFollow, onClose, myStats }: UserProfileModalProps) {
  const canShowStats = user.privacy?.showStats !== false;
  
  // Mock user stats (in production, these would come from Supabase)
  const userStats = user.stats || {
    totalWorkouts: Math.floor(Math.random() * 200),
    totalSets: Math.floor(Math.random() * 1000),
    currentStreak: Math.floor(Math.random() * 30),
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center">
      <div className="bg-slate-900 w-full max-w-lg rounded-t-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-white text-lg font-semibold">@{user.username}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-4">
          {/* User Header */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-white text-xl font-bold">@{user.username}</h2>
              {user.bio && <p className="text-slate-400">{user.bio}</p>}
            </div>
          </div>

          {/* Follow Button */}
          <button
            onClick={onFollow}
            className={cn(
              "w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors",
              isFollowing
                ? "bg-slate-800 text-slate-300"
                : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            )}
          >
            {isFollowing ? (
              <>
                <Check className="w-5 h-5" />
                Following
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Follow
              </>
            )}
          </button>

          {/* Stats Comparison */}
          {canShowStats ? (
            <div className="space-y-3">
              <h4 className="text-white font-semibold flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Stats Comparison
              </h4>
              
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <table className="w-full">
                  <thead>
                    <tr className="text-slate-400 text-sm">
                      <th className="text-left py-2">Stat</th>
                      <th className="text-center py-2">You</th>
                      <th className="text-center py-2">@{user.username}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-slate-700">
                      <td className="py-3 text-slate-300">Workouts</td>
                      <td className="py-3 text-center">
                        <span className="text-cyan-400 font-bold">{myStats.totalWorkouts}</span>
                      </td>
                      <td className="py-3 text-center">
                        <span className="text-purple-400 font-bold">{userStats.totalWorkouts}</span>
                      </td>
                    </tr>
                    <tr className="border-t border-slate-700">
                      <td className="py-3 text-slate-300">Total Sets</td>
                      <td className="py-3 text-center">
                        <span className="text-cyan-400 font-bold">{myStats.totalSets}</span>
                      </td>
                      <td className="py-3 text-center">
                        <span className="text-purple-400 font-bold">{userStats.totalSets}</span>
                      </td>
                    </tr>
                    <tr className="border-t border-slate-700">
                      <td className="py-3 text-slate-300">Current Streak</td>
                      <td className="py-3 text-center">
                        <span className="text-cyan-400 font-bold">{myStats.currentStreak}</span>
                      </td>
                      <td className="py-3 text-center">
                        <span className="text-purple-400 font-bold">{userStats.currentStreak}</span>
                      </td>
                    </tr>
                    <tr className="border-t border-slate-700">
                      <td className="py-3 text-slate-300">Total Volume</td>
                      <td className="py-3 text-center">
                        <span className="text-cyan-400 font-bold">{(myStats.totalVolume / 1000).toFixed(1)}k</span>
                      </td>
                      <td className="py-3 text-center">
                        <span className="text-slate-500">-</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 text-center">
              <Eye className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400">This user's stats are private</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
