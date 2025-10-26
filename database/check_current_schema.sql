-- Check current userprofile table schema and constraints
-- This will help us see what needs to be fixed

-- 1. Check column types
SELECT 
    column_name, 
    data_type, 
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'userprofile' 
  AND column_name IN ('tc_kimlik_no', 'iban', 'phone_number', 'address')
ORDER BY ordinal_position;

-- 2. Check existing constraints
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(c.oid) as constraint_definition
FROM pg_constraint c
JOIN pg_namespace n ON n.oid = c.connamespace
JOIN pg_class cl ON cl.oid = c.conrelid
WHERE cl.relname = 'userprofile'
  AND conname LIKE '%check%'
ORDER BY conname;

-- 3. Check if there's any data
SELECT 
    id,
    user_id,
    first_name,
    last_name,
    tc_kimlik_no,
    iban,
    phone_number,
    LEFT(address, 50) as address_preview,
    created_at,
    updated_at
FROM userprofile
LIMIT 5;

