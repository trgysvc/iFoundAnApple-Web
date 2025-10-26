-- Check if data is encrypted in database
-- Compare plain text vs encrypted data

-- Check your profile data
SELECT 
    id,
    user_id,
    first_name,
    last_name,
    -- Check if TC Kimlik is encrypted (should be ~48 chars base64)
    tc_kimlik_no,
    LENGTH(tc_kimlik_no) as tc_length,
    CASE 
        WHEN LENGTH(tc_kimlik_no) = 11 AND tc_kimlik_no ~ '^[0-9]+$' THEN 'PLAIN TEXT ⚠️'
        WHEN LENGTH(tc_kimlik_no) > 40 AND tc_kimlik_no ~ '^[A-Za-z0-9+/=]+$' THEN 'ENCRYPTED ✅'
        ELSE 'UNKNOWN'
    END as tc_status,
    -- Check IBAN
    iban,
    LENGTH(iban) as iban_length,
    CASE 
        WHEN LENGTH(iban) = 26 AND iban LIKE 'TR%' THEN 'PLAIN TEXT ⚠️'
        WHEN LENGTH(iban) > 40 AND iban ~ '^[A-Za-z0-9+/=]+$' THEN 'ENCRYPTED ✅'
        ELSE 'UNKNOWN'
    END as iban_status,
    phone_number,
    LEFT(address, 50) as address_preview,
    updated_at
FROM userprofile
WHERE user_id = '81550ccd-bc38-4757-b94f-1bf4616f622f'; -- Your user ID

-- Alternative: Check all users (last 5)
-- SELECT 
--     user_id,
--     tc_kimlik_no,
--     LENGTH(tc_kimlik_no) as tc_length,
--     iban,
--     LENGTH(iban) as iban_length
-- FROM userprofile
-- ORDER BY updated_at DESC
-- LIMIT 5;

