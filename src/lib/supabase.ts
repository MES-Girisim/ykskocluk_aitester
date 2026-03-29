import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// When env vars are absent the module must still load so the React tree can
// mount and show the configuration warning banner. The placeholder client will
// fail every network call, but that is acceptable because supabaseConfigured
// guards all data operations in the app.
export const supabase = supabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : createClient('https://placeholder.supabase.co', 'placeholder');

export interface Message {
  id: string;
  subject: string;
  user_message: string;
  image_url: string | null;
  ai_response: string | null;
  created_at: string;
}
