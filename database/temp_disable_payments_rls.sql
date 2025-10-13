-- TEMPORARY: Disable RLS for payments table to test if RLS is blocking inserts
-- This is for TESTING ONLY - will re-enable after confirming the issue

-- Disable RLS on payments table
ALTER TABLE public.payments DISABLE ROW LEVEL SECURITY;

-- Note: Run this to RE-ENABLE after testing:
-- ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;


