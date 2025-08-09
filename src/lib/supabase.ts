import { createClient } from '@supabase/supabase-js';

// Get environment variables - no fallbacks that could cause URL concatenation issues
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Debug logging
if (typeof window !== 'undefined') {
  console.log('Supabase Client Debug Info:');
  console.log('URL:', supabaseUrl);
  console.log('Key exists:', !!supabaseAnonKey);
  console.log('Key length:', supabaseAnonKey?.length || 0);
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: supabaseUrl,
    keyExists: !!supabaseAnonKey
  });
  throw new Error('Missing Supabase environment variables');
}

// Ensure the URL is clean and doesn't have any concatenation issues
const cleanSupabaseUrl = supabaseUrl.trim();
console.log('Clean Supabase URL:', cleanSupabaseUrl);

export const supabase = createClient(cleanSupabaseUrl, supabaseAnonKey);

// Test the connection
if (typeof window !== 'undefined') {
  supabase.auth.getSession().then(({ data, error }) => {
    if (error) {
      console.error('Supabase connection test failed:', error);
    } else {
      console.log('Supabase connection test successful');
    }
  });
} 