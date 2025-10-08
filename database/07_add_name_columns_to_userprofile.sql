-- Add first_name and last_name columns to userprofile table
-- This migration ensures all user profile data is stored in the userprofile table

ALTER TABLE userprofile
ADD COLUMN IF NOT EXISTS first_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS last_name VARCHAR(100);

-- Create index for faster searches on names
CREATE INDEX IF NOT EXISTS idx_userprofile_names ON userprofile(first_name, last_name);

-- Add comment to table
COMMENT ON COLUMN userprofile.first_name IS 'User first name';
COMMENT ON COLUMN userprofile.last_name IS 'User last name';

-- Update existing records: Split full_name from auth.users metadata if it exists
-- This is a one-time migration to populate existing data
DO $$
DECLARE
    user_record RECORD;
    full_name_value TEXT;
    name_parts TEXT[];
BEGIN
    FOR user_record IN 
        SELECT up.user_id, au.raw_user_meta_data
        FROM userprofile up
        JOIN auth.users au ON up.user_id = au.id
        WHERE up.first_name IS NULL OR up.last_name IS NULL
    LOOP
        -- Get full_name from user metadata
        full_name_value := user_record.raw_user_meta_data->>'full_name';
        
        IF full_name_value IS NOT NULL THEN
            -- Split name by space
            name_parts := string_to_array(full_name_value, ' ');
            
            -- Update userprofile with split names
            IF array_length(name_parts, 1) >= 2 THEN
                UPDATE userprofile
                SET 
                    first_name = name_parts[1],
                    last_name = array_to_string(name_parts[2:array_length(name_parts, 1)], ' ')
                WHERE user_id = user_record.user_id;
            ELSIF array_length(name_parts, 1) = 1 THEN
                UPDATE userprofile
                SET 
                    first_name = name_parts[1],
                    last_name = ''
                WHERE user_id = user_record.user_id;
            END IF;
        END IF;
    END LOOP;
END $$;
