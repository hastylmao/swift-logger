import { useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useStore } from '../store/useStore';
import { DailyLog } from '../types';

export function useSupabaseSync(userId: string | null) {
  const store = useStore();
  const lastSyncRef = useRef<string>('');
  const isLoadingRef = useRef(false);

// Load data from Supabase when user logs in
  useEffect(() => {
    // 1. If user logs out, clear the store immediately
    if (!userId) {
      store.reset();
      return;
    }

    if (!isSupabaseConfigured()) return;

    const loadData = async () => {
      // 2. Lock saving so we don't save empty state during load
      isLoadingRef.current = true;
      
      // 3. Clear previous user data before loading new data
      store.reset(); 
      
      try {
        const { data, error } = await supabase
          .from('user_data')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading data:', error);
          return;
        }

        if (data?.data) {
          const userData = data.data;
          
          // Load profile
          if (userData.profile) {
            store.setProfile(userData.profile);
          }
          
          // Load daily logs
          if (userData.logs) {
            Object.entries(userData.logs).forEach(([date, log]) => {
              const dailyLog = log as DailyLog;
              dailyLog.workouts?.forEach(w => store.addWorkoutExercise(date, w));
              dailyLog.meals?.forEach(m => store.addMeal(date, m));
              if (dailyLog.waterIntake) store.setWater(date, dailyLog.waterIntake);
              dailyLog.postWorkoutImages?.forEach(img => store.addPostWorkoutImage(date, img));
              if (dailyLog.notes) store.setNotes(date, dailyLog.notes);
            });
          }
          
          // Load achievements
          if (userData.unlockedAchievements) {
            userData.unlockedAchievements.forEach((achievement: { id: string }) => {
              const id = typeof achievement === 'string' ? achievement : achievement.id;
              store.unlockAchievement(id);
            });
          }

          lastSyncRef.current = JSON.stringify(userData);
        }
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        // 4. Unlock saving only after everything is loaded
        isLoadingRef.current = false;
      }
    };

    loadData();
  }, [userId]);

  // Save data to Supabase when store changes
  useEffect(() => {
    if (!userId || isLoadingRef.current || !isSupabaseConfigured()) return;

    const saveData = async () => {
      const userData = {
        profile: store.profile,
        logs: store.logs,
        unlockedAchievements: store.unlockedAchievements,
      };

      const currentData = JSON.stringify(userData);
      
      // Don't save if nothing changed
      if (currentData === lastSyncRef.current) return;
      
      lastSyncRef.current = currentData;

      try {
        const { error } = await supabase
          .from('user_data')
          .upsert({
            user_id: userId,
            data: userData,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id'
          });

        if (error) {
          console.error('Error saving data:', error);
        }
      } catch (err) {
        console.error('Error saving data:', err);
      }
    };

    // Debounce saves
    const timeout = setTimeout(saveData, 1000);
    return () => clearTimeout(timeout);
  }, [userId, store.profile, store.logs, store.unlockedAchievements]);

  return null;
}
