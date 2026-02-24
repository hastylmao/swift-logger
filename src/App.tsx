import { useState, useEffect } from 'react'
import { 
  Dumbbell, 
  Calendar, 
  Trophy, 
  BarChart3, 
  User,
  Users,
  Flame,
  LogOut
} from 'lucide-react'
import { TodayView } from './components/TodayView'
import { HistoryView } from './components/HistoryView'
import { AchievementsView } from './components/AchievementsView'
import { StatsView } from './components/StatsView'
import { ProfileView } from './components/ProfileView'
import { CompareView } from './components/CompareView'
import { AuthScreen } from './components/AuthScreen'
import { AchievementNotification } from './components/AchievementNotification'
import { useStore } from './store/useStore'
import { useSupabaseSync } from './hooks/useSupabaseData'
import { supabase, isSupabaseConfigured } from './lib/supabase'
import { 
  calculateAchievementStats, 
  checkNewAchievements,
  Achievement 
} from './data/achievements'

type ViewType = 'today' | 'history' | 'compare' | 'achievements' | 'stats' | 'profile'

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>('today')
  const [userId, setUserId] = useState<string | null>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [achievementQueue, setAchievementQueue] = useState<Achievement[]>([])
  
  const { logs, getTodayLog, unlockedAchievements, unlockAchievement } = useStore()

  // Set up Supabase sync
  useSupabaseSync(userId)

  // Check for auth session on mount
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setIsAuthLoading(false)
      return
    }

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUserId(session?.user?.id || null)
      setIsAuthLoading(false)
    }

    checkSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUserId(session?.user?.id || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Check for new achievements when logs change
  useEffect(() => {
    const currentLog = getTodayLog()
    const data = calculateAchievementStats(logs, currentLog)
    const newAchievements = checkNewAchievements(
      data, 
      unlockedAchievements.map(a => typeof a === 'string' ? { id: a, unlockedAt: '' } : a)
    )
    
    if (newAchievements.length > 0) {
      newAchievements.forEach(a => unlockAchievement(a.id))
      setAchievementQueue(prev => [...prev, ...newAchievements])
    }
  }, [logs])

  // Calculate current streak
  const currentStreak = (() => {
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
  })();

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUserId(null)
  }

  const navItems = [
    { id: 'today' as const, icon: Dumbbell, label: 'Today' },
    { id: 'history' as const, icon: Calendar, label: 'History' },
    { id: 'compare' as const, icon: Users, label: 'Compare' },
    { id: 'achievements' as const, icon: Trophy, label: 'Achieve' },
    { id: 'stats' as const, icon: BarChart3, label: 'Stats' },
    { id: 'profile' as const, icon: User, label: 'Profile' },
  ]

  const renderView = () => {
    switch (activeView) {
      case 'today':
        return <TodayView />
      case 'history':
        return <HistoryView />
      case 'compare':
        return <CompareView />
      case 'achievements':
        return <AchievementsView />
      case 'stats':
        return <StatsView />
      case 'profile':
        return <ProfileView />
      default:
        return <TodayView />
    }
  }

  // Show loading while checking auth
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center animate-pulse">
          <Dumbbell className="w-6 h-6 text-white" />
        </div>
      </div>
    )
  }

  // Show auth screen if Supabase is configured but user is not logged in
  if (isSupabaseConfigured() && !userId) {
    return <AuthScreen onAuthSuccess={() => {}} />
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      {/* Achievement Notifications */}
      {achievementQueue.length > 0 && (
        <AchievementNotification
          achievement={achievementQueue[0]}
          onClose={() => setAchievementQueue(prev => prev.slice(1))}
        />
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="px-4 py-3 flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-none">
                Swift Logger
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {currentStreak > 0 && (
              <div className="flex items-center gap-1 px-2.5 py-1 bg-orange-500/15 border border-orange-500/25 rounded-full">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-xs font-semibold text-orange-400">{currentStreak}</span>
              </div>
            )}
            
            {userId && (
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-all border border-white/5"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-4 max-w-lg mx-auto">
        {renderView()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-slate-900/90 backdrop-blur-xl border-t border-white/5 shadow-2xl">
          <div className="flex justify-around items-center py-2 px-2 max-w-lg mx-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeView === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl transition-all duration-200 ${
                    isActive 
                      ? 'text-cyan-400' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-cyan-400/15' : ''}`}>
                    <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
                  </div>
                  <span className={`text-[10px] font-medium ${isActive ? 'text-cyan-400' : ''}`}>{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>
    </div>
  )
}
