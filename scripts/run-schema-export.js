#!/usr/bin/env node

/**
 * Supabase Schema Export Runner
 * SQL script'ini çalıştırır ve sonuçları dosyalara kaydeder
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase konfigürasyonu
const SUPABASE_URL = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'YOUR_SERVICE_KEY';

// Supabase client oluştur
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// SQL sorguları
const queries = {
  // 1. Tablo yapıları
  tableStructures: `
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
  `,

  // 2. Primary key'ler
  primaryKeys: `
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
  `,

  // 3. Foreign key'ler
  foreignKeys: `
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
  `,

  // 4. İndeksler
  indexes: `
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
  `,

  // 5. RLS politikaları
  rlsPolicies: `
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
  `,

  // 6. RLS durumu
  rlsStatus: `
    SELECT 
        schemaname,
        tablename,
        rowsecurity
    FROM 
        pg_tables
    WHERE 
        schemaname = 'public'
    ORDER BY 
        tablename;
  `,

  // 7. Enum tipleri
  enums: `
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
  `,

  // 8. Fonksiyonlar
  functions: `
    SELECT 
        n.nspname AS schema_name,
        p.proname AS function_name,
        pg_get_function_result(p.oid) AS return_type,
        pg_get_function_arguments(p.oid) AS arguments
    FROM 
        pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE 
        n.nspname = 'public'
    ORDER BY 
        p.proname;
  `,

  // 9. Trigger'lar
  triggers: `
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
  `,

  // 10. Tablo boyutları
  tableSizes: `
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
  `,

  // 11. Özet istatistikler
  summaryStats: `
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
  `
};

/**
 * SQL sorgusunu çalıştır
 */
async function executeQuery(queryName, query) {
  try {
    console.log(`📊 ${queryName} sorgusu çalıştırılıyor...`);
    
    const { data, error } = await supabase.rpc('execute_sql', { 
      sql_query: query 
    });

    if (error) {
      console.warn(`⚠️ ${queryName} hatası:`, error.message);
      return { error: error.message };
    }

    console.log(`✅ ${queryName} tamamlandı - ${data?.length || 0} kayıt`);
    return { data: data || [] };
  } catch (err) {
    console.error(`❌ ${queryName} hatası:`, err.message);
    return { error: err.message };
  }
}

/**
 * Tüm sorguları çalıştır ve sonuçları topla
 */
async function exportSchema() {
  console.log('🚀 Supabase Schema Export başlatılıyor...\n');

  const results = {
    timestamp: new Date().toISOString(),
    supabaseUrl: SUPABASE_URL,
    queries: {}
  };

  // Her sorguyu çalıştır
  for (const [queryName, query] of Object.entries(queries)) {
    const result = await executeQuery(queryName, query);
    results.queries[queryName] = result;
  }

  // Sonuçları dosyaya kaydet
  const outputDir = path.join(__dirname, '..', 'exports');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  // JSON export
  const jsonFile = path.join(outputDir, `schema-export-${timestamp}.json`);
  fs.writeFileSync(jsonFile, JSON.stringify(results, null, 2));
  console.log(`\n📄 JSON export: ${jsonFile}`);

  // Markdown raporu oluştur
  const markdownFile = path.join(outputDir, `schema-report-${timestamp}.md`);
  const markdownContent = generateMarkdownReport(results);
  fs.writeFileSync(markdownFile, markdownContent);
  console.log(`📄 Markdown raporu: ${markdownFile}`);

  // SQL CREATE script'leri oluştur
  const sqlFile = path.join(outputDir, `create-scripts-${timestamp}.sql`);
  const sqlContent = generateCreateScripts(results);
  fs.writeFileSync(sqlFile, sqlContent);
  console.log(`📄 SQL CREATE script'leri: ${sqlFile}`);

  console.log('\n🎉 Schema export tamamlandı!');
  
  return results;
}

/**
 * Markdown raporu oluştur
 */
function generateMarkdownReport(results) {
  let md = `# Supabase Database Schema Report

**Export Tarihi:** ${new Date().toLocaleString('tr-TR')}  
**Supabase URL:** ${results.supabaseUrl}

## 📊 Özet İstatistikler

`;

  // Özet istatistikler
  const summaryData = results.queries.summaryStats?.data || [];
  if (summaryData.length > 0) {
    md += `| Nesne Tipi | Sayı |\n`;
    md += `|------------|------|\n`;
    summaryData.forEach(item => {
      md += `| ${item.object_type} | ${item.count} |\n`;
    });
    md += '\n';
  }

  // Tablo yapıları
  const tableData = results.queries.tableStructures?.data || [];
  if (tableData.length > 0) {
    md += `## 📋 Tablo Yapıları\n\n`;
    
    const tables = {};
    tableData.forEach(row => {
      if (!tables[row.table_name]) {
        tables[row.table_name] = [];
      }
      tables[row.table_name].push(row);
    });

    Object.keys(tables).forEach(tableName => {
      md += `### ${tableName}\n\n`;
      md += `| Sütun | Tip | Null | Varsayılan |\n`;
      md += `|-------|-----|------|------------|\n`;
      
      tables[tableName].forEach(column => {
        md += `| ${column.column_name} | ${column.data_type} | ${column.is_nullable} | ${column.column_default || '-'} |\n`;
      });
      md += '\n';
    });
  }

  // RLS politikaları
  const rlsData = results.queries.rlsPolicies?.data || [];
  if (rlsData.length > 0) {
    md += `## 🔒 RLS Politikaları\n\n`;
    
    const policiesByTable = {};
    rlsData.forEach(policy => {
      if (!policiesByTable[policy.tablename]) {
        policiesByTable[policy.tablename] = [];
      }
      policiesByTable[policy.tablename].push(policy);
    });

    Object.keys(policiesByTable).forEach(tableName => {
      md += `### ${tableName}\n\n`;
      policiesByTable[tableName].forEach(policy => {
        md += `**${policy.policyname}**\n`;
        md += `- Komut: ${policy.cmd}\n`;
        md += `- Roller: ${policy.roles?.join(', ') || 'All'}\n`;
        if (policy.qual) {
          md += `- Koşul: ${policy.qual}\n`;
        }
        if (policy.with_check) {
          md += `- Check: ${policy.with_check}\n`;
        }
        md += '\n';
      });
    });
  }

  // Foreign key'ler
  const fkData = results.queries.foreignKeys?.data || [];
  if (fkData.length > 0) {
    md += `## 🔗 Foreign Key İlişkileri\n\n`;
    md += `| Tablo | Sütun | Referans Tablo | Referans Sütun |\n`;
    md += `|-------|-------|----------------|----------------|\n`;
    
    fkData.forEach(fk => {
      md += `| ${fk.table_name} | ${fk.column_name} | ${fk.foreign_table_name} | ${fk.foreign_column_name} |\n`;
    });
    md += '\n';
  }

  return md;
}

/**
 * SQL CREATE script'leri oluştur
 */
function generateCreateScripts(results) {
  let sql = `-- Supabase Database CREATE Scripts
-- Generated: ${new Date().toISOString()}

-- Enable RLS
ALTER DATABASE postgres SET "app.settings.jwt_secret" TO 'your-jwt-secret';

`;

  // Tablo yapılarından CREATE script'leri oluştur
  const tableData = results.queries.tableStructures?.data || [];
  if (tableData.length > 0) {
    const tables = {};
    tableData.forEach(row => {
      if (!tables[row.table_name]) {
        tables[row.table_name] = [];
      }
      tables[row.table_name].push(row);
    });

    Object.keys(tables).forEach(tableName => {
      sql += `\n-- Table: ${tableName}\n`;
      sql += `CREATE TABLE IF NOT EXISTS ${tableName} (\n`;
      
      const columns = tables[tableName];
      columns.forEach((column, index) => {
        sql += `  ${column.column_name} `;
        
        // Data type mapping
        switch (column.data_type) {
          case 'character varying':
            sql += `VARCHAR(${column.character_maximum_length})`;
            break;
          case 'character':
            sql += `CHAR(${column.character_maximum_length})`;
            break;
          case 'numeric':
            sql += `NUMERIC(${column.numeric_precision},${column.numeric_scale})`;
            break;
          case 'timestamp with time zone':
            sql += 'TIMESTAMPTZ';
            break;
          case 'timestamp without time zone':
            sql += 'TIMESTAMP';
            break;
          case 'boolean':
            sql += 'BOOLEAN';
            break;
          case 'integer':
            sql += 'INTEGER';
            break;
          case 'bigint':
            sql += 'BIGINT';
            break;
          case 'text':
            sql += 'TEXT';
            break;
          case 'jsonb':
            sql += 'JSONB';
            break;
          case 'uuid':
            sql += 'UUID';
            break;
          default:
            sql += column.data_type.toUpperCase();
        }
        
        if (column.is_nullable === 'NO') {
          sql += ' NOT NULL';
        }
        
        if (column.column_default) {
          sql += ` DEFAULT ${column.column_default}`;
        }
        
        if (index < columns.length - 1) {
          sql += ',';
        }
        
        sql += '\n';
      });
      
      sql += ');\n';
    });
  }

  // RLS politikaları
  const rlsData = results.queries.rlsPolicies?.data || [];
  if (rlsData.length > 0) {
    sql += '\n-- RLS POLICIES\n';
    
    const policiesByTable = {};
    rlsData.forEach(policy => {
      if (!policiesByTable[policy.tablename]) {
        policiesByTable[policy.tablename] = [];
      }
      policiesByTable[policy.tablename].push(policy);
    });

    Object.keys(policiesByTable).forEach(tableName => {
      sql += `\n-- RLS for ${tableName}\n`;
      sql += `ALTER TABLE ${tableName} ENABLE ROW LEVEL SECURITY;\n`;
      
      policiesByTable[tableName].forEach(policy => {
        sql += `CREATE POLICY "${policy.policyname}" ON ${tableName}\n`;
        sql += `  FOR ${policy.cmd}\n`;
        sql += `  TO ${policy.roles?.join(', ') || 'public'}\n`;
        if (policy.qual) {
          sql += `  USING (${policy.qual})\n`;
        }
        if (policy.with_check) {
          sql += `  WITH CHECK (${policy.with_check})\n`;
        }
        sql += ';\n';
      });
    });
  }

  return sql;
}

// Script'i çalıştır
if (require.main === module) {
  exportSchema().catch(console.error);
}

module.exports = { exportSchema, executeQuery };
