export interface Message {
  id: string;
  subject: string;
  user_message: string;
  image_url: string | null;
  ai_response: string | null;
  created_at: string;
}
