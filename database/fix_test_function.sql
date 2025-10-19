-- =====================================================
-- QUICK FIX: test_admin_permissions() FUNCTION
-- Email type mismatch düzeltmesi
-- =====================================================

-- Hatalı fonksiyonu düzelt
CREATE OR REPLACE FUNCTION test_admin_permissions()
RETURNS TABLE (
  user_email TEXT,
  user_id UUID,
  is_admin BOOLEAN,
  is_super_admin BOOLEAN,
  role TEXT,
  permissions JSONB,
  expires_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    au.email::TEXT,  -- Cast to TEXT to match return type
    ap.user_id,
    is_admin(ap.user_id),
    is_super_admin(ap.user_id),
    ap.role,
    ap.permissions,
    ap.expires_at
  FROM admin_permissions ap
  JOIN auth.users au ON ap.user_id = au.id
  WHERE ap.is_active = TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Test et
SELECT 'FUNCTION FIXED' as status;
SELECT * FROM test_admin_permissions();
