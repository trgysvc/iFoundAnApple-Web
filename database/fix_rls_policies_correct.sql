-- Fix RLS Policies for devices table with CORRECT field names
-- Database uses camelCase field names (userId, not userid)

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own devices" ON public.devices;
DROP POLICY IF EXISTS "Users can insert own devices" ON public.devices;
DROP POLICY IF EXISTS "Users can update own devices" ON public.devices;

-- Create corrected policies with proper camelCase field names
CREATE POLICY "Users can view own devices" ON public.devices
  FOR SELECT USING (auth.uid() = "userId");  -- Use camelCase with quotes

CREATE POLICY "Users can insert own devices" ON public.devices
  FOR INSERT WITH CHECK (auth.uid() = "userId");  -- Use camelCase with quotes

CREATE POLICY "Users can update own devices" ON public.devices
  FOR UPDATE USING (auth.uid() = "userId");  -- Use camelCase with quotes

-- Verify the policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'devices';
