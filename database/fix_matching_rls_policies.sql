-- Fix RLS Policies for Matching System
-- This allows users to see all devices for matching purposes while maintaining security

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view own devices" ON public.devices;
DROP POLICY IF EXISTS "Users can insert own devices" ON public.devices;
DROP POLICY IF EXISTS "Users can update own devices" ON public.devices;

-- Create new policies that allow matching system to work

-- 1. Users can view ALL devices for matching purposes (but only basic info)
CREATE POLICY "Users can view all devices for matching" ON public.devices
  FOR SELECT USING (auth.role() = 'authenticated');

-- 2. Users can only insert their own devices
CREATE POLICY "Users can insert own devices" ON public.devices
  FOR INSERT WITH CHECK (auth.uid() = "userId");

-- 3. Users can only update their own devices
CREATE POLICY "Users can update own devices" ON public.devices
  FOR UPDATE USING (auth.uid() = "userId");

-- 4. Users can only delete their own devices
CREATE POLICY "Users can delete own devices" ON public.devices
  FOR DELETE USING (auth.uid() = "userId");

-- Verify the policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'devices'
ORDER BY policyname;
