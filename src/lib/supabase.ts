import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Message {
  id: string;
  subject: string;
  user_message: string;
  image_url: string | null;
  ai_response: string | null;
  created_at: string;
}
