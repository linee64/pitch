import { createClient } from '@supabase/supabase-js';

// Get the env variables
let supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

// Check if the URL is actually a valid HTTP URL. If a user pastes a key by mistake, fallback to placeholder to prevent React crash.
if (!supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
  console.warn('VITE_SUPABASE_URL is not a valid URL. Falling back to placeholder.');
  supabaseUrl = 'https://placeholder.supabase.co';
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
