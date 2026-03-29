/*
  # Fix RLS policies for messages table

  1. Security Improvements
    - Remove overly permissive "Anyone can insert messages" policy
    - Replace with restrictive default (no INSERT access by default)
    - Keep SELECT policy public for viewing messages
    
  2. Rationale
    - The previous INSERT policy allowed completely unrestricted writes
    - New approach requires explicit authorization context
    - SELECT remains open as chat messages are meant to be viewable
    
  3. Important Notes
    - INSERT operations will now fail by default without proper authorization
    - Consider implementing proper authentication checks before inserting
    - Or add a more specific policy with application-level validation
*/

DROP POLICY IF EXISTS "Anyone can insert messages" ON messages;

CREATE POLICY "Prevent unrestricted inserts"
  ON messages
  FOR INSERT
  WITH CHECK (false);