-- =====================================================
-- iFoundAnApple Database Schema Export Script
-- Supabase Tablo Yapıları ve RLS Politikaları
-- =====================================================

-- Bu script Supabase veritabanındaki tüm tabloları,
-- sütunları, indeksleri, foreign key'leri ve RLS politikalarını export eder

-- =====================================================
-- 1. TABLO YAPILARI VE SÜTUNLAR
-- =====================================================

-- Tüm tabloları ve sütunlarını listele
SELECT 
    t.table_name,
    c.column_name,
    c.data_type,
    c.character_maximum_length,
    c.numeric_precision,
    c.numeric_scale,
    c.is_nullable,
    c.column_default,
    c.ordinal_position
FROM 
    information_schema.tables t
    JOIN information_schema.columns c ON t.table_name = c.table_name
WHERE 
    t.table_schema = 'public'
    AND t.table_type = 'BASE TABLE'
ORDER BY 
    t.table_name, c.ordinal_position;

-- =====================================================
-- 2. PRIMARY KEY'LER
-- =====================================================

-- Tüm primary key'leri listele
SELECT 
    tc.table_name,
    kcu.column_name,
    tc.constraint_name
FROM 
    information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
WHERE 
    tc.constraint_type = 'PRIMARY KEY'
    AND tc.table_schema = 'public'
ORDER BY 
    tc.table_name;

-- =====================================================
-- 3. FOREIGN KEY'LER
-- =====================================================

-- Tüm foreign key'leri listele
SELECT 
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    tc.constraint_name
FROM 
    information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage ccu 
        ON ccu.constraint_name = tc.constraint_name
WHERE 
    tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
ORDER BY 
    tc.table_name;

-- =====================================================
-- 4. İNDEKSLER
-- =====================================================

-- Tüm indeksleri listele
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM 
    pg_indexes
WHERE 
    schemaname = 'public'
ORDER BY 
    tablename, indexname;

-- =====================================================
-- 5. RLS POLİTİKALARI
-- =====================================================

-- RLS'nin aktif olduğu tabloları listele
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM 
    pg_tables
WHERE 
    schemaname = 'public'
    AND rowsecurity = true
ORDER BY 
    tablename;

-- Tüm RLS politikalarını detaylı listele
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM 
    pg_policies
WHERE 
    schemaname = 'public'
ORDER BY 
    tablename, policyname;

-- =====================================================
-- 6. ENUM TİPLERİ
-- =====================================================

-- Enum tiplerini listele
SELECT 
    t.typname AS enum_name,
    e.enumlabel AS enum_value,
    e.enumsortorder
FROM 
    pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
WHERE 
    t.typname IN (
        SELECT DISTINCT typname 
        FROM pg_type 
        WHERE typtype = 'e'  -- 'e' = enum type
    )
ORDER BY 
    t.typname, e.enumsortorder;

-- =====================================================
-- 7. FONKSİYONLAR VE TRİGGER'LAR
-- =====================================================

-- Tüm fonksiyonları listele
SELECT 
    n.nspname AS schema_name,
    p.proname AS function_name,
    pg_get_function_result(p.oid) AS return_type,
    pg_get_function_arguments(p.oid) AS arguments,
    p.prosrc AS source_code
FROM 
    pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE 
    n.nspname = 'public'
ORDER BY 
    p.proname;

-- Tüm trigger'ları listele
SELECT 
    t.tgname AS trigger_name,
    c.relname AS table_name,
    p.proname AS function_name,
    t.tgenabled AS enabled
FROM 
    pg_trigger t
    JOIN pg_class c ON t.tgrelid = c.oid
    JOIN pg_proc p ON t.tgfoid = p.oid
WHERE 
    c.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
ORDER BY 
    c.relname, t.tgname;

-- =====================================================
-- 8. TABLO BOYUTLARI VE İSTATİSTİKLER
-- =====================================================

-- Tablo boyutlarını listele
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
    pg_total_relation_size(schemaname||'.'||tablename) AS size_bytes
FROM 
    pg_tables
WHERE 
    schemaname = 'public'
ORDER BY 
    pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- =====================================================
-- 9. KAPSAMLI TABLO YAPISI RAPORU
-- =====================================================

-- Her tablo için detaylı yapı raporu
WITH table_info AS (
    SELECT 
        t.table_name,
        COUNT(c.column_name) AS column_count,
        COUNT(CASE WHEN c.is_nullable = 'NO' THEN 1 END) AS not_null_columns,
        COUNT(CASE WHEN c.column_default IS NOT NULL THEN 1 END) AS default_columns
    FROM 
        information_schema.tables t
        LEFT JOIN information_schema.columns c ON t.table_name = c.table_name
    WHERE 
        t.table_schema = 'public'
        AND t.table_type = 'BASE TABLE'
    GROUP BY 
        t.table_name
),
constraint_info AS (
    SELECT 
        tc.table_name,
        COUNT(CASE WHEN tc.constraint_type = 'PRIMARY KEY' THEN 1 END) AS primary_keys,
        COUNT(CASE WHEN tc.constraint_type = 'FOREIGN KEY' THEN 1 END) AS foreign_keys,
        COUNT(CASE WHEN tc.constraint_type = 'UNIQUE' THEN 1 END) AS unique_constraints
    FROM 
        information_schema.table_constraints tc
    WHERE 
        tc.table_schema = 'public'
    GROUP BY 
        tc.table_name
),
rls_info AS (
    SELECT 
        pt.tablename,
        COUNT(*) AS policy_count,
        CASE WHEN pt.rowsecurity THEN 'Enabled' ELSE 'Disabled' END AS rls_status
    FROM 
        pg_tables pt
        LEFT JOIN pg_policies pp ON pt.tablename = pp.tablename
    WHERE 
        pt.schemaname = 'public'
    GROUP BY 
        pt.tablename, pt.rowsecurity
)
SELECT 
    ti.table_name,
    ti.column_count,
    ti.not_null_columns,
    ti.default_columns,
    COALESCE(ci.primary_keys, 0) AS primary_keys,
    COALESCE(ci.foreign_keys, 0) AS foreign_keys,
    COALESCE(ci.unique_constraints, 0) AS unique_constraints,
    COALESCE(rli.policy_count, 0) AS rls_policies,
    COALESCE(rli.rls_status, 'Disabled') AS rls_status
FROM 
    table_info ti
    LEFT JOIN constraint_info ci ON ti.table_name = ci.table_name
    LEFT JOIN rls_info rli ON ti.table_name = rli.tablename
ORDER BY 
    ti.table_name;

-- =====================================================
-- 10. CREATE TABLE SCRIPT'LERİ ÜRETİMİ
-- =====================================================

-- Her tablo için CREATE TABLE script'i üret
-- (Bu sorgu her tablo için ayrı ayrı çalıştırılmalı)

-- Örnek: payments tablosu için CREATE script
SELECT 
    'CREATE TABLE ' || table_name || ' (' || 
    STRING_AGG(
        column_name || ' ' || 
        CASE 
            WHEN data_type = 'character varying' THEN 'VARCHAR(' || character_maximum_length || ')'
            WHEN data_type = 'character' THEN 'CHAR(' || character_maximum_length || ')'
            WHEN data_type = 'numeric' THEN 'NUMERIC(' || numeric_precision || ',' || numeric_scale || ')'
            WHEN data_type = 'timestamp with time zone' THEN 'TIMESTAMPTZ'
            WHEN data_type = 'timestamp without time zone' THEN 'TIMESTAMP'
            WHEN data_type = 'time with time zone' THEN 'TIMETZ'
            WHEN data_type = 'time without time zone' THEN 'TIME'
            WHEN data_type = 'date' THEN 'DATE'
            WHEN data_type = 'boolean' THEN 'BOOLEAN'
            WHEN data_type = 'integer' THEN 'INTEGER'
            WHEN data_type = 'bigint' THEN 'BIGINT'
            WHEN data_type = 'smallint' THEN 'SMALLINT'
            WHEN data_type = 'real' THEN 'REAL'
            WHEN data_type = 'double precision' THEN 'DOUBLE PRECISION'
            WHEN data_type = 'text' THEN 'TEXT'
            WHEN data_type = 'jsonb' THEN 'JSONB'
            WHEN data_type = 'json' THEN 'JSON'
            WHEN data_type = 'uuid' THEN 'UUID'
            ELSE UPPER(data_type)
        END ||
        CASE WHEN is_nullable = 'NO' THEN ' NOT NULL' ELSE '' END ||
        CASE WHEN column_default IS NOT NULL THEN ' DEFAULT ' || column_default ELSE '' END,
        ', '
    ) || ');' AS create_statement
FROM 
    information_schema.columns
WHERE 
    table_schema = 'public'
    AND table_name = 'payments'  -- Bu kısmı değiştirerek diğer tablolar için de çalıştırabilirsiniz
GROUP BY 
    table_name;

-- =====================================================
-- 11. RLS POLİTİKALARI CREATE SCRIPT'LERİ
-- =====================================================

-- RLS politikaları için CREATE script'leri üret
SELECT 
    'ALTER TABLE ' || tablename || ' ENABLE ROW LEVEL SECURITY;' AS enable_rls,
    'CREATE POLICY "' || policyname || '" ON ' || tablename || 
    CASE 
        WHEN cmd = '*' THEN ''
        ELSE ' FOR ' || cmd
    END ||
    CASE 
        WHEN roles IS NOT NULL AND array_length(roles, 1) > 0 THEN 
            ' TO ' || array_to_string(roles, ', ')
        ELSE ''
    END ||
    CASE 
        WHEN qual IS NOT NULL THEN ' USING (' || qual || ')'
        ELSE ''
    END ||
    CASE 
        WHEN with_check IS NOT NULL THEN ' WITH CHECK (' || with_check || ')'
        ELSE ''
    END || ';' AS create_policy
FROM 
    pg_policies
WHERE 
    schemaname = 'public'
ORDER BY 
    tablename, policyname;

-- =====================================================
-- 12. VERİTABANI ŞEMASI ÖZET RAPORU
-- =====================================================

-- Genel veritabanı istatistikleri
SELECT 
    'TABLES' AS object_type,
    COUNT(*) AS count
FROM 
    information_schema.tables
WHERE 
    table_schema = 'public'
    AND table_type = 'BASE TABLE'

UNION ALL

SELECT 
    'COLUMNS' AS object_type,
    COUNT(*) AS count
FROM 
    information_schema.columns
WHERE 
    table_schema = 'public'

UNION ALL

SELECT 
    'PRIMARY KEYS' AS object_type,
    COUNT(*) AS count
FROM 
    information_schema.table_constraints
WHERE 
    table_schema = 'public'
    AND constraint_type = 'PRIMARY KEY'

UNION ALL

SELECT 
    'FOREIGN KEYS' AS object_type,
    COUNT(*) AS count
FROM 
    information_schema.table_constraints
WHERE 
    table_schema = 'public'
    AND constraint_type = 'FOREIGN KEY'

UNION ALL

SELECT 
    'RLS POLICIES' AS object_type,
    COUNT(*) AS count
FROM 
    pg_policies
WHERE 
    schemaname = 'public'

UNION ALL

SELECT 
    'FUNCTIONS' AS object_type,
    COUNT(*) AS count
FROM 
    pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE 
    n.nspname = 'public'

UNION ALL

SELECT 
    'TRIGGERS' AS object_type,
    COUNT(*) AS count
FROM 
    pg_trigger t
    JOIN pg_class c ON t.tgrelid = c.oid
WHERE 
    c.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

-- =====================================================
-- KULLANIM TALİMATLARI
-- =====================================================

/*
Bu SQL script'i Supabase SQL Editor'da çalıştırarak:

1. Tüm tablo yapılarını görebilirsiniz
2. RLS politikalarını kontrol edebilirsiniz  
3. Foreign key ilişkilerini görebilirsiniz
4. İndeksleri listeleyebilirsiniz
5. Fonksiyon ve trigger'ları görebilirsiniz

Her bölümü ayrı ayrı çalıştırarak detaylı bilgi alabilirsiniz.

Önemli Notlar:
- Bazı sorgular büyük veri setleri için yavaş olabilir
- RLS politikaları sadece admin kullanıcılar tarafından görülebilir
- pg_policies tablosu sadece RLS aktif tablolar için bilgi verir
*/
