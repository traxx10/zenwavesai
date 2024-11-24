// Utils/supabaseClient.ts
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';


// Supabase URL and Key (Replace with environment variables in production)
const SUPABASE_URL = 'https://kgtrftcgajybtvoagryx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtndHJmdGNnYWp5YnR2b2Fncnl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA1NDc4NzksImV4cCI6MjA0NjEyMzg3OX0.tbgLJ1Vqi93Z6Aj9JI-wXH2QrCCn8zYs_WOJy_-idnA';

// Create Supabase client with AsyncStorage for auth persistence
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export default supabase;
