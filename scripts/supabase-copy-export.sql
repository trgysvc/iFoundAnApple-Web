-- =====================================================
-- SUPABASE TABLO ŞEMALARI VE RLS POLİTİKALARI EXPORT
-- COPY komutları ile tam şema ve politika export'u
-- =====================================================

-- =====================================================
-- 1. TÜM TABLOLARIN ŞEMALARINI EXPORT ET
-- =====================================================

-- devices tablosu şeması
COPY (
    SELECT 
        'devices' AS table_name,
        column_name,
        data_type,
        character_maximum_length,
        numeric_precision,
        numeric_scale,
        is_nullable,
        column_default,
        ordinal_position
    FROM 
        information_schema.columns
    WHERE 
        table_schema = 'public'
        AND table_name = 'devices'
    ORDER BY 
        ordinal_position
) TO STDOUT WITH CSV HEADER;

-- payments tablosu şeması
COPY (
    SELECT 
        'payments' AS table_name,
        column_name,
        data_type,
        character_maximum_length,
        numeric_precision,
        numeric_scale,
        is_nullable,
        column_default,
        ordinal_position
    FROM 
        information_schema.columns
    WHERE 
        table_schema = 'public'
        AND table_name = 'payments'
    ORDER BY 
        ordinal_position
) TO STDOUT WITH CSV HEADER;

-- escrow_accounts tablosu şeması
COPY (
    SELECT 
        'escrow_accounts' AS table_name,
        column_name,
        data_type,
        character_maximum_length,
        numeric_precision,
        numeric_scale,
        is_nullable,
        column_default,
        ordinal_position
    FROM 
        information_schema.columns
    WHERE 
        table_schema = 'public'
        AND table_name = 'escrow_accounts'
    ORDER BY 
        ordinal_position
) TO STDOUT WITH CSV HEADER;

-- notifications tablosu şeması
COPY (
    SELECT 
        'notifications' AS table_name,
        column_name,
        data_type,
        character_maximum_length,
        numeric_precision,
        numeric_scale,
        is_nullable,
        column_default,
        ordinal_position
    FROM 
        information_schema.columns
    WHERE 
        table_schema = 'public'
        AND table_name = 'notifications'
    ORDER BY 
        ordinal_position
) TO STDOUT WITH CSV HEADER;

-- cargo_shipments tablosu şeması
COPY (
    SELECT 
        'cargo_shipments' AS table_name,
        column_name,
        data_type,
        character_maximum_length,
        numeric_precision,
        numeric_scale,
        is_nullable,
        column_default,
        ordinal_position
    FROM 
        information_schema.columns
    WHERE 
        table_schema = 'public'
        AND table_name = 'cargo_shipments'
    ORDER BY 
        ordinal_position
) TO STDOUT WITH CSV HEADER;

-- financial_transactions tablosu şeması
COPY (
    SELECT 
        'financial_transactions' AS table_name,
        column_name,
        data_type,
        character_maximum_length,
        numeric_precision,
        numeric_scale,
        is_nullable,
        column_default,
        ordinal_position
    FROM 
        information_schema.columns
    WHERE 
        table_schema = 'public'
        AND table_name = 'financial_transactions'
    ORDER BY 
        ordinal_position
) TO STDOUT WITH CSV HEADER;

-- audit_logs tablosu şeması
COPY (
    SELECT 
        'audit_logs' AS table_name,
        column_name,
        data_type,
        character_maximum_length,
        numeric_precision,
        numeric_scale,
        is_nullable,
        column_default,
        ordinal_position
    FROM 
        information_schema.columns
    WHERE 
        table_schema = 'public'
        AND table_name = 'audit_logs'
    ORDER BY 
        ordinal_position
) TO STDOUT WITH CSV HEADER;

-- device_models tablosu şeması
COPY (
    SELECT 
        'device_models' AS table_name,
        column_name,
        data_type,
        character_maximum_length,
        numeric_precision,
        numeric_scale,
        is_nullable,
        column_default,
        ordinal_position
    FROM 
        information_schema.columns
    WHERE 
        table_schema = 'public'
        AND table_name = 'device_models'
    ORDER BY 
        ordinal_position
) TO STDOUT WITH CSV HEADER;

-- cargo_companies tablosu şeması
COPY (
    SELECT 
        'cargo_companies' AS table_name,
        column_name,
        data_type,
        character_maximum_length,
        numeric_precision,
        numeric_scale,
        is_nullable,
        column_default,
        ordinal_position
    FROM 
        information_schema.columns
    WHERE 
        table_schema = 'public'
        AND table_name = 'cargo_companies'
    ORDER BY 
        ordinal_position
) TO STDOUT WITH CSV HEADER;

-- userprofile tablosu şeması
COPY (
    SELECT 
        'userprofile' AS table_name,
        column_name,
        data_type,
        character_maximum_length,
        numeric_precision,
        numeric_scale,
        is_nullable,
        column_default,
        ordinal_position
    FROM 
        information_schema.columns
    WHERE 
        table_schema = 'public'
        AND table_name = 'userprofile'
    ORDER BY 
        ordinal_position
) TO STDOUT WITH CSV HEADER;

-- =====================================================
-- 2. TÜM TABLOLARIN PRIMARY KEY'LERİNİ EXPORT ET
-- =====================================================

COPY (
    SELECT 
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
        tc.table_name
) TO STDOUT WITH CSV HEADER;

-- =====================================================
-- 3. TÜM FOREIGN KEY İLİŞKİLERİNİ EXPORT ET
-- =====================================================

COPY (
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
        tc.table_name, kcu.column_name
) TO STDOUT WITH CSV HEADER;

-- =====================================================
-- 4. TÜM RLS POLİTİKALARINI EXPORT ET
-- =====================================================

-- RLS durumu
COPY (
    SELECT 
        'RLS_STATUS' AS export_type,
        tablename,
        CASE WHEN rowsecurity THEN 'ENABLED' ELSE 'DISABLED' END AS rls_status,
        CASE WHEN hasrls THEN 'HAS_POLICIES' ELSE 'NO_POLICIES' END AS policy_status
    FROM 
        pg_tables
    WHERE 
        schemaname = 'public'
    ORDER BY 
        tablename
) TO STDOUT WITH CSV HEADER;

-- RLS politikaları detayları
COPY (
    SELECT 
        'RLS_POLICY' AS export_type,
        tablename,
        policyname,
        CASE WHEN permissive THEN 'PERMISSIVE' ELSE 'RESTRICTIVE' END AS policy_type,
        COALESCE(STRING_AGG(roles, ', '), 'PUBLIC') AS roles,
        cmd AS command,
        COALESCE(qual, 'NO_CONDITION') AS condition,
        COALESCE(with_check, 'NO_CHECK') AS with_check
    FROM 
        pg_policies
    WHERE 
        schemaname = 'public'
    GROUP BY 
        tablename, policyname, permissive, cmd, qual, with_check
    ORDER BY 
        tablename, policyname
) TO STDOUT WITH CSV HEADER;

-- =====================================================
-- 5. TÜM İNDEKSLERİ EXPORT ET
-- =====================================================

COPY (
    SELECT 
        schemaname,
        tablename,
        indexname,
        CASE 
            WHEN indexdef LIKE '%UNIQUE%' THEN 'UNIQUE'
            WHEN indexdef LIKE '%PRIMARY%' THEN 'PRIMARY'
            ELSE 'NORMAL'
        END AS index_type,
        indexdef AS index_definition,
        idx_scan AS times_used,
        idx_tup_read AS tuples_read,
        idx_tup_fetch AS tuples_fetched
    FROM 
        pg_stat_user_indexes
    WHERE 
        schemaname = 'public'
    ORDER BY 
        tablename, indexname
) TO STDOUT WITH CSV HEADER;

-- =====================================================
-- 6. TÜM CONSTRAINT'LERİ EXPORT ET
-- =====================================================

COPY (
    SELECT 
        tc.table_name,
        tc.constraint_name,
        tc.constraint_type,
        COALESCE(cc.check_clause, 'NO_CHECK') AS check_clause,
        STRING_AGG(kcu.column_name, ', ' ORDER BY kcu.ordinal_position) AS affected_columns
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
        tc.table_name, tc.constraint_type
) TO STDOUT WITH CSV HEADER;

-- =====================================================
-- 7. TÜM FONKSİYONLARI EXPORT ET
-- =====================================================

COPY (
    SELECT 
        n.nspname AS schema_name,
        p.proname AS function_name,
        pg_get_function_result(p.oid) AS return_type,
        pg_get_function_arguments(p.oid) AS arguments,
        CASE p.provolatile
            WHEN 'i' THEN 'IMMUTABLE'
            WHEN 's' THEN 'STABLE'
            WHEN 'v' THEN 'VOLATILE'
            ELSE 'UNKNOWN'
        END AS volatility,
        CASE WHEN p.proisstrict THEN 'STRICT' ELSE 'NON_STRICT' END AS strict_status,
        CASE WHEN p.prosecdef THEN 'SECURITY_DEFINER' ELSE 'SECURITY_INVOKER' END AS security_type
    FROM 
        pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE 
        n.nspname = 'public'
    ORDER BY 
        p.proname
) TO STDOUT WITH CSV HEADER;

-- =====================================================
-- 8. TÜM TRİGGER'LARI EXPORT ET
-- =====================================================

COPY (
    SELECT 
        c.relname AS table_name,
        t.tgname AS trigger_name,
        p.proname AS function_name,
        CASE t.tgenabled
            WHEN 'O' THEN 'ENABLED'
            WHEN 'D' THEN 'DISABLED'
            WHEN 'R' THEN 'REPLICA'
            WHEN 'A' THEN 'ALWAYS'
            ELSE 'UNKNOWN'
        END AS trigger_status,
        CASE 
            WHEN t.tgtype & 1 = 1 THEN 'BEFORE'
            WHEN t.tgtype & 2 = 2 THEN 'AFTER'
            WHEN t.tgtype & 3 = 3 THEN 'INSTEAD_OF'
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
        AND NOT t.tgisinternal
    ORDER BY 
        c.relname, t.tgname
) TO STDOUT WITH CSV HEADER;

-- =====================================================
-- 9. ENUM TİPLERİNİ EXPORT ET
-- =====================================================

COPY (
    SELECT 
        t.typname AS enum_name,
        e.enumlabel AS enum_value,
        e.enumsortorder AS sort_order,
        pg_catalog.format_type(t.oid, NULL) AS full_type_name
    FROM 
        pg_type t
        JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE 
        t.typtype = 'e'
    ORDER BY 
        t.typname, e.enumsortorder
) TO STDOUT WITH CSV HEADER;

-- =====================================================
-- 10. TABLO BOYUTLARI VE İSTATİSTİKLERİ EXPORT ET
-- =====================================================

COPY (
    SELECT 
        schemaname,
        tablename,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
        pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS index_size,
        pg_total_relation_size(schemaname||'.'||tablename) AS total_bytes,
        pg_relation_size(schemaname||'.'||tablename) AS table_bytes,
        n_live_tup AS current_rows,
        n_tup_ins AS total_inserts,
        n_tup_upd AS total_updates,
        n_tup_del AS total_deletes
    FROM 
        pg_tables pt
        LEFT JOIN pg_stat_user_tables pst ON pt.tablename = pst.relname AND pt.schemaname = pst.schemaname
    WHERE 
        pt.schemaname = 'public'
    ORDER BY 
        pg_total_relation_size(pt.schemaname||'.'||pt.tablename) DESC
) TO STDOUT WITH CSV HEADER;

-- =====================================================
-- 11. KULLANICI İZİNLERİNİ EXPORT ET
-- =====================================================

COPY (
    SELECT 
        table_schema,
        table_name,
        grantee,
        privilege_type,
        CASE WHEN is_grantable = 'YES' THEN 'GRANTABLE' ELSE 'NOT_GRANTABLE' END AS grantable_status
    FROM 
        information_schema.table_privileges
    WHERE 
        table_schema = 'public'
    ORDER BY 
        table_name, grantee, privilege_type
) TO STDOUT WITH CSV HEADER;

-- =====================================================
-- 12. VERİTABANI GENEL İSTATİSTİKLERİNİ EXPORT ET
-- =====================================================

COPY (
    SELECT 
        'DATABASE_STATS' AS export_type,
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
        tup_deleted AS tuples_deleted,
        stats_reset AS stats_reset_time
    FROM 
        pg_stat_database
    WHERE 
        datname = current_database()
) TO STDOUT WITH CSV HEADER;

-- =====================================================
-- KULLANIM TALİMATLARI
-- =====================================================

/*
Bu script'i Supabase SQL Editor'da çalıştırarak:

1. ✅ Tüm tabloların şemalarını CSV formatında export edebilirsiniz
2. ✅ RLS politikalarını detaylı olarak export edebilirsiniz
3. ✅ Primary key'leri export edebilirsiniz
4. ✅ Foreign key ilişkilerini export edebilirsiniz
5. ✅ İndeksleri export edebilirsiniz
6. ✅ Constraint'leri export edebilirsiniz
7. ✅ Fonksiyonları export edebilirsiniz
8. ✅ Trigger'ları export edebilirsiniz
9. ✅ Enum tiplerini export edebilirsiniz
10. ✅ Tablo boyutlarını export edebilirsiniz
11. ✅ Kullanıcı izinlerini export edebilirsiniz
12. ✅ Veritabanı istatistiklerini export edebilirsiniz

Her COPY komutu ayrı bir CSV çıktısı üretir.
Bu çıktıları dosyalara kaydederek bana gönderebilirsiniz.

Alternatif olarak, her sorguyu ayrı ayrı çalıştırarak
sonuçları kopyalayıp bana gönderebilirsiniz.
*/

