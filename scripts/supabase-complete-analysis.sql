-- =====================================================
-- SUPABASE VERİTABANI TAM DURUM ANALİZİ
-- Mevcut tablolar, içerikler, RLS politikaları ve sistem durumu
-- =====================================================

-- =====================================================
-- 1. MEVCUT TABLOLAR VE TEMEL BİLGİLER
-- =====================================================

SELECT 
    'TABLO_LISTESI' AS analiz_tipi,
    t.table_name,
    t.table_type,
    CASE WHEN pt.rowsecurity THEN 'RLS_AKTIF' ELSE 'RLS_PASIF' END AS rls_durumu,
    CASE WHEN pt.hasrls THEN 'POLITIKA_VAR' ELSE 'POLITIKA_YOK' END AS politika_durumu,
    COALESCE(st.n_live_tup, 0) AS kayit_sayisi,
    pg_size_pretty(pg_total_relation_size('public.' || t.table_name)) AS tablo_boyutu
FROM 
    information_schema.tables t
    LEFT JOIN pg_tables pt ON t.table_name = pt.tablename AND pt.schemaname = 'public'
    LEFT JOIN pg_stat_user_tables st ON t.table_name = st.relname AND st.schemaname = 'public'
WHERE 
    t.table_schema = 'public'
    AND t.table_type = 'BASE TABLE'
ORDER BY 
    t.table_name;

-- =====================================================
-- 2. HER TABLONUN SÜTUN YAPISI
-- =====================================================

SELECT 
    'SUTUN_YAPISI' AS analiz_tipi,
    t.table_name,
    c.column_name,
    c.data_type,
    CASE 
        WHEN c.character_maximum_length IS NOT NULL 
        THEN c.data_type || '(' || c.character_maximum_length || ')'
        WHEN c.numeric_precision IS NOT NULL 
        THEN c.data_type || '(' || c.numeric_precision || 
             CASE WHEN c.numeric_scale IS NOT NULL THEN ',' || c.numeric_scale ELSE '' END || ')'
        ELSE c.data_type
    END AS tam_tip,
    CASE WHEN c.is_nullable = 'YES' THEN 'NULL' ELSE 'NOT NULL' END AS null_durumu,
    COALESCE(c.column_default, 'YOK') AS varsayilan_deger,
    c.ordinal_position AS sira_no
FROM 
    information_schema.tables t
    JOIN information_schema.columns c ON t.table_name = c.table_name
WHERE 
    t.table_schema = 'public'
    AND t.table_type = 'BASE TABLE'
ORDER BY 
    t.table_name, c.ordinal_position;

-- =====================================================
-- 3. PRIMARY KEY'LER
-- =====================================================

SELECT 
    'PRIMARY_KEY' AS analiz_tipi,
    tc.table_name,
    STRING_AGG(kcu.column_name, ', ' ORDER BY kcu.ordinal_position) AS primary_key_columns,
    tc.constraint_name
FROM 
    information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
WHERE 
    tc.constraint_type = 'PRIMARY KEY'
    AND tc.table_schema = 'public'
GROUP BY 
    tc.table_name, tc.constraint_name
ORDER BY 
    tc.table_name;

-- =====================================================
-- 4. FOREIGN KEY İLİŞKİLERİ
-- =====================================================

SELECT 
    'FOREIGN_KEY' AS analiz_tipi,
    tc.table_name AS kaynak_tablo,
    kcu.column_name AS kaynak_sutun,
    ccu.table_name AS hedef_tablo,
    ccu.column_name AS hedef_sutun,
    tc.constraint_name,
    rc.update_rule AS guncelleme_kurali,
    rc.delete_rule AS silme_kurali
FROM 
    information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage ccu 
        ON ccu.constraint_name = tc.constraint_name
    JOIN information_schema.referential_constraints rc
        ON tc.constraint_name = rc.constraint_name
WHERE 
    tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
ORDER BY 
    tc.table_name, kcu.column_name;

-- =====================================================
-- 5. RLS POLİTİKALARI DETAYLI
-- =====================================================

-- RLS durumu
SELECT 
    'RLS_DURUMU' AS analiz_tipi,
    tablename,
    CASE WHEN rowsecurity THEN 'AKTIF' ELSE 'PASIF' END AS rls_durumu,
    CASE WHEN hasrls THEN 'POLITIKA_VAR' ELSE 'POLITIKA_YOK' END AS politika_durumu
FROM 
    pg_tables
WHERE 
    schemaname = 'public'
ORDER BY 
    tablename;

-- RLS politikaları detayları
SELECT 
    'RLS_POLITIKA' AS analiz_tipi,
    tablename,
    policyname,
    CASE WHEN permissive THEN 'PERMISSIVE' ELSE 'RESTRICTIVE' END AS politika_tipi,
    COALESCE(STRING_AGG(roles, ', '), 'PUBLIC') AS roller,
    cmd AS komut,
    COALESCE(qual, 'KOŞUL_YOK') AS kosul,
    COALESCE(with_check, 'CHECK_YOK') AS check_kosulu
FROM 
    pg_policies
WHERE 
    schemaname = 'public'
ORDER BY 
    tablename, policyname;

-- =====================================================
-- 6. İNDEKSLER VE PERFORMANS
-- =====================================================

SELECT 
    'INDEKS' AS analiz_tipi,
    schemaname,
    tablename,
    indexname,
    CASE 
        WHEN indexdef LIKE '%UNIQUE%' THEN 'UNIQUE'
        WHEN indexdef LIKE '%PRIMARY%' THEN 'PRIMARY'
        ELSE 'NORMAL'
    END AS indeks_tipi,
    idx_scan AS kullanım_sayısı,
    idx_tup_read AS okunan_kayıt,
    idx_tup_fetch AS getirilen_kayıt
FROM 
    pg_stat_user_indexes
WHERE 
    schemaname = 'public'
ORDER BY 
    tablename, indexname;

-- =====================================================
-- 7. FONKSİYONLAR
-- =====================================================

SELECT 
    'FONKSIYON' AS analiz_tipi,
    n.nspname AS schema_adi,
    p.proname AS fonksiyon_adi,
    pg_get_function_result(p.oid) AS donus_tipi,
    pg_get_function_arguments(p.oid) AS parametreler,
    CASE p.provolatile
        WHEN 'i' THEN 'IMMUTABLE'
        WHEN 's' THEN 'STABLE'
        WHEN 'v' THEN 'VOLATILE'
        ELSE 'UNKNOWN'
    END AS volatilite,
    CASE WHEN p.proisstrict THEN 'STRICT' ELSE 'NON_STRICT' END AS strict_durumu
FROM 
    pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE 
    n.nspname = 'public'
ORDER BY 
    p.proname;

-- =====================================================
-- 8. TRİGGER'LAR
-- =====================================================

SELECT 
    'TRIGGER' AS analiz_tipi,
    c.relname AS tablo_adi,
    t.tgname AS trigger_adi,
    p.proname AS fonksiyon_adi,
    CASE t.tgenabled
        WHEN 'O' THEN 'AKTIF'
        WHEN 'D' THEN 'PASIF'
        WHEN 'R' THEN 'REPLICA'
        WHEN 'A' THEN 'HER_ZAMAN'
        ELSE 'BILINMIYOR'
    END AS durum,
    CASE 
        WHEN t.tgtype & 4 = 4 THEN 'INSERT'
        WHEN t.tgtype & 8 = 8 THEN 'DELETE'
        WHEN t.tgtype & 16 = 16 THEN 'UPDATE'
        ELSE 'COKLU'
    END AS tetikleme_olayı
FROM 
    pg_trigger t
    JOIN pg_class c ON t.tgrelid = c.oid
    JOIN pg_proc p ON t.tgfoid = p.oid
WHERE 
    c.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
    AND NOT t.tgisinternal
ORDER BY 
    c.relname, t.tgname;

-- =====================================================
-- 9. ENUM TİPLERİ
-- =====================================================

SELECT 
    'ENUM_TIPI' AS analiz_tipi,
    t.typname AS enum_adi,
    e.enumlabel AS enum_degeri,
    e.enumsortorder AS sira_no
FROM 
    pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
WHERE 
    t.typtype = 'e'
ORDER BY 
    t.typname, e.enumsortorder;

-- =====================================================
-- 10. TABLO İÇERİKLERİ (ÖRNEK VERİLER)
-- =====================================================

-- Her tablodan örnek veri almak için aşağıdaki sorguları çalıştırın:

-- devices tablosu
SELECT 'devices' AS tablo_adi, COUNT(*) AS kayit_sayisi FROM devices;
SELECT 'devices' AS tablo_adi, * FROM devices LIMIT 3;

-- payments tablosu  
SELECT 'payments' AS tablo_adi, COUNT(*) AS kayit_sayisi FROM payments;
SELECT 'payments' AS tablo_adi, * FROM payments LIMIT 3;

-- escrow_accounts tablosu
SELECT 'escrow_accounts' AS tablo_adi, COUNT(*) AS kayit_sayisi FROM escrow_accounts;
SELECT 'escrow_accounts' AS tablo_adi, * FROM escrow_accounts LIMIT 3;

-- notifications tablosu
SELECT 'notifications' AS tablo_adi, COUNT(*) AS kayit_sayisi FROM notifications;
SELECT 'notifications' AS tablo_adi, * FROM notifications LIMIT 3;

-- cargo_shipments tablosu
SELECT 'cargo_shipments' AS tablo_adi, COUNT(*) AS kayit_sayisi FROM cargo_shipments;
SELECT 'cargo_shipments' AS tablo_adi, * FROM cargo_shipments LIMIT 3;

-- financial_transactions tablosu
SELECT 'financial_transactions' AS tablo_adi, COUNT(*) AS kayit_sayisi FROM financial_transactions;
SELECT 'financial_transactions' AS tablo_adi, * FROM financial_transactions LIMIT 3;

-- audit_logs tablosu
SELECT 'audit_logs' AS tablo_adi, COUNT(*) AS kayit_sayisi FROM audit_logs;
SELECT 'audit_logs' AS tablo_adi, * FROM audit_logs LIMIT 3;

-- device_models tablosu
SELECT 'device_models' AS tablo_adi, COUNT(*) AS kayit_sayisi FROM device_models;
SELECT 'device_models' AS tablo_adi, * FROM device_models LIMIT 3;

-- cargo_companies tablosu
SELECT 'cargo_companies' AS tablo_adi, COUNT(*) AS kayit_sayisi FROM cargo_companies;
SELECT 'cargo_companies' AS tablo_adi, * FROM cargo_companies LIMIT 3;

-- userprofile tablosu
SELECT 'userprofile' AS tablo_adi, COUNT(*) AS kayit_sayisi FROM userprofile;
SELECT 'userprofile' AS tablo_adi, * FROM userprofile LIMIT 3;

-- =====================================================
-- 11. VERİTABANI İSTATİSTİKLERİ
-- =====================================================

SELECT 
    'VERITABANI_ISTATISTIK' AS analiz_tipi,
    datname AS veritabani_adi,
    numbackends AS aktif_baglanti,
    xact_commit AS commit_sayisi,
    xact_rollback AS rollback_sayisi,
    blks_read AS okunan_blok,
    blks_hit AS cache_hit,
    tup_returned AS donen_kayit,
    tup_fetched AS getirilen_kayit,
    tup_inserted AS eklenen_kayit,
    tup_updated AS guncellenen_kayit,
    tup_deleted AS silinen_kayit
FROM 
    pg_stat_database
WHERE 
    datname = current_database();

-- =====================================================
-- 12. TABLO BOYUTLARI VE DEPOLAMA
-- =====================================================

SELECT 
    'TABLO_BOYUTU' AS analiz_tipi,
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS toplam_boyut,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS tablo_boyutu,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS indeks_boyutu,
    pg_total_relation_size(schemaname||'.'||tablename) AS toplam_byte,
    pg_relation_size(schemaname||'.'||tablename) AS tablo_byte
FROM 
    pg_tables
WHERE 
    schemaname = 'public'
ORDER BY 
    pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- =====================================================
-- 13. KULLANICI İZİNLERİ
-- =====================================================

SELECT 
    'KULLANICI_IZIN' AS analiz_tipi,
    table_schema,
    table_name,
    grantee,
    privilege_type,
    CASE WHEN is_grantable = 'YES' THEN 'GRANTABLE' ELSE 'NOT_GRANTABLE' END AS grantable_durumu
FROM 
    information_schema.table_privileges
WHERE 
    table_schema = 'public'
ORDER BY 
    table_name, grantee, privilege_type;

-- =====================================================
-- 14. CONSTRAINT'LER VE CHECK KURALLARI
-- =====================================================

SELECT 
    'CONSTRAINT' AS analiz_tipi,
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    COALESCE(cc.check_clause, 'CHECK_YOK') AS check_kosulu,
    STRING_AGG(kcu.column_name, ', ' ORDER BY kcu.ordinal_position) AS etkilenen_sutunlar
FROM 
    information_schema.table_constraints tc
    LEFT JOIN information_schema.check_constraints cc 
        ON tc.constraint_name = cc.constraint_name
    LEFT JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
WHERE 
    tc.table_schema = 'public'
GROUP BY 
    tc.table_name, tc.constraint_name, tc.constraint_type, cc.check_clause
ORDER BY 
    tc.table_name, tc.constraint_type;

-- =====================================================
-- KULLANIM TALİMATLARI
-- =====================================================

/*
Bu script'i Supabase SQL Editor'da çalıştırarak:

1. ✅ Tüm tabloları ve temel bilgilerini görebilirsiniz
2. ✅ Her tablonun sütun yapısını detaylı görebilirsiniz
3. ✅ Primary key'leri görebilirsiniz
4. ✅ Foreign key ilişkilerini görebilirsiniz
5. ✅ RLS politikalarını tam olarak görebilirsiniz
6. ✅ İndeksleri ve performans bilgilerini görebilirsiniz
7. ✅ Fonksiyon ve trigger'ları görebilirsiniz
8. ✅ Enum tiplerini görebilirsiniz
9. ✅ Her tablodan örnek verileri görebilirsiniz
10. ✅ Veritabanı istatistiklerini görebilirsiniz
11. ✅ Tablo boyutlarını görebilirsiniz
12. ✅ Kullanıcı izinlerini görebilirsiniz
13. ✅ Constraint'leri görebilirsiniz

Bu script'i çalıştırdıktan sonra sonuçları bana gönderin,
sisteminizin tam durumunu analiz edip test planını hazırlayabilirim.
*/

