import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Check your .env file.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

export const getFriendlyErrorMessage = (error: any, fallbackMessage: string = 'An unexpected error occurred'): string => {
  if (!error) return fallbackMessage;
  const msg = typeof error === 'string' ? error : (error.message || '');
  if (
    !navigator.onLine || 
    msg.includes('Failed to fetch') || 
    msg.includes('network') || 
    msg.includes('TypeError') ||
    msg.includes('fetch')
  ) {
    return 'Connection error: Please check your internet connection and try again.';
  }
  return msg || fallbackMessage;
};
