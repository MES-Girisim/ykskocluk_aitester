/*
  # Create messages table for AI chat application

  1. New Tables
    - `messages`
      - `id` (uuid, primary key) - Unique identifier for each message
      - `subject` (text) - Selected subject (matematik, biyoloji, etc.)
      - `user_message` (text) - User's message
      - `image_url` (text, nullable) - Optional image URL
      - `ai_response` (text, nullable) - AI's response
      - `created_at` (timestamptz) - Message timestamp

  2. Security
    - Enable RLS on `messages` table
    - Add policy for public insert (anyone can send messages)
    - Add policy for public select (anyone can view messages)
    
  Note: In a production app, you would restrict these policies to authenticated users only.
*/

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  user_message text NOT NULL,
  image_url text,
  ai_response text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert messages"
  ON messages
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view messages"
  ON messages
  FOR SELECT
  USING (true);