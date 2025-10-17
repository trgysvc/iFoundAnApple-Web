#!/usr/bin/env node

/**
 * Supabase Database Schema Export Script
 * Tüm tabloları, yapıları ve RLS politikalarını export eder
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase konfigürasyonu
const SUPABASE_URL = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'YOUR_SERVICE_KEY';

// Supabase client oluştur
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Export edilecek veriler
const exportData = {
  timestamp: new Date().toISOString(),
  tables: [],
  rlsPolicies: [],
  functions: [],
  triggers: [],
  indexes: [],
  foreignKeys: [],
  enums: []
};

/**
 * Tüm tabloları getir
 */
async function exportTables() {
  console.log('📋 Tablolar export ediliyor...');
  
  try {
    // Tabloları listele
    const { data: tables, error } = await supabase.rpc('get_all_tables');
    
    if (error) {
      console.warn('RPC fonksiyonu bulunamadı, alternatif yöntem kullanılıyor...');
      // Alternatif: Bilinen tabloları manuel olarak sorgula
      const knownTables = [
        'audit_logs', 'cargo_companies', 'cargo_shipments', 'device_models', 
        'devices', 'escrow_accounts', 'financial_transactions', 'notifications', 
        'payments', 'userprofile', 'users'
      ];
      
      for (const tableName of knownTables) {
        await exportTableSchema(tableName);
      }
    } else {
      for (const table of tables) {
        await exportTableSchema(table.table_name);
      }
    }
  } catch (error) {
    console.error('Tablo export hatası:', error);
  }
}

/**
 * Belirli bir tablonun şemasını export et
 */
async function exportTableSchema(tableName) {
  try {
    console.log(`  📄 ${tableName} tablosu işleniyor...`);
    
    // Tablo bilgilerini al
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('*')
      .eq('table_name', tableName)
      .eq('table_schema', 'public');
    
    if (columnsError) {
      console.warn(`  ⚠️ ${tableName} için sütun bilgileri alınamadı:`, columnsError.message);
      return;
    }
    
    // Tablo yapısını oluştur
    const tableSchema = {
      name: tableName,
      columns: columns.map(col => ({
        name: col.column_name,
        type: col.data_type,
        isNullable: col.is_nullable === 'YES',
        defaultValue: col.column_default,
        maxLength: col.character_maximum_length,
        numericPrecision: col.numeric_precision,
        numericScale: col.numeric_scale,
        isPrimaryKey: col.column_name === 'id', // Basit kontrol
        description: null // TODO: Comments tablosundan alınabilir
      })),
      constraints: [],
      indexes: []
    };
    
    // Primary key bilgilerini al
    const { data: primaryKeys } = await supabase
      .from('information_schema.table_constraints')
      .select('*')
      .eq('table_name', tableName)
      .eq('constraint_type', 'PRIMARY KEY');
    
    if (primaryKeys && primaryKeys.length > 0) {
      tableSchema.constraints.push({
        type: 'PRIMARY KEY',
        columns: primaryKeys.map(pk => pk.constraint_name)
      });
    }
    
    // Foreign key bilgilerini al
    const { data: foreignKeys } = await supabase
      .from('information_schema.table_constraints')
      .select(`
        constraint_name,
        constraint_type,
        table_name,
        referenced_table_name
      `)
      .eq('table_name', tableName)
      .eq('constraint_type', 'FOREIGN KEY');
    
    if (foreignKeys && foreignKeys.length > 0) {
      for (const fk of foreignKeys) {
        tableSchema.constraints.push({
          type: 'FOREIGN KEY',
          name: fk.constraint_name,
          referencedTable: fk.referenced_table_name
        });
      }
    }
    
    // Index bilgilerini al
    const { data: indexes } = await supabase
      .from('pg_indexes')
      .select('*')
      .eq('tablename', tableName);
    
    if (indexes && indexes.length > 0) {
      tableSchema.indexes = indexes.map(idx => ({
        name: idx.indexname,
        columns: idx.indexdef,
        isUnique: idx.indexdef.includes('UNIQUE')
      }));
    }
    
    exportData.tables.push(tableSchema);
    
  } catch (error) {
    console.error(`  ❌ ${tableName} export hatası:`, error.message);
  }
}

/**
 * RLS politikalarını export et
 */
async function exportRLSPolicies() {
  console.log('🔒 RLS politikaları export ediliyor...');
  
  try {
    // RLS politikalarını al
    const { data: policies, error } = await supabase
      .from('pg_policies')
      .select('*')
      .eq('schemaname', 'public');
    
    if (error) {
      console.warn('RLS politikaları alınamadı:', error.message);
      return;
    }
    
    exportData.rlsPolicies = policies.map(policy => ({
      tableName: policy.tablename,
      policyName: policy.policyname,
      permissive: policy.permissive,
      roles: policy.roles,
      cmd: policy.cmd,
      qual: policy.qual,
      withCheck: policy.with_check
    }));
    
    console.log(`  ✅ ${policies.length} RLS politikası bulundu`);
    
  } catch (error) {
    console.error('RLS politikaları export hatası:', error);
  }
}

/**
 * Fonksiyonları export et
 */
async function exportFunctions() {
  console.log('⚙️ Fonksiyonlar export ediliyor...');
  
  try {
    const { data: functions, error } = await supabase
      .from('pg_proc')
      .select(`
        proname as name,
        prosrc as source,
        proargtypes as argument_types,
        prorettype as return_type
      `)
      .eq('pronamespace', 2200); // public schema
    
    if (error) {
      console.warn('Fonksiyonlar alınamadı:', error.message);
      return;
    }
    
    exportData.functions = functions.map(func => ({
      name: func.name,
      source: func.source,
      argumentTypes: func.argument_types,
      returnType: func.return_type
    }));
    
    console.log(`  ✅ ${functions.length} fonksiyon bulundu`);
    
  } catch (error) {
    console.error('Fonksiyonlar export hatası:', error);
  }
}

/**
 * Trigger'ları export et
 */
async function exportTriggers() {
  console.log('🔔 Trigger\'lar export ediliyor...');
  
  try {
    const { data: triggers, error } = await supabase
      .from('pg_trigger')
      .select(`
        tgname as name,
        tgrelid as table_id,
        tgfoid as function_id
      `);
    
    if (error) {
      console.warn('Trigger\'lar alınamadı:', error.message);
      return;
    }
    
    exportData.triggers = triggers.map(trigger => ({
      name: trigger.name,
      tableId: trigger.table_id,
      functionId: trigger.function_id
    }));
    
    console.log(`  ✅ ${triggers.length} trigger bulundu`);
    
  } catch (error) {
    console.error('Trigger\'lar export hatası:', error);
  }
}

/**
 * Enum tiplerini export et
 */
async function exportEnums() {
  console.log('📝 Enum tipleri export ediliyor...');
  
  try {
    const { data: enums, error } = await supabase
      .from('pg_enum')
      .select(`
        enumtypid as type_id,
        enumlabel as label,
        enumsortorder as sort_order
      `);
    
    if (error) {
      console.warn('Enum\'lar alınamadı:', error.message);
      return;
    }
    
    // Enum'ları grupla
    const enumGroups = {};
    enums.forEach(enumItem => {
      if (!enumGroups[enumItem.type_id]) {
        enumGroups[enumItem.type_id] = {
          typeId: enumItem.type_id,
          values: []
        };
      }
      enumGroups[enumItem.type_id].values.push({
        label: enumItem.label,
        sortOrder: enumItem.sort_order
      });
    });
    
    exportData.enums = Object.values(enumGroups);
    console.log(`  ✅ ${Object.keys(enumGroups).length} enum tipi bulundu`);
    
  } catch (error) {
    console.error('Enum\'lar export hatası:', error);
  }
}

/**
 * SQL CREATE script'i oluştur
 */
function generateSQLScript() {
  console.log('📝 SQL script oluşturuluyor...');
  
  let sql = `-- iFoundAnApple Database Schema Export
-- Generated: ${new Date().toISOString()}
-- Supabase Project: ${SUPABASE_URL}

-- Enable RLS
ALTER DATABASE postgres SET "app.settings.jwt_secret" TO 'your-jwt-secret';

`;

  // Enum'ları oluştur
  if (exportData.enums.length > 0) {
    sql += '\n-- ENUM TYPES\n';
    exportData.enums.forEach(enumType => {
      sql += `-- Enum Type ID: ${enumType.typeId}\n`;
      sql += `-- Values: ${enumType.values.map(v => v.label).join(', ')}\n\n`;
    });
  }

  // Tabloları oluştur
  sql += '\n-- TABLES\n';
  exportData.tables.forEach(table => {
    sql += `\n-- Table: ${table.name}\n`;
    sql += `CREATE TABLE IF NOT EXISTS ${table.name} (\n`;
    
    table.columns.forEach((column, index) => {
      sql += `  ${column.name} ${column.type}`;
      
      if (column.maxLength) {
        sql += `(${column.maxLength})`;
      } else if (column.numericPrecision) {
        sql += `(${column.numericPrecision}${column.numericScale ? ',' + column.numericScale : ''})`;
      }
      
      if (!column.isNullable) {
        sql += ' NOT NULL';
      }
      
      if (column.defaultValue) {
        sql += ` DEFAULT ${column.defaultValue}`;
      }
      
      if (index < table.columns.length - 1) {
        sql += ',';
      }
      
      sql += '\n';
    });
    
    sql += ');\n';
    
    // Primary key ekle
    const primaryKey = table.constraints.find(c => c.type === 'PRIMARY KEY');
    if (primaryKey) {
      sql += `ALTER TABLE ${table.name} ADD PRIMARY KEY (id);\n`;
    }
    
    // Foreign key'leri ekle
    table.constraints
      .filter(c => c.type === 'FOREIGN KEY')
      .forEach(fk => {
        sql += `-- Foreign key: ${fk.name} -> ${fk.referencedTable}\n`;
      });
  });

  // RLS politikalarını ekle
  if (exportData.rlsPolicies.length > 0) {
    sql += '\n-- RLS POLICIES\n';
    exportData.rlsPolicies.forEach(policy => {
      sql += `\n-- Policy: ${policy.policyName} on ${policy.tableName}\n`;
      sql += `ALTER TABLE ${policy.tableName} ENABLE ROW LEVEL SECURITY;\n`;
      sql += `CREATE POLICY "${policy.policyName}" ON ${policy.tableName}\n`;
      sql += `  FOR ${policy.cmd}\n`;
      sql += `  TO ${policy.roles.join(', ')}\n`;
      if (policy.qual) {
        sql += `  USING (${policy.qual})\n`;
      }
      if (policy.withCheck) {
        sql += `  WITH CHECK (${policy.withCheck})\n`;
      }
      sql += ';\n';
    });
  }

  return sql;
}

/**
 * Ana export fonksiyonu
 */
async function exportDatabaseSchema() {
  console.log('🚀 Supabase Database Schema Export başlatılıyor...\n');
  
  try {
    // Tüm verileri export et
    await exportTables();
    await exportRLSPolicies();
    await exportFunctions();
    await exportTriggers();
    await exportEnums();
    
    // Çıktı klasörünü oluştur
    const outputDir = path.join(__dirname, '..', 'exports');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // JSON export
    const jsonFile = path.join(outputDir, `database-schema-${Date.now()}.json`);
    fs.writeFileSync(jsonFile, JSON.stringify(exportData, null, 2));
    console.log(`\n✅ JSON export tamamlandı: ${jsonFile}`);
    
    // SQL export
    const sqlScript = generateSQLScript();
    const sqlFile = path.join(outputDir, `database-schema-${Date.now()}.sql`);
    fs.writeFileSync(sqlFile, sqlScript);
    console.log(`✅ SQL export tamamlandı: ${sqlFile}`);
    
    // Markdown export
    const markdownFile = path.join(outputDir, `database-schema-${Date.now()}.md`);
    const markdownContent = generateMarkdownDocumentation();
    fs.writeFileSync(markdownFile, markdownContent);
    console.log(`✅ Markdown export tamamlandı: ${markdownFile}`);
    
    // Özet bilgiler
    console.log('\n📊 EXPORT ÖZETİ:');
    console.log(`  📋 Tablolar: ${exportData.tables.length}`);
    console.log(`  🔒 RLS Politikaları: ${exportData.rlsPolicies.length}`);
    console.log(`  ⚙️ Fonksiyonlar: ${exportData.functions.length}`);
    console.log(`  🔔 Trigger'lar: ${exportData.triggers.length}`);
    console.log(`  📝 Enum'lar: ${exportData.enums.length}`);
    
    console.log('\n🎉 Export işlemi başarıyla tamamlandı!');
    
  } catch (error) {
    console.error('❌ Export hatası:', error);
    process.exit(1);
  }
}

/**
 * Markdown dokümantasyonu oluştur
 */
function generateMarkdownDocumentation() {
  let md = `# iFoundAnApple Database Schema

**Export Tarihi:** ${new Date().toLocaleString('tr-TR')}  
**Supabase URL:** ${SUPABASE_URL}

## 📋 Tablolar (${exportData.tables.length})

`;

  exportData.tables.forEach(table => {
    md += `### ${table.name}\n\n`;
    
    md += `| Sütun | Tip | Null | Varsayılan | Açıklama |\n`;
    md += `|-------|-----|------|------------|----------|\n`;
    
    table.columns.forEach(column => {
      md += `| ${column.name} | ${column.type} | ${column.isNullable ? 'Evet' : 'Hayır'} | ${column.defaultValue || '-'} | - |\n`;
    });
    
    md += '\n';
    
    if (table.constraints.length > 0) {
      md += `**Kısıtlamalar:**\n`;
      table.constraints.forEach(constraint => {
        md += `- ${constraint.type}: ${constraint.name || 'N/A'}\n`;
      });
      md += '\n';
    }
    
    if (table.indexes.length > 0) {
      md += `**İndeksler:**\n`;
      table.indexes.forEach(index => {
        md += `- ${index.name} (${index.isUnique ? 'Unique' : 'Normal'})\n`;
      });
      md += '\n';
    }
  });

  if (exportData.rlsPolicies.length > 0) {
    md += `## 🔒 RLS Politikaları (${exportData.rlsPolicies.length})\n\n`;
    
    exportData.rlsPolicies.forEach(policy => {
      md += `### ${policy.policyName} (${policy.tableName})\n\n`;
      md += `- **Komut:** ${policy.cmd}\n`;
      md += `- **Roller:** ${policy.roles.join(', ')}\n`;
      if (policy.qual) {
        md += `- **Koşul:** ${policy.qual}\n`;
      }
      if (policy.withCheck) {
        md += `- **Check:** ${policy.withCheck}\n`;
      }
      md += '\n';
    });
  }

  if (exportData.functions.length > 0) {
    md += `## ⚙️ Fonksiyonlar (${exportData.functions.length})\n\n`;
    
    exportData.functions.forEach(func => {
      md += `### ${func.name}\n\n`;
      md += `- **Dönüş Tipi:** ${func.returnType}\n`;
      md += `- **Argüman Tipleri:** ${func.argumentTypes}\n`;
      md += '\n';
    });
  }

  if (exportData.enums.length > 0) {
    md += `## 📝 Enum Tipleri (${exportData.enums.length})\n\n`;
    
    exportData.enums.forEach(enumType => {
      md += `### Enum Type ID: ${enumType.typeId}\n\n`;
      md += `**Değerler:**\n`;
      enumType.values.forEach(value => {
        md += `- ${value.label}\n`;
      });
      md += '\n';
    });
  }

  return md;
}

// Script'i çalıştır
if (require.main === module) {
  exportDatabaseSchema();
}

module.exports = {
  exportDatabaseSchema,
  exportTables,
  exportRLSPolicies,
  exportFunctions,
  exportTriggers,
  exportEnums
};

