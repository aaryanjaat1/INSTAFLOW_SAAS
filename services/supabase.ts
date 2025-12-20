
import { createClient } from '@supabase/supabase-js';

// Using provided Supabase credentials for production-ready connectivity
const supabaseUrl = 'https://xnkbfwqadcvpvtbmeldl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhua2Jmd3FhZGN2cHZ0Ym1lbGRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMzg1NTcsImV4cCI6MjA4MTgxNDU1N30.PttPgVZ-Sd_TM7Y-ZKUROj6uS8lhwLgNcjrjit3v4Gk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const signInWithGoogle = async () => {
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin
    }
  });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};
