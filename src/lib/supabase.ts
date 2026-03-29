import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const trimmedSupabaseUrl = supabaseUrl?.trim();
const trimmedSupabaseAnonKey = supabaseAnonKey?.trim();

export let supabaseConfigured = false;
export let supabaseConfigError: string | null = null;

// When env vars are absent or invalid the module must still load so the React
// tree can mount and show the configuration warning banner. The placeholder
// client will fail every network call, but that is acceptable because
// supabaseConfigured guards all data operations in the app.
export let supabase = createClient('https://placeholder.supabase.co', 'placeholder');

if (trimmedSupabaseUrl && trimmedSupabaseAnonKey) {
  try {
    new URL(trimmedSupabaseUrl);
    supabase = createClient(trimmedSupabaseUrl, trimmedSupabaseAnonKey);
    supabaseConfigured = true;
  } catch {
    supabaseConfigError =
      'VITE_SUPABASE_URL değeri geçerli bir URL olmalı (ör. https://<proje-id>.supabase.co).';
  }
}

export interface Message {
  id: string;
  subject: string;
  user_message: string;
  image_url: string | null;
  ai_response: string | null;
  created_at: string;
}
