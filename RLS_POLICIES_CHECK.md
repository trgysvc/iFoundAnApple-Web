# 🔐 RLS Policies Kontrol Rehberi

Bu rehber, Supabase Storage'da RLS policies'lerin doğru çalışıp çalışmadığını kontrol etmeniz için hazırlanmıştır.

## 📋 Hızlı Kontrol Listesi

### 1. 🏗️ Bucket Kurulumu
- [ ] **Bucket Adı**: `device-documents`
- [ ] **Public Access**: ❌ **KAPALI** (Private bucket)
- [ ] **File Size Limit**: 10MB
- [ ] **MIME Types**: `image/jpeg,image/jpg,image/png,image/webp,application/pdf`

### 2. 🛡️ RLS Policies (3 Adet)

**Supabase Dashboard → Storage → Policies → device-documents**

| # | Policy Adı | Operasyon | Durum | Kontrol |
|---|------------|-----------|-------|---------|
| 1 | `Users can upload their own files` | **INSERT** | ✅ | [ ] |
| 2 | `Users can view only their own files` | **SELECT** | ✅ | [ ] |
| 3 | `Users can delete their own files` | **DELETE** | ✅ | [ ] |

## 🧪 Test Komutları

### Browser Console'da Test Edin:

#### **Test 1: Upload Policy** 
```javascript
// ✅ Kendi klasörünüze yükleme (Başarılı olmalı)
const result1 = await supabase.storage
  .from('device-documents')
  .upload(`invoices/${supabase.auth.user().id}/test-${Date.now()}.txt`, 
    new Blob(['test content']));
console.log('✅ Own upload:', result1.error ? '❌ FAILED' : '✅ SUCCESS');

// ❌ Başkasının klasörüne yükleme (Başarısız olmalı)
const result2 = await supabase.storage
  .from('device-documents')
  .upload('invoices/fake-user-id/test.txt', new Blob(['test']));
console.log('❌ Unauthorized upload:', result2.error ? '✅ BLOCKED' : '❌ SECURITY ISSUE');
```

#### **Test 2: View Policy**
```javascript
// ✅ Kendi dosyalarını listeleme (Başarılı olmalı)
const result3 = await supabase.storage
  .from('device-documents')
  .list(`invoices/${supabase.auth.user().id}`);
console.log('✅ Own files list:', result3.error ? '❌ FAILED' : `✅ SUCCESS (${result3.data?.length} files)`);

// ❌ Başkasının dosyalarını listeleme (Boş olmalı)
const result4 = await supabase.storage
  .from('device-documents')
  .list('invoices/fake-user-id');
console.log('❌ Other files list:', result4.data?.length === 0 ? '✅ BLOCKED' : '❌ SECURITY ISSUE');
```

#### **Test 3: Delete Policy**
```javascript
// ✅ Kendi dosyanızı silme (Başarılı olmalı)
const result5 = await supabase.storage
  .from('device-documents')
  .remove([`invoices/${supabase.auth.user().id}/test-${Date.now()}.txt`]);
console.log('✅ Own file delete:', result5.error ? '❌ FAILED' : '✅ SUCCESS');

// ❌ Başkasının dosyasını silme (Başarısız olmalı)  
const result6 = await supabase.storage
  .from('device-documents')
  .remove(['invoices/fake-user-id/test.txt']);
console.log('❌ Unauthorized delete:', result6.error ? '✅ BLOCKED' : '❌ SECURITY ISSUE');
```

## 🚨 Sorun Giderme

### Policy Eksikse:

**1. Upload Policy Eksik**
```sql
CREATE POLICY "Users can upload their own files"
ON storage.objects FOR INSERT
WITH CHECK (
  auth.uid()::text = (storage.foldername(name))[2] 
  AND bucket_id = 'device-documents'
);
```

**2. Select Policy Eksik**
```sql
CREATE POLICY "Users can view only their own files"
ON storage.objects FOR SELECT
USING (
  auth.uid()::text = (storage.foldername(name))[2] 
  AND bucket_id = 'device-documents'
);
```

**3. Delete Policy Eksik**
```sql
CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE
USING (
  auth.uid()::text = (storage.foldername(name))[2] 
  AND bucket_id = 'device-documents'
);
```

## ✅ Başarı Kriterleri

Tüm testler geçerse:

- ✅ **Upload Test**: Kendi klasörüne yükleme başarılı, başkasının klasörüne yükleme başarısız
- ✅ **View Test**: Kendi dosyalarını görebilme, başkasının dosyalarını görememe  
- ✅ **Delete Test**: Kendi dosyasını silme başarılı, başkasının dosyasını silme başarısız

## 🎯 Sonuç

Tüm testler geçtiyse **🎉 RLS Policies doğru çalışıyor!**

Herhangi bir test başarısız olursa:
1. Policy'lerin varlığını kontrol edin
2. Policy syntax'ını kontrol edin  
3. Bucket'ın private olduğunu kontrol edin
4. User authentication'ını kontrol edin

---

**Created**: January 2025  
**Last Updated**: January 2025
