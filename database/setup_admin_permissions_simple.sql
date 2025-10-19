-- =====================================================
-- SUPABASE DASHBOARD İÇİN BASİT KURULUM SCRIPT
-- iFoundAnApple Platform - Admin Permission System
-- =====================================================

-- 1. ADMIN PERMISSIONS TABLOSU OLUŞTUR
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

-- 2. INDEXLER OLUŞTUR
CREATE INDEX IF NOT EXISTS idx_admin_permissions_user_id ON admin_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_permissions_role ON admin_permissions(role);
CREATE INDEX IF NOT EXISTS idx_admin_permissions_active ON admin_permissions(is_active);

-- 3. RLS AKTİF ET
ALTER TABLE admin_permissions ENABLE ROW LEVEL SECURITY;

-- 4. RLS POLİTİKALARI
CREATE POLICY "Super admins can manage all admin permissions" ON admin_permissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_permissions 
      WHERE user_id = auth.uid() 
      AND role = 'super_admin' 
      AND is_active = TRUE
    )
  );

CREATE POLICY "Admins can view their own permissions" ON admin_permissions
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM admin_permissions 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin') 
      AND is_active = TRUE
    )
  );

-- 5. YARDIMCI FONKSİYONLAR
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

-- 6. İLK SUPER ADMIN OLUŞTUR
-- Bu kısmı manuel olarak çalıştırın (turgaysavaci@gmail.com kullanıcısı kayıtlı olduktan sonra)

-- Önce kullanıcının ID'sini bulun:
-- SELECT id FROM auth.users WHERE email = 'turgaysavaci@gmail.com';

-- Sonra bu ID'yi kullanarak super admin yetkisi verin:
-- INSERT INTO admin_permissions (
--   user_id,
--   role,
--   permissions,
--   granted_by,
--   granted_at,
--   expires_at,
--   is_active,
--   notes
-- ) VALUES (
--   'BURAYA_USER_ID_YAZIN', -- Yukarıdaki sorgudan aldığınız ID
--   'super_admin',
--   '{
--     "canManageUsers": true,
--     "canManageDevices": true,
--     "canManagePayments": true,
--     "canManageEscrow": true,
--     "canViewLogs": true,
--     "canManageSettings": true,
--     "canManageCargo": true,
--     "canViewReports": true,
--     "canManagePermissions": true
--   }'::jsonb,
--   'BURAYA_USER_ID_YAZIN', -- Aynı ID
--   NOW(),
--   NULL,
--   TRUE,
--   'İlk super admin - sistem kurulumu'
-- );

-- 7. TEST SORGUSU
-- Kurulum sonrası test için:
-- SELECT 
--   au.email,
--   ap.role,
--   ap.is_active,
--   ap.granted_at
-- FROM admin_permissions ap
-- JOIN auth.users au ON ap.user_id = au.id
-- WHERE au.email = 'turgaysavaci@gmail.com';
