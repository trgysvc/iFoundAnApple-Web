# Admin Yetki Yönetimi Sistemi

## Mevcut Durum Analizi

### 1. **Veritabanı Yapısı**
Mevcut sistemde admin yetkisi için **eksik** olan kısımlar:

#### ❌ **Eksik: `auth.users` tablosunda `role` alanı**
Supabase'in `auth.users` tablosunda varsayılan olarak `role` alanı yok. Bu alanı eklemek gerekiyor.

#### ❌ **Eksik: Admin yetki yönetimi**
- Admin atama sistemi yok
- Admin yetkisi kaldırma sistemi yok
- Admin yetkisi doğrulama sistemi eksik

### 2. **Önerilen Çözüm**

#### **A. Supabase Auth Extension ile Role Yönetimi**

```sql
-- 1. Supabase Auth'a role extension ekle
CREATE EXTENSION IF NOT EXISTS "auth";

-- 2. auth.users tablosuna role alanı ekle
ALTER TABLE auth.users 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin'));

-- 3. Role güncelleme fonksiyonu
CREATE OR REPLACE FUNCTION update_user_role(user_id UUID, new_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Sadece super_admin'ler role değiştirebilir
  IF auth.jwt() ->> 'role' != 'super_admin' THEN
    RAISE EXCEPTION 'Insufficient permissions';
  END IF;
  
  -- Role güncelle
  UPDATE auth.users 
  SET role = new_role 
  WHERE id = user_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Admin yetkisi kontrol fonksiyonu
CREATE OR REPLACE FUNCTION is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = user_id 
    AND role IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### **B. Alternatif: Ayrı Admin Tablosu**

```sql
-- 1. Admin yetkileri için ayrı tablo
CREATE TABLE admin_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'super_admin')),
  permissions JSONB DEFAULT '{}',
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. RLS politikaları
ALTER TABLE admin_permissions ENABLE ROW LEVEL SECURITY;

-- Sadece super_admin'ler admin yetkisi verebilir
CREATE POLICY "Only super admins can manage admin permissions" ON admin_permissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND role = 'super_admin'
    )
  );

-- 3. Admin kontrol fonksiyonu
CREATE OR REPLACE FUNCTION is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_permissions 
    WHERE user_id = is_admin.user_id 
    AND is_active = TRUE 
    AND (expires_at IS NULL OR expires_at > NOW())
  ) OR EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = user_id 
    AND role IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## **Önerilen Implementasyon**

### **1. Veritabanı Güncellemeleri**

```sql
-- admin_permissions tablosunu oluştur
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

-- RLS aktif et
ALTER TABLE admin_permissions ENABLE ROW LEVEL SECURITY;

-- Politikalar
CREATE POLICY "Super admins can manage all admin permissions" ON admin_permissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_permissions 
      WHERE user_id = auth.uid() 
      AND role = 'super_admin' 
      AND is_active = TRUE
    )
  );

-- İlk super admin'i oluştur (manuel olarak)
INSERT INTO admin_permissions (user_id, role, granted_by, notes)
VALUES (
  'YOUR_USER_ID_HERE', -- İlk admin'in user ID'si
  'super_admin',
  'YOUR_USER_ID_HERE',
  'Initial super admin'
);
```

### **2. Frontend Admin Yetki Yönetimi**

```typescript
// Admin yetki yönetimi için yeni sayfa
interface AdminPermission {
  id: string;
  user_id: string;
  role: 'admin' | 'super_admin';
  permissions: {
    canManageUsers: boolean;
    canManageDevices: boolean;
    canManagePayments: boolean;
    canManageEscrow: boolean;
    canViewLogs: boolean;
    canManageSettings: boolean;
    canManageCargo: boolean;
    canViewReports: boolean;
  };
  granted_by: string;
  granted_at: string;
  expires_at?: string;
  is_active: boolean;
  notes?: string;
}

// Admin yetkisi kontrol hook'u
const useAdminPermissions = () => {
  const { currentUser } = useAppContext();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [permissions, setPermissions] = useState<AdminPermission['permissions'] | null>(null);

  useEffect(() => {
    if (currentUser) {
      checkAdminStatus();
    }
  }, [currentUser]);

  const checkAdminStatus = async () => {
    try {
      const response = await fetch('/api/admin/check-permissions');
      const data = await response.json();
      
      setIsAdmin(data.isAdmin);
      setIsSuperAdmin(data.isSuperAdmin);
      setPermissions(data.permissions);
    } catch (error) {
      console.error('Admin status check failed:', error);
    }
  };

  return { isAdmin, isSuperAdmin, permissions, checkAdminStatus };
};
```

### **3. Admin Yetki Yönetimi Sayfası**

```typescript
// pages/admin/AdminPermissionsPage.tsx
const AdminPermissionsPage: React.FC = () => {
  const [permissions, setPermissions] = useState<AdminPermission[]>([]);
  const [loading, setLoading] = useState(true);

  const grantAdminPermission = async (userId: string, role: string, permissions: any) => {
    try {
      const response = await fetch('/api/admin/grant-permission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          role,
          permissions,
          expiresAt: null // Kalıcı yetki
        })
      });

      if (response.ok) {
        // Başarılı - listeyi yenile
        fetchPermissions();
      }
    } catch (error) {
      console.error('Permission grant failed:', error);
    }
  };

  const revokeAdminPermission = async (permissionId: string) => {
    try {
      const response = await fetch('/api/admin/revoke-permission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissionId })
      });

      if (response.ok) {
        fetchPermissions();
      }
    } catch (error) {
      console.error('Permission revoke failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Yetki Yönetimi</h1>
      
      {/* Mevcut admin'ler */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Mevcut Admin'ler</h2>
          {/* Admin listesi */}
        </div>
      </div>

      {/* Yeni admin ekleme */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Yeni Admin Ekle</h2>
          {/* Admin ekleme formu */}
        </div>
      </div>
    </div>
  );
};
```

### **4. API Endpoints**

```typescript
// api/admin/permissions.ts
export async function POST(request: NextRequest) {
  const { action, userId, role, permissions, expiresAt } = await request.json();
  
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  switch (action) {
    case 'grant':
      // Admin yetkisi ver
      const { data: newPermission, error } = await supabase
        .from('admin_permissions')
        .insert({
          user_id: userId,
          role,
          permissions,
          granted_by: getCurrentUserId(request),
          expires_at: expiresAt,
          notes: 'Admin yetkisi verildi'
        })
        .select()
        .single();

      if (error) throw error;

      // Audit log
      await supabase.from('audit_logs').insert({
        event_type: 'admin_permission_granted',
        event_category: 'admin',
        event_action: 'grant',
        event_severity: 'warning',
        user_id: userId,
        event_description: `Admin yetkisi verildi: ${role}`,
        event_data: { role, permissions }
      });

      return NextResponse.json({ success: true, data: newPermission });

    case 'revoke':
      // Admin yetkisi kaldır
      await supabase
        .from('admin_permissions')
        .update({ is_active: false })
        .eq('id', permissionId);

      return NextResponse.json({ success: true });

    case 'check':
      // Mevcut kullanıcının admin durumunu kontrol et
      const { data: userPermissions } = await supabase
        .from('admin_permissions')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      return NextResponse.json({
        isAdmin: !!userPermissions,
        isSuperAdmin: userPermissions?.role === 'super_admin',
        permissions: userPermissions?.permissions || {}
      });
  }
}
```

## **Güvenlik Önerileri**

1. **İlk Super Admin**: Sistem kurulumunda manuel olarak ilk super admin atanmalı
2. **Yetki Süresi**: Admin yetkilerine süre sınırı konulabilir
3. **Audit Log**: Tüm admin yetki değişiklikleri loglanmalı
4. **2FA Zorunlu**: Admin'ler için 2FA zorunlu olmalı
5. **IP Kısıtlaması**: Admin paneline erişim IP kısıtlaması ile sınırlandırılabilir

Bu sistem ile admin yetkileri güvenli bir şekilde yönetilebilir ve tüm değişiklikler takip edilebilir.
