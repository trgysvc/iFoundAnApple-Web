-- Remove ALL check constraints for encrypted sensitive data
-- Date: 2025-10-24
-- Problem: Multiple constraints block encrypted data
-- Solution: Remove all format-checking constraints

-- Remove all check constraints
ALTER TABLE userprofile DROP CONSTRAINT IF EXISTS check_iban_format;
ALTER TABLE userprofile DROP CONSTRAINT IF EXISTS check_tc_kimlik_format;
ALTER TABLE userprofile DROP CONSTRAINT IF EXISTS check_phone_format;
ALTER TABLE userprofile DROP CONSTRAINT IF EXISTS check_tc_format;
ALTER TABLE userprofile DROP CONSTRAINT IF EXISTS check_phone_number_format;

-- Note: Format validation is done at APPLICATION level (security.ts validators)
-- Database only stores encrypted Base64 data, constraints cannot validate it

