-- =====================================================
-- ADMIN PERMISSION SYSTEM TEST SCRIPT
-- Kurulum sonrası test ve doğrulama
-- =====================================================

-- 1. TABLO VARLIĞINI KONTROL ET
-- =====================================================
SELECT 
  'TABLE CHECK' as test_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_permissions') 
    THEN '✅ admin_permissions table exists'
    ELSE '❌ admin_permissions table missing'
  END as result;

-- 2. INDEX VARLIĞINI KONTROL ET
-- =====================================================
SELECT 
  'INDEX CHECK' as test_type,
  indexname,
  CASE 
    WHEN indexname IS NOT NULL THEN '✅ Index exists'
    ELSE '❌ Index missing'
  END as result
FROM pg_indexes 
WHERE tablename = 'admin_permissions';

-- 3. RLS DURUMUNU KONTROL ET
-- =====================================================
SELECT 
  'RLS CHECK' as test_type,
  schemaname,
  tablename,
  rowsecurity as rls_enabled,
  CASE 
    WHEN rowsecurity = true THEN '✅ RLS enabled'
    ELSE '❌ RLS disabled'
  END as result
FROM pg_tables 
WHERE tablename = 'admin_permissions';

-- 4. POLİTİKA VARLIĞINI KONTROL ET
-- =====================================================
SELECT 
  'POLICY CHECK' as test_type,
  policyname,
  CASE 
    WHEN policyname IS NOT NULL THEN '✅ Policy exists'
    ELSE '❌ Policy missing'
  END as result
FROM pg_policies 
WHERE tablename = 'admin_permissions';

-- 5. FONKSİYON VARLIĞINI KONTROL ET
-- =====================================================
SELECT 
  'FUNCTION CHECK' as test_type,
  proname as function_name,
  CASE 
    WHEN proname IS NOT NULL THEN '✅ Function exists'
    ELSE '❌ Function missing'
  END as result
FROM pg_proc 
WHERE proname IN ('is_admin', 'is_super_admin');

-- 6. SUPER ADMIN VARLIĞINI KONTROL ET
-- =====================================================
SELECT 
  'SUPER ADMIN CHECK' as test_type,
  au.email,
  ap.role,
  ap.is_active,
  ap.granted_at,
  CASE 
    WHEN ap.role = 'super_admin' AND ap.is_active = true THEN '✅ Super admin exists'
    ELSE '❌ Super admin missing or inactive'
  END as result
FROM admin_permissions ap
JOIN auth.users au ON ap.user_id = au.id
WHERE au.email = 'turgaysavaci@gmail.com';

-- 7. YETKİ DETAYLARINI KONTROL ET
-- =====================================================
SELECT 
  'PERMISSION DETAILS' as test_type,
  au.email,
  ap.role,
  ap.permissions,
  ap.expires_at,
  ap.notes
FROM admin_permissions ap
JOIN auth.users au ON ap.user_id = au.id
WHERE au.email = 'turgaysavaci@gmail.com';

-- 8. FONKSİYON TESTLERİ
-- =====================================================
-- Not: Bu testler sadece turgaysavaci@gmail.com ile giriş yapıldığında çalışır
SELECT 
  'FUNCTION TEST' as test_type,
  'is_admin()' as function_name,
  CASE 
    WHEN is_admin() = true THEN '✅ User is admin'
    ELSE '❌ User is not admin'
  END as result;

SELECT 
  'FUNCTION TEST' as test_type,
  'is_super_admin()' as function_name,
  CASE 
    WHEN is_super_admin() = true THEN '✅ User is super admin'
    ELSE '❌ User is not super admin'
  END as result;

-- 9. AUDIT LOG KONTROLÜ
-- =====================================================
SELECT 
  'AUDIT LOG CHECK' as test_type,
  COUNT(*) as log_count,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Audit logs exist'
    ELSE '❌ No audit logs found'
  END as result
FROM audit_logs 
WHERE event_type LIKE '%admin_permission%';

-- 10. GENEL SİSTEM DURUMU
-- =====================================================
SELECT 
  'SYSTEM STATUS' as test_type,
  'Admin Permission System' as component,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM admin_permissions ap
      JOIN auth.users au ON ap.user_id = au.id
      WHERE au.email = 'turgaysavaci@gmail.com'
      AND ap.role = 'super_admin'
      AND ap.is_active = true
    ) THEN '✅ System ready'
    ELSE '❌ System not ready'
  END as status;

-- 11. KURULUM ÖZETİ
-- =====================================================
SELECT 
  'SETUP SUMMARY' as test_type,
  'Total admin permissions' as metric,
  COUNT(*) as value
FROM admin_permissions;

SELECT 
  'SETUP SUMMARY' as test_type,
  'Active admin permissions' as metric,
  COUNT(*) as value
FROM admin_permissions 
WHERE is_active = true;

SELECT 
  'SETUP SUMMARY' as test_type,
  'Super admin count' as metric,
  COUNT(*) as value
FROM admin_permissions 
WHERE role = 'super_admin' AND is_active = true;

-- 12. BAŞARILI KURULUM MESAJI
-- =====================================================
DO $$
DECLARE
  admin_count INTEGER;
  super_admin_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO admin_count FROM admin_permissions WHERE is_active = true;
  SELECT COUNT(*) INTO super_admin_count FROM admin_permissions WHERE role = 'super_admin' AND is_active = true;
  
  IF super_admin_count > 0 THEN
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'ADMIN PERMISSION SYSTEM TEST COMPLETED SUCCESSFULLY';
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'Total Admin Permissions: %', admin_count;
    RAISE NOTICE 'Super Admin Count: %', super_admin_count;
    RAISE NOTICE 'System Status: READY';
    RAISE NOTICE '=====================================================';
  ELSE
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'ADMIN PERMISSION SYSTEM TEST FAILED';
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'No super admin found!';
    RAISE NOTICE 'Please check the setup process.';
    RAISE NOTICE '=====================================================';
  END IF;
END $$;
