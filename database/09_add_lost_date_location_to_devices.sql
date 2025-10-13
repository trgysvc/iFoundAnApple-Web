-- Migration: Add lost_date and lost_location columns to devices table
-- Created: 2024-12-19
-- Purpose: Add fields to track when and where the device was lost

-- Add lost_date column (DATE type to store when the device was lost)
ALTER TABLE devices 
ADD COLUMN lost_date DATE;

-- Add lost_location column (TEXT type to store where the device was lost)
ALTER TABLE devices 
ADD COLUMN lost_location TEXT;

-- Add comments for documentation
COMMENT ON COLUMN devices.lost_date IS 'Date when the device was lost (YYYY-MM-DD format)';
COMMENT ON COLUMN devices.lost_location IS 'Location where the device was lost (free text description)';

-- Create index on lost_date for better query performance
CREATE INDEX idx_devices_lost_date ON devices(lost_date);

-- Create index on lost_location for better search performance (using GIN for full-text search)
CREATE INDEX idx_devices_lost_location_gin ON devices USING gin(to_tsvector('turkish', lost_location));

-- Update RLS policies to include new columns (if needed)
-- The existing RLS policies should automatically include these new columns
-- since they use SELECT * or are applied at the table level

-- Verify the changes
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'devices' 
  AND column_name IN ('lost_date', 'lost_location')
ORDER BY column_name;
