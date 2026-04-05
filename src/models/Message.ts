import { Reference } from "./Reference";

export interface Message {
  id: string;
  subject: string;
  user_message: string;
  image_url: string | null;
  ai_response: string | null;
  created_at: string;
  references: Reference[] | null;
  tokens: number;
  time_passed: number;
}
