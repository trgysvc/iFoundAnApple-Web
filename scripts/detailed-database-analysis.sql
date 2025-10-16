-- =====================================================
-- SUPABASE VERİTABANI DETAYLI ANALİZ SCRIPT'İ
-- Gerçek tablo yapıları, RLS politikaları ve içerikler
-- =====================================================

-- =====================================================
-- 1. TÜM TABLOLARI VE SÜTUNLARINI DETAYLI LİSTELE
-- =====================================================

SELECT 
    t.table_name,
    t.table_type,
    c.column_name,
    c.data_type,
    c.character_maximum_length,
    c.numeric_precision,
    c.numeric_scale,
    c.is_nullable,
    c.column_default,
    c.ordinal_position,
    CASE 
        WHEN c.column_name = 'id' THEN 'PRIMARY KEY'
        WHEN EXISTS (
            SELECT 1 FROM information_schema.key_column_usage kcu
            JOIN information_schema.table_constraints tc ON kcu.constraint_name = tc.constraint_name
            WHERE tc.constraint_type = 'PRIMARY KEY' 
            AND kcu.table_name = t.table_name 
            AND kcu.column_name = c.column_name
        ) THEN 'PRIMARY KEY'
        WHEN EXISTS (
            SELECT 1 FROM information_schema.key_column_usage kcu
            JOIN information_schema.table_constraints tc ON kcu.constraint_name = tc.constraint_name
            WHERE tc.constraint_type = 'FOREIGN KEY' 
            AND kcu.table_name = t.table_name 
            AND kcu.column_name = c.column_name
        ) THEN 'FOREIGN KEY'
        ELSE 'NORMAL'
    END AS column_type
FROM 
    information_schema.tables t
    JOIN information_schema.columns c ON t.table_name = c.table_name
WHERE 
    t.table_schema = 'public'
    AND t.table_type = 'BASE TABLE'
ORDER BY 
    t.table_name, c.ordinal_position;

-- =====================================================
-- 2. HER TABLO İÇİN FOREIGN KEY İLİŞKİLERİ
-- =====================================================

SELECT 
    tc.table_name AS source_table,
    kcu.column_name AS source_column,
    ccu.table_name AS target_table,
    ccu.column_name AS target_column,
    tc.constraint_name,
    rc.update_rule,
    rc.delete_rule
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
-- 3. TÜM RLS POLİTİKALARI DETAYLI
-- =====================================================

-- RLS'nin aktif olduğu tablolar
SELECT 
    schemaname,
    tablename,
    CASE WHEN rowsecurity THEN 'ENABLED' ELSE 'DISABLED' END AS rls_status,
    CASE WHEN hasrls THEN 'HAS_POLICIES' ELSE 'NO_POLICIES' END AS policy_status
FROM 
    pg_tables
WHERE 
    schemaname = 'public'
ORDER BY 
    tablename;

-- Tüm RLS politikalarının detayları
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check,
    CASE 
        WHEN cmd = '*' THEN 'ALL_COMMANDS'
        WHEN cmd = 'SELECT' THEN 'READ_ONLY'
        WHEN cmd = 'INSERT' THEN 'INSERT_ONLY'
        WHEN cmd = 'UPDATE' THEN 'UPDATE_ONLY'
        WHEN cmd = 'DELETE' THEN 'DELETE_ONLY'
        ELSE 'CUSTOM'
    END AS policy_type
FROM 
    pg_policies
WHERE 
    schemaname = 'public'
ORDER BY 
    tablename, policyname;

-- =====================================================
-- 4. TABLO İÇERİKLERİ VE VERİ SAYILARI
-- =====================================================

-- Her tablodaki kayıt sayıları
SELECT 
    schemaname,
    tablename,
    n_tup_ins AS total_inserts,
    n_tup_upd AS total_updates,
    n_tup_del AS total_deletes,
    n_live_tup AS current_rows,
    n_dead_tup AS dead_rows,
    last_vacuum,
    last_autovacuum,
    last_analyze,
    last_autoanalyze
FROM 
    pg_stat_user_tables
WHERE 
    schemaname = 'public'
ORDER BY 
    n_live_tup DESC;

-- =====================================================
-- 5. İNDEKSLER VE PERFORMANS BİLGİLERİ
-- =====================================================

-- Tüm indeksler ve kullanım istatistikleri
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef,
    idx_scan AS times_used,
    idx_tup_read AS tuples_read,
    idx_tup_fetch AS tuples_fetched
FROM 
    pg_stat_user_indexes
WHERE 
    schemaname = 'public'
ORDER BY 
    tablename, indexname;

-- =====================================================
-- 6. FONKSİYONLAR VE TRİGGER'LAR DETAYLI
-- =====================================================

-- Tüm fonksiyonlar
SELECT 
    n.nspname AS schema_name,
    p.proname AS function_name,
    pg_get_function_result(p.oid) AS return_type,
    pg_get_function_arguments(p.oid) AS arguments,
    p.prosrc AS source_code,
    p.provolatile AS volatility,
    p.proisstrict AS is_strict,
    p.prosecdef AS security_definer
FROM 
    pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE 
    n.nspname = 'public'
ORDER BY 
    p.proname;

-- Tüm trigger'lar ve bağlı fonksiyonlar
SELECT 
    t.tgname AS trigger_name,
    c.relname AS table_name,
    p.proname AS function_name,
    CASE t.tgenabled 
        WHEN 'O' THEN 'ENABLED'
        WHEN 'D' THEN 'DISABLED'
        WHEN 'R' THEN 'REPLICA'
        WHEN 'A' THEN 'ALWAYS'
        ELSE 'UNKNOWN'
    END AS trigger_status,
    CASE t.tgtype
        WHEN 1 THEN 'BEFORE'
        WHEN 2 THEN 'AFTER'
        WHEN 3 THEN 'INSTEAD OF'
        ELSE 'UNKNOWN'
    END AS trigger_timing,
    CASE 
        WHEN t.tgtype & 4 = 4 THEN 'INSERT'
        WHEN t.tgtype & 8 = 8 THEN 'DELETE'
        WHEN t.tgtype & 16 = 16 THEN 'UPDATE'
        ELSE 'MULTIPLE'
    END AS trigger_event
FROM 
    pg_trigger t
    JOIN pg_class c ON t.tgrelid = c.oid
    JOIN pg_proc p ON t.tgfoid = p.oid
WHERE 
    c.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
    AND NOT t.tgisinternal  -- Sistem trigger'larını hariç tut
ORDER BY 
    c.relname, t.tgname;

-- =====================================================
-- 7. ENUM TİPLERİ VE DEĞERLERİ
-- =====================================================

-- Enum tiplerini ve değerlerini listele
SELECT 
    t.typname AS enum_name,
    e.enumlabel AS enum_value,
    e.enumsortorder AS sort_order,
    pg_catalog.format_type(t.oid, NULL) AS full_type_name
FROM 
    pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
WHERE 
    t.typtype = 'e'  -- Enum tipleri
ORDER BY 
    t.typname, e.enumsortorder;

-- =====================================================
-- 8. TABLO BOYUTLARI VE DEPOLAMA BİLGİLERİ
-- =====================================================

-- Tablo boyutları ve depolama bilgileri
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS index_size,
    pg_total_relation_size(schemaname||'.'||tablename) AS total_bytes,
    pg_relation_size(schemaname||'.'||tablename) AS table_bytes
FROM 
    pg_tables
WHERE 
    schemaname = 'public'
ORDER BY 
    pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- =====================================================
-- 9. KULLANICI İZİNLERİ VE ROL YÖNETİMİ
-- =====================================================

-- Tablo izinleri
SELECT 
    table_schema,
    table_name,
    grantee,
    privilege_type,
    is_grantable
FROM 
    information_schema.table_privileges
WHERE 
    table_schema = 'public'
ORDER BY 
    table_name, grantee, privilege_type;

-- =====================================================
-- 10. TABLO KISITLAMALARI VE CHECK CONSTRAINT'LER
-- =====================================================

-- Tüm constraint'ler
SELECT 
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    cc.check_clause,
    kcu.column_name
FROM 
    information_schema.table_constraints tc
    LEFT JOIN information_schema.check_constraints cc 
        ON tc.constraint_name = cc.constraint_name
    LEFT JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
WHERE 
    tc.table_schema = 'public'
ORDER BY 
    tc.table_name, tc.constraint_type, tc.constraint_name;

-- =====================================================
-- 11. ÖRNEK VERİLER (İLK 5 KAYIT)
-- =====================================================

-- Her tablodan örnek veri (güvenlik için sadece ilk 5 kayıt)
-- Bu sorguları her tablo için ayrı ayrı çalıştırın:

-- devices tablosu örnek verileri
SELECT 'devices' AS table_name, * FROM devices LIMIT 5;

-- payments tablosu örnek verileri  
SELECT 'payments' AS table_name, * FROM payments LIMIT 5;

-- escrow_accounts tablosu örnek verileri
SELECT 'escrow_accounts' AS table_name, * FROM escrow_accounts LIMIT 5;

-- notifications tablosu örnek verileri
SELECT 'notifications' AS table_name, * FROM notifications LIMIT 5;

-- cargo_shipments tablosu örnek verileri
SELECT 'cargo_shipments' AS table_name, * FROM cargo_shipments LIMIT 5;

-- financial_transactions tablosu örnek verileri
SELECT 'financial_transactions' AS table_name, * FROM financial_transactions LIMIT 5;

-- audit_logs tablosu örnek verileri
SELECT 'audit_logs' AS table_name, * FROM audit_logs LIMIT 5;

-- device_models tablosu örnek verileri
SELECT 'device_models' AS table_name, * FROM device_models LIMIT 5;

-- cargo_companies tablosu örnek verileri
SELECT 'cargo_companies' AS table_name, * FROM cargo_companies LIMIT 5;

-- userprofile tablosu örnek verileri
SELECT 'userprofile' AS table_name, * FROM userprofile LIMIT 5;

-- =====================================================
-- 12. VERİTABANI GENEL DURUMU
-- =====================================================

-- Veritabanı bağlantı bilgileri
SELECT 
    datname AS database_name,
    numbackends AS active_connections,
    xact_commit AS committed_transactions,
    xact_rollback AS rolled_back_transactions,
    blks_read AS blocks_read,
    blks_hit AS blocks_hit,
    tup_returned AS tuples_returned,
    tup_fetched AS tuples_fetched,
    tup_inserted AS tuples_inserted,
    tup_updated AS tuples_updated,
    tup_deleted AS tuples_deleted
FROM 
    pg_stat_database
WHERE 
    datname = current_database();

-- =====================================================
-- KULLANIM TALİMATLARI
-- =====================================================

/*
Bu script'i Supabase SQL Editor'da çalıştırarak:

1. ✅ Tüm tablo yapılarını detaylı görebilirsiniz
2. ✅ RLS politikalarını tam olarak görebilirsiniz  
3. ✅ Foreign key ilişkilerini görebilirsiniz
4. ✅ İndeksleri ve performans bilgilerini görebilirsiniz
5. ✅ Fonksiyon ve trigger'ları detaylı görebilirsiniz
6. ✅ Tablo içeriklerini örnek olarak görebilirsiniz
7. ✅ Veritabanı performans metriklerini görebilirsiniz

Her bölümü ayrı ayrı çalıştırarak detaylı bilgi alabilirsiniz.
Özellikle 11. bölümdeki örnek veri sorgularını her tablo için çalıştırın.
*/
