-- Migration: Add device_role column to devices table
-- This column explicitly stores whether the device record belongs to an owner (who lost it) or finder (who found it)
-- This makes it easier to determine which UI to show in DeviceDetailPage
-- Status is a dynamic field that changes throughout the process, so we need a separate column for role identification

-- Step 1: Add device_role column with CHECK constraint
-- Column is nullable initially to handle existing records, but new records will always have a value
ALTER TABLE public.devices 
ADD COLUMN IF NOT EXISTS device_role text CHECK (device_role IN ('owner', 'finder'));

-- Step 2: Set device_role based on existing lost_date/found_date columns
-- Priority: lost_date/lost_location → 'owner', found_date/found_location → 'finder'
-- If both exist, prioritize lost_date (owner takes precedence)
-- If status is LOST → 'owner', if status is REPORTED → 'finder'
UPDATE public.devices 
SET device_role = CASE 
  WHEN lost_date IS NOT NULL OR lost_location IS NOT NULL THEN 'owner'
  WHEN found_date IS NOT NULL OR found_location IS NOT NULL THEN 'finder'
  WHEN status = 'lost' THEN 'owner'
  WHEN status = 'reported' THEN 'finder'
  ELSE NULL -- Very rare edge case, will be set during next device update
END
WHERE device_role IS NULL;

-- Step 3: Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_devices_device_role ON public.devices(device_role) TABLESPACE pg_default;

-- Step 4: Add comment to column
COMMENT ON COLUMN public.devices.device_role IS 'Role of the device record: owner (who lost the device) or finder (who found the device). This field is set at device creation and never changes.';

-- Step 5: Verify migration
-- Check how many records were updated
SELECT 
  device_role,
  COUNT(*) as count
FROM public.devices
GROUP BY device_role;

-- Check for any NULL device_role records (should be minimal or zero)
SELECT 
  COUNT(*) as null_role_count
FROM public.devices
WHERE device_role IS NULL;

