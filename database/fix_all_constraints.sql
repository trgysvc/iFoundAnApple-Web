-- Fix all constraints for encrypted sensitive data
-- Date: 2025-10-24
-- Problem: Database constraints block encrypted data (Base64 format)
-- Solution: Drop constraints for encrypted fields

-- Drop IBAN format constraint
ALTER TABLE userprofile DROP CONSTRAINT IF EXISTS check_iban_format;

-- Drop phone number format constraint (if exists)
ALTER TABLE userprofile DROP CONSTRAINT IF EXISTS check_phone_format;

-- Drop any other format constraints
ALTER TABLE userprofile DROP CONSTRAINT IF EXISTS check_tc_format;

-- Note: 
-- With encryption, validation should be done at APPLICATION level (security.ts)
-- Database only stores encrypted Base64 data
-- Constraints cannot validate encrypted data format

