-- Check the actual schema of devices table
-- Run this to see the real column names

SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'devices' 
  AND table_schema = 'public'
ORDER BY ordinal_position;
