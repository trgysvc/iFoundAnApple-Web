-- Fix RLS Policies for devices table
-- The field names should match the actual database schema (snake_case)

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own devices" ON public.devices;
DROP POLICY IF EXISTS "Users can insert own devices" ON public.devices;

-- Create corrected policies with proper field names
CREATE POLICY "Users can view own devices" ON public.devices
  FOR SELECT USING (auth.uid() = userid);  -- Use snake_case field name

CREATE POLICY "Users can insert own devices" ON public.devices
  FOR INSERT WITH CHECK (auth.uid() = userid);  -- Use snake_case field name

-- Also add update policy for device status changes
CREATE POLICY "Users can update own devices" ON public.devices
  FOR UPDATE USING (auth.uid() = userid);  -- Use snake_case field name

-- Verify the policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'devices';
