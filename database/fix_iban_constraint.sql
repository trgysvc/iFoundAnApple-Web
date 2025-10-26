-- Fix IBAN constraint for encrypted data
-- Date: 2025-10-24
-- Problem: check_iban_format constraint blocks encrypted IBAN data
-- Solution: Remove or modify the constraint to accept encrypted data

-- Option 1: Drop the constraint (recommended for encrypted data)
ALTER TABLE userprofile DROP CONSTRAINT IF EXISTS check_iban_format;

-- Option 2: Modify constraint to accept longer encrypted data
-- (Only if you want to keep the constraint for plain text validation)
-- ALTER TABLE userprofile DROP CONSTRAINT IF EXISTS check_iban_format;
-- ALTER TABLE userprofile ADD CONSTRAINT check_iban_format 
--   CHECK (iban IS NULL OR iban ~ '^[A-Za-z0-9+/=]{20,}$');

-- Note: With encryption, validation should be done at application level,
-- not at database level. Database stores encrypted Base64 data.

