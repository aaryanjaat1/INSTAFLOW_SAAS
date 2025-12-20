
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

export const signInWithFacebook = async () => {
  return await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      // Official Meta Graph API scopes for Instagram Business Management
      // pages_show_list: View list of pages user manages
      // instagram_basic: Basic account info
      // instagram_manage_messages: Direct Message automation
      // pages_read_engagement: Read comments/engagement
      // instagram_manage_comments: Reply to and manage comments
      // public_profile: Basic FB user info
      scopes: 'pages_show_list,instagram_basic,instagram_manage_messages,pages_read_engagement,instagram_manage_comments,public_profile',
      redirectTo: `${window.location.origin}/#accounts`
    }
  });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};
