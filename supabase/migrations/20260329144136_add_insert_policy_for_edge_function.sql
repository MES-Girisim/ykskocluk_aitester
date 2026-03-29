/*
  # Add secure INSERT policy for Edge Function

  1. Security Policy
    - Allow Edge Function (with SERVICE_ROLE_KEY) to insert messages
    - This uses Supabase's service role which has elevated privileges
    - Regular users still cannot insert directly via RLS
    
  2. Implementation
    - The policy checks if the request is from a service role context
    - Only the backend Edge Function can insert messages
*/

CREATE POLICY "Edge Function can insert messages"
  ON messages
  FOR INSERT
  TO service_role
  WITH CHECK (true);