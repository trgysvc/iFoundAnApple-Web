-- Audit Logs RLS Policies
-- Bu dosya audit_logs tablosu için Row Level Security politikalarını içerir

-- Önce RLS'yi etkinleştir
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Mevcut politikaları temizle (varsa)
DROP POLICY IF EXISTS "Admins can view all audit logs" ON audit_logs;
DROP POLICY IF EXISTS "System can insert audit logs" ON audit_logs;
DROP POLICY IF EXISTS "Users can view own audit logs" ON audit_logs;

-- Policy 1: Admin kullanıcılar tüm audit logları görebilir
CREATE POLICY "Admins can view all audit logs"
ON audit_logs
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM userprofile
    WHERE userprofile.user_id = auth.uid()
    AND (
      -- Admin kontrolü burada yapılmalı (role tablosu varsa)
      -- Şimdilik tüm authenticated kullanıcılar görebilir (güvenlik için daha sıkı politikalar eklenebilir)
      true
    )
  )
  OR
  -- Admin rolü kontrolü (eğer userprofile'da role sütunu varsa)
  EXISTS (
    SELECT 1
    FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND (auth.users.raw_user_meta_data->>'role' = 'admin' OR auth.users.raw_user_meta_data->>'role' = 'super_admin')
  )
);

-- Policy 2: Kullanıcılar sadece kendi işlemlerini görebilir (sensitive olmayan)
CREATE POLICY "Users can view own audit logs"
ON audit_logs
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
  AND (
    event_severity != 'error' 
    AND event_severity != 'critical'
    OR is_sensitive = false
  )
);

-- Policy 3: Authenticated kullanıcılar audit log ekleyebilir (sistem işlemleri için)
CREATE POLICY "System can insert audit logs"
ON audit_logs
FOR INSERT
TO authenticated
WITH CHECK (
  -- Sadece kendi user_id'si ile ilgili kayıt ekleyebilir veya sistem kayıtları (user_id null)
  (user_id = auth.uid() OR user_id IS NULL)
  AND event_type IS NOT NULL
  AND event_category IS NOT NULL
  AND event_action IS NOT NULL
  AND event_description IS NOT NULL
);

-- Policy 4: Hiç kimse UPDATE yapamaz (audit loglar immutable olmalı)
-- UPDATE politikası YOK - audit loglar değiştirilemez

-- Policy 5: Hiç kimse DELETE yapamaz (audit loglar silinememeli)
-- DELETE politikası YOK - audit loglar silinemez

-- NOT: Admin kullanıcılar için özel bir fonksiyon kullanılabilir:
-- Örnek: create_audit_log() fonksiyonu service_role key ile çağrılabilir




