# Admin Permission System - Manuel Kurulum Talimatları

## 🎯 Hedef
`turgaysavaci@gmail.com` kullanıcısını super admin olarak atamak ve admin yetki sistemini kurmak.

## 📋 Kurulum Adımları

### 1. Supabase Dashboard'a Giriş
- Supabase Dashboard'a giriş yapın
- Projenizi seçin
- SQL Editor'a gidin

### 2. Tablo Oluşturma
Aşağıdaki SQL'i çalıştırın:

```sql
-- Admin permissions tablosu oluştur
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
```

### 3. Indexler Oluşturma
```sql
-- Performans için indexler
CREATE INDEX IF NOT EXISTS idx_admin_permissions_user_id ON admin_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_permissions_role ON admin_permissions(role);
CREATE INDEX IF NOT EXISTS idx_admin_permissions_active ON admin_permissions(is_active);
```

### 4. RLS Aktif Etme
```sql
-- Row Level Security aktif et
ALTER TABLE admin_permissions ENABLE ROW LEVEL SECURITY;
```

### 5. RLS Politikaları
```sql
-- Super admin politikası
CREATE POLICY "Super admins can manage all admin permissions" ON admin_permissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_permissions 
      WHERE user_id = auth.uid() 
      AND role = 'super_admin' 
      AND is_active = TRUE
    )
  );

-- Admin görüntüleme politikası
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
```

### 6. Yardımcı Fonksiyonlar
```sql
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
```

### 7. Kullanıcı ID'sini Bulma
```sql
-- turgaysavaci@gmail.com kullanıcısının ID'sini bul
SELECT id, email, created_at FROM auth.users WHERE email = 'turgaysavaci@gmail.com';
```

### 8. Super Admin Yetkisi Verme
Yukarıdaki sorgudan aldığınız `id` değerini kullanarak:

```sql
-- Super admin yetkisi ver (USER_ID'yi yukarıdaki sorgudan aldığınız ID ile değiştirin)
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
  'USER_ID_BURAYA', -- Yukarıdaki sorgudan aldığınız ID
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
  'USER_ID_BURAYA', -- Aynı ID
  NOW(),
  NULL, -- Süresiz
  TRUE,
  'İlk super admin - sistem kurulumu'
);
```

### 9. Kurulum Testi
```sql
-- Kurulumu test et
SELECT 
  au.email,
  ap.role,
  ap.is_active,
  ap.granted_at,
  ap.permissions
FROM admin_permissions ap
JOIN auth.users au ON ap.user_id = au.id
WHERE au.email = 'turgaysavaci@gmail.com';
```

## ✅ Başarılı Kurulum Kontrolü

Kurulum başarılı ise şu sonuçları görmelisiniz:

- `turgaysavaci@gmail.com` kullanıcısı `super_admin` rolüne sahip
- `is_active` değeri `true`
- `permissions` JSON'ında tüm yetkiler `true`
- `expires_at` değeri `NULL` (süresiz)

## 🔧 Sorun Giderme

### Kullanıcı Bulunamadı Hatası
Eğer `turgaysavaci@gmail.com` kullanıcısı bulunamazsa:
1. Kullanıcının kayıtlı olduğundan emin olun
2. Email adresinin doğru yazıldığından emin olun
3. `auth.users` tablosunda kontrol edin

### RLS Politikası Hatası
Eğer RLS politikası hatası alırsanız:
1. Politikaları sırayla oluşturun
2. Mevcut politikaları kontrol edin
3. Gerekirse politikaları silip yeniden oluşturun

## 📝 Notlar

- Bu kurulum sadece bir kez yapılmalı
- İlk super admin yetkisi verildikten sonra diğer admin'ler bu panel üzerinden yönetilebilir
- Tüm admin işlemleri `audit_logs` tablosunda loglanır
- Admin yetkileri süresiz olarak verilmiştir (gerekirse değiştirilebilir)

## 🚀 Sonraki Adımlar

1. Frontend'de admin paneli test edin
2. Diğer admin'leri eklemek için admin panelini kullanın
3. Yetki seviyelerini ihtiyaca göre ayarlayın
4. Audit logları kontrol edin
