import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tmmspowmykvukjvydwdr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtbXNwb3dteWt2dWtqdnlkd2RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NzA2MjQsImV4cCI6MjA4NjA0NjYyNH0.gA4boIjCRiq7CzFaXfK6K81y2w0PqexgrncsOYy_p6w';

// Create the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Always configured since we have real credentials
export const isSupabaseConfigured = (): boolean => {
  return true;
};
