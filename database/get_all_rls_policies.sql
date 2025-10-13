-- Get all RLS policies from Supabase database
-- This script retrieves all Row Level Security policies for inspection

-- Query 1: Get all policies with their details
SELECT 
  schemaname AS schema,
  tablename AS table_name,
  policyname AS policy_name,
  permissive,
  roles,
  cmd AS command,
  qual AS using_expression,
  with_check AS with_check_expression
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Query 2: Get table RLS status (enabled/disabled)
SELECT 
  schemaname AS schema,
  tablename AS table_name,
  rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Query 3: Get detailed policy information for payments table
SELECT 
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public' 
  AND tablename = 'payments';

-- Query 4: Get detailed policy information for all financial tables
SELECT 
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public' 
  AND tablename IN ('payments', 'escrow_accounts', 'financial_transactions', 'devices')
ORDER BY tablename, policyname;


