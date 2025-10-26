-- Migration: Expand sensitive fields for encryption
-- Date: 2025-10-24
-- Purpose: Encrypted data is longer than plain text, need to expand columns

-- Expand encrypted field columns
ALTER TABLE userprofile 
  ALTER COLUMN tc_kimlik_no TYPE text,
  ALTER COLUMN iban TYPE text,
  ALTER COLUMN phone_number TYPE text,
  ALTER COLUMN address TYPE text;

-- Add comment to document the change
COMMENT ON COLUMN userprofile.tc_kimlik_no IS 'TC Kimlik No (encrypted, base64)';
COMMENT ON COLUMN userprofile.iban IS 'IBAN (encrypted, base64)';
COMMENT ON COLUMN userprofile.phone_number IS 'Phone Number (encrypted, base64)';
COMMENT ON COLUMN userprofile.address IS 'Address (encrypted, base64)';

