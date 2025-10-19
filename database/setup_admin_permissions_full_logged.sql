-- =====================================================
-- ADMIN PERMISSION SYSTEM SETUP SCRIPT - FULL VERSION
-- iFoundAnApple Platform - Super Admin Kurulumu
-- TURGAYSAVACI@GMAIL.COM için Super Admin Yetkisi
-- =====================================================

-- BAŞLANGIÇ LOGU
DO $$
BEGIN
  RAISE NOTICE '=====================================================';
  RAISE NOTICE 'ADMIN PERMISSION SYSTEM SETUP STARTING...';
  RAISE NOTICE 'Target User: turgaysavaci@gmail.com';
  RAISE NOTICE 'Role: super_admin';
  RAISE NOTICE 'Timestamp: %', NOW();
  RAISE NOTICE '=====================================================';
END $$;

-- 1. ADMIN PERMISSIONS TABLOSU OLUŞTUR
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE 'STEP 1: Creating admin_permissions table...';
END $$;

CREATE TABLE IF NOT EXISTS admin_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'super_admin')),
  permissions JSONB DEFAULT '{}',
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

DO $$
BEGIN
  RAISE NOTICE '✅ STEP 1 COMPLETED: admin_permissions table created successfully';
END $$;

-- 2. INDEXLER OLUŞTUR (PERFORMANS İÇİN)
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE 'STEP 2: Creating indexes for performance...';
END $$;

CREATE INDEX IF NOT EXISTS idx_admin_permissions_user_id ON admin_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_permissions_role ON admin_permissions(role);
CREATE INDEX IF NOT EXISTS idx_admin_permissions_active ON admin_permissions(is_active);
CREATE INDEX IF NOT EXISTS idx_admin_permissions_expires ON admin_permissions(expires_at);

DO $$
BEGIN
  RAISE NOTICE '✅ STEP 2 COMPLETED: All indexes created successfully';
END $$;

-- 3. RLS (ROW LEVEL SECURITY) AKTİF ET
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE 'STEP 3: Enabling Row Level Security (RLS)...';
END $$;

ALTER TABLE admin_permissions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  RAISE NOTICE '✅ STEP 3 COMPLETED: RLS enabled successfully';
END $$;

-- 4. RLS POLİTİKALARI OLUŞTUR
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE 'STEP 4: Creating RLS policies...';
END $$;

-- Super admin'ler tüm admin yetkilerini yönetebilir
CREATE POLICY "Super admins can manage all admin permissions" ON admin_permissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_permissions 
      WHERE user_id = auth.uid() 
      AND role = 'super_admin' 
      AND is_active = TRUE
      AND (expires_at IS NULL OR expires_at > NOW())
    )
  );

-- Admin'ler kendi yetkilerini görebilir
CREATE POLICY "Admins can view their own permissions" ON admin_permissions
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM admin_permissions 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin') 
      AND is_active = TRUE
      AND (expires_at IS NULL OR expires_at > NOW())
    )
  );

DO $$
BEGIN
  RAISE NOTICE '✅ STEP 4 COMPLETED: RLS policies created successfully';
END $$;

-- 5. YARDIMCI FONKSİYONLAR OLUŞTUR
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE 'STEP 5: Creating helper functions...';
END $$;

-- Admin kontrol fonksiyonu
CREATE OR REPLACE FUNCTION is_admin(check_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_permissions 
    WHERE user_id = check_user_id 
    AND is_active = TRUE 
    AND (expires_at IS NULL OR expires_at > NOW())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Super admin kontrol fonksiyonu
CREATE OR REPLACE FUNCTION is_super_admin(check_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_permissions 
    WHERE user_id = check_user_id 
    AND role = 'super_admin'
    AND is_active = TRUE 
    AND (expires_at IS NULL OR expires_at > NOW())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin yetkisi verme fonksiyonu
CREATE OR REPLACE FUNCTION grant_admin_permission(
  target_user_id UUID,
  admin_role TEXT,
  admin_permissions JSONB DEFAULT '{}',
  expiry_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  admin_notes TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  new_permission_id UUID;
BEGIN
  -- Sadece super admin'ler yetki verebilir
  IF NOT is_super_admin() THEN
    RAISE EXCEPTION 'Insufficient permissions: Only super admins can grant admin permissions';
  END IF;
  
  -- Kullanıcının zaten aktif yetkisi var mı kontrol et
  IF EXISTS (
    SELECT 1 FROM admin_permissions 
    WHERE user_id = target_user_id 
    AND is_active = TRUE
  ) THEN
    RAISE EXCEPTION 'User already has active admin permission';
  END IF;
  
  -- Yeni yetki oluştur
  INSERT INTO admin_permissions (
    user_id, 
    role, 
    permissions, 
    granted_by, 
    expires_at, 
    notes
  ) VALUES (
    target_user_id, 
    admin_role, 
    admin_permissions, 
    auth.uid(), 
    expiry_date, 
    admin_notes
  ) RETURNING id INTO new_permission_id;
  
  -- Audit log ekle
  INSERT INTO audit_logs (
    event_type,
    event_category,
    event_action,
    event_severity,
    user_id,
    event_description,
    event_data
  ) VALUES (
    'admin_permission_granted',
    'admin',
    'grant',
    'warning',
    target_user_id,
    'Admin permission granted: ' || admin_role,
    jsonb_build_object(
      'role', admin_role,
      'permissions', admin_permissions,
      'granted_by', auth.uid(),
      'expires_at', expiry_date,
      'permission_id', new_permission_id
    )
  );
  
  RETURN new_permission_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin yetkisi kaldırma fonksiyonu
CREATE OR REPLACE FUNCTION revoke_admin_permission(target_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  permission_record admin_permissions%ROWTYPE;
BEGIN
  -- Sadece super admin'ler yetki kaldırabilir
  IF NOT is_super_admin() THEN
    RAISE EXCEPTION 'Insufficient permissions: Only super admins can revoke admin permissions';
  END IF;
  
  -- Yetkiyi bul ve güncelle
  SELECT * INTO permission_record 
  FROM admin_permissions 
  WHERE user_id = target_user_id 
  AND is_active = TRUE;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'No active admin permission found for user';
  END IF;
  
  -- Yetkiyi pasif yap
  UPDATE admin_permissions 
  SET is_active = FALSE, updated_at = NOW()
  WHERE user_id = target_user_id AND is_active = TRUE;
  
  -- Audit log ekle
  INSERT INTO audit_logs (
    event_type,
    event_category,
    event_action,
    event_severity,
    user_id,
    event_description,
    event_data
  ) VALUES (
    'admin_permission_revoked',
    'admin',
    'revoke',
    'warning',
    target_user_id,
    'Admin permission revoked',
    jsonb_build_object(
      'revoked_by', auth.uid(),
      'original_role', permission_record.role,
      'permission_id', permission_record.id
    )
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$
BEGIN
  RAISE NOTICE '✅ STEP 5 COMPLETED: Helper functions created successfully';
  RAISE NOTICE '   - is_admin() function created';
  RAISE NOTICE '   - is_super_admin() function created';
  RAISE NOTICE '   - grant_admin_permission() function created';
  RAISE NOTICE '   - revoke_admin_permission() function created';
END $$;

-- 6. AUDIT LOG TABLOSU KONTROLÜ VE GÜNCELLEME
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE 'STEP 6: Checking and updating audit_logs table...';
END $$;

-- audit_logs tablosu yoksa oluştur
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  event_category TEXT NOT NULL,
  event_action TEXT NOT NULL,
  event_severity TEXT NOT NULL DEFAULT 'info',
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  ip_address INET,
  user_agent TEXT,
  resource_type TEXT,
  resource_id TEXT,
  event_description TEXT NOT NULL,
  event_data JSONB,
  error_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  request_id TEXT,
  correlation_id TEXT,
  is_sensitive BOOLEAN DEFAULT FALSE,
  environment TEXT DEFAULT 'production',
  application_version TEXT DEFAULT 'v5.1'
);

-- audit_logs için indexler
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_event_type ON audit_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_event_category ON audit_logs(event_category);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_severity ON audit_logs(event_severity);

DO $$
BEGIN
  RAISE NOTICE '✅ STEP 6 COMPLETED: audit_logs table ready';
END $$;

-- 7. TRIGGER OLUŞTUR (OTOMATIK GÜNCELLEME İÇİN)
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE 'STEP 7: Creating triggers...';
END $$;

-- admin_permissions tablosu için updated_at trigger
CREATE OR REPLACE FUNCTION update_admin_permissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_admin_permissions_updated_at
  BEFORE UPDATE ON admin_permissions
  FOR EACH ROW
  EXECUTE FUNCTION update_admin_permissions_updated_at();

DO $$
BEGIN
  RAISE NOTICE '✅ STEP 7 COMPLETED: Triggers created successfully';
END $$;

-- 8. İLK SUPER ADMIN OLUŞTUR
-- =====================================================
DO $$
DECLARE
  admin_user_id UUID;
  admin_user_email TEXT := 'turgaysavaci@gmail.com';
  permission_id UUID;
BEGIN
  RAISE NOTICE 'STEP 8: Creating first super admin...';
  RAISE NOTICE '   Target email: %', admin_user_email;
  
  -- Kullanıcının ID'sini bul
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = admin_user_email;
  
  -- Kullanıcı bulunamazsa hata ver
  IF admin_user_id IS NULL THEN
    RAISE EXCEPTION '❌ ERROR: User with email % not found in auth.users table. Please ensure the user is registered first.', admin_user_email;
  END IF;
  
  RAISE NOTICE '   ✅ User found: % (ID: %)', admin_user_email, admin_user_id;
  
  -- Kullanıcının zaten admin yetkisi var mı kontrol et
  IF EXISTS (
    SELECT 1 FROM admin_permissions 
    WHERE user_id = admin_user_id 
    AND is_active = TRUE
  ) THEN
    RAISE NOTICE '   ⚠️  WARNING: User % already has admin permission', admin_user_email;
    
    -- Mevcut yetkiyi göster
    SELECT id INTO permission_id FROM admin_permissions 
    WHERE user_id = admin_user_id AND is_active = TRUE;
    
    RAISE NOTICE '   Existing permission ID: %', permission_id;
  ELSE
    -- İlk super admin'i oluştur
    INSERT INTO admin_permissions (
      user_id,
      role,
      permissions,
      granted_by,
      granted_at,
      expires_at,
      is_active,
      notes
    ) VALUES (
      admin_user_id,
      'super_admin',
      '{
        "canManageUsers": true,
        "canManageDevices": true,
        "canManagePayments": true,
        "canManageEscrow": true,
        "canViewLogs": true,
        "canManageSettings": true,
        "canManageCargo": true,
        "canViewReports": true,
        "canManagePermissions": true
      }'::jsonb,
      admin_user_id, -- İlk admin kendini atar
      NOW(),
      NULL, -- Süresiz
      TRUE,
      'İlk super admin - sistem kurulumu'
    ) RETURNING id INTO permission_id;
    
    RAISE NOTICE '   ✅ Super admin permission granted successfully';
    RAISE NOTICE '   Permission ID: %', permission_id;
    
    -- Audit log ekle
    INSERT INTO audit_logs (
      event_type,
      event_category,
      event_action,
      event_severity,
      user_id,
      event_description,
      event_data
    ) VALUES (
      'admin_permission_granted',
      'admin',
      'grant',
      'warning',
      admin_user_id,
      'İlk super admin oluşturuldu: ' || admin_user_email,
      jsonb_build_object(
        'role', 'super_admin',
        'permissions', '{
          "canManageUsers": true,
          "canManageDevices": true,
          "canManagePayments": true,
          "canManageEscrow": true,
          "canViewLogs": true,
          "canManageSettings": true,
          "canManageCargo": true,
          "canViewReports": true,
          "canManagePermissions": true
        }'::jsonb,
        'granted_by', admin_user_id,
        'expires_at', NULL,
        'permission_id', permission_id,
        'setup_type', 'initial_super_admin'
      )
    );
    
    RAISE NOTICE '   ✅ Audit log created';
  END IF;
  
  RAISE NOTICE '✅ STEP 8 COMPLETED: Super admin setup completed';
END $$;

-- 9. TEST FONKSİYONLARI
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE 'STEP 9: Creating test functions...';
END $$;

-- Admin yetkisi test fonksiyonu
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

DO $$
BEGIN
  RAISE NOTICE '✅ STEP 9 COMPLETED: Test functions created';
END $$;

-- 10. KURULUM SONRASI TEST VE DOĞRULAMA
-- =====================================================
DO $$
DECLARE
  admin_count INTEGER;
  super_admin_count INTEGER;
  test_user_id UUID;
  test_email TEXT := 'turgaysavaci@gmail.com';
BEGIN
  RAISE NOTICE 'STEP 10: Running post-setup tests...';
  
  -- Test: Admin sayısını kontrol et
  SELECT COUNT(*) INTO admin_count FROM admin_permissions WHERE is_active = TRUE;
  SELECT COUNT(*) INTO super_admin_count FROM admin_permissions WHERE role = 'super_admin' AND is_active = TRUE;
  
  RAISE NOTICE '   Total admin permissions: %', admin_count;
  RAISE NOTICE '   Super admin count: %', super_admin_count;
  
  -- Test: Hedef kullanıcının ID'sini bul
  SELECT id INTO test_user_id FROM auth.users WHERE email = test_email;
  
  IF test_user_id IS NOT NULL THEN
    RAISE NOTICE '   ✅ Test user found: % (ID: %)', test_email, test_user_id;
    
    -- Test: Fonksiyonları test et
    IF is_admin(test_user_id) THEN
      RAISE NOTICE '   ✅ is_admin() function works correctly';
    ELSE
      RAISE NOTICE '   ❌ is_admin() function failed';
    END IF;
    
    IF is_super_admin(test_user_id) THEN
      RAISE NOTICE '   ✅ is_super_admin() function works correctly';
    ELSE
      RAISE NOTICE '   ❌ is_super_admin() function failed';
    END IF;
  ELSE
    RAISE NOTICE '   ❌ Test user not found: %', test_email;
  END IF;
  
  RAISE NOTICE '✅ STEP 10 COMPLETED: Post-setup tests completed';
END $$;

-- 11. BAŞARILI KURULUM MESAJI
-- =====================================================
DO $$
DECLARE
  admin_count INTEGER;
  super_admin_count INTEGER;
  audit_count INTEGER;
BEGIN
  -- Son istatistikleri al
  SELECT COUNT(*) INTO admin_count FROM admin_permissions WHERE is_active = TRUE;
  SELECT COUNT(*) INTO super_admin_count FROM admin_permissions WHERE role = 'super_admin' AND is_active = TRUE;
  SELECT COUNT(*) INTO audit_count FROM audit_logs WHERE event_type LIKE '%admin_permission%';
  
  RAISE NOTICE '=====================================================';
  RAISE NOTICE '🎉 ADMIN PERMISSION SYSTEM SETUP COMPLETED SUCCESSFULLY!';
  RAISE NOTICE '=====================================================';
  RAISE NOTICE '📊 SETUP STATISTICS:';
  RAISE NOTICE '   • Super Admin: turgaysavaci@gmail.com';
  RAISE NOTICE '   • Total Admin Permissions: %', admin_count;
  RAISE NOTICE '   • Super Admin Count: %', super_admin_count;
  RAISE NOTICE '   • Audit Logs Created: %', audit_count;
  RAISE NOTICE '';
  RAISE NOTICE '📋 CREATED COMPONENTS:';
  RAISE NOTICE '   ✅ admin_permissions table';
  RAISE NOTICE '   ✅ audit_logs table';
  RAISE NOTICE '   ✅ RLS policies';
  RAISE NOTICE '   ✅ Helper functions (is_admin, is_super_admin)';
  RAISE NOTICE '   ✅ Management functions (grant, revoke)';
  RAISE NOTICE '   ✅ Test functions';
  RAISE NOTICE '   ✅ Triggers';
  RAISE NOTICE '   ✅ Indexes';
  RAISE NOTICE '';
  RAISE NOTICE '🔧 NEXT STEPS:';
  RAISE NOTICE '   1. Test admin panel access';
  RAISE NOTICE '   2. Add additional admins if needed';
  RAISE NOTICE '   3. Configure permissions as required';
  RAISE NOTICE '   4. Monitor audit logs';
  RAISE NOTICE '';
  RAISE NOTICE '📝 TEST QUERIES:';
  RAISE NOTICE '   • SELECT * FROM test_admin_permissions();';
  RAISE NOTICE '   • SELECT is_admin(), is_super_admin();';
  RAISE NOTICE '   • SELECT * FROM admin_permissions WHERE is_active = true;';
  RAISE NOTICE '=====================================================';
END $$;

-- 12. SON TEST SORGUSU (SONUÇLARI GÖRMEK İÇİN)
-- =====================================================
-- Bu sorgu kurulum sonuçlarını gösterir
SELECT 
  'SETUP VERIFICATION' as test_type,
  au.email,
  ap.role,
  ap.is_active,
  ap.granted_at,
  ap.permissions,
  CASE 
    WHEN ap.role = 'super_admin' AND ap.is_active = true THEN '✅ SUCCESS'
    ELSE '❌ FAILED'
  END as status
FROM admin_permissions ap
JOIN auth.users au ON ap.user_id = au.id
WHERE au.email = 'turgaysavaci@gmail.com';
