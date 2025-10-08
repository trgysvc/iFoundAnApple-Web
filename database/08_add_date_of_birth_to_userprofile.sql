-- Add date_of_birth column to userprofile table
-- This column will store user's birth date for age verification and profile completeness

ALTER TABLE userprofile
ADD COLUMN IF NOT EXISTS date_of_birth DATE;

-- Create index for faster queries on birth date
CREATE INDEX IF NOT EXISTS idx_userprofile_date_of_birth ON userprofile(date_of_birth);

-- Add comment to column
COMMENT ON COLUMN userprofile.date_of_birth IS 'User date of birth (format: YYYY-MM-DD)';

-- Optional: Add check constraint to ensure date is not in the future
ALTER TABLE userprofile
ADD CONSTRAINT check_date_of_birth_not_future 
CHECK (date_of_birth IS NULL OR date_of_birth <= CURRENT_DATE);

-- Optional: Add check constraint to ensure user is at least 13 years old (COPPA compliance)
ALTER TABLE userprofile
ADD CONSTRAINT check_date_of_birth_minimum_age
CHECK (date_of_birth IS NULL OR date_of_birth <= CURRENT_DATE - INTERVAL '13 years');
