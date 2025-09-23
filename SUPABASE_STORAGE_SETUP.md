# Supabase Storage Setup Guide

Bu dosya, iFoundAnApple projesi için Supabase Storage kurulumunu açıklar.

## 📁 Storage Bucket Kurulumu

### 1. Supabase Dashboard'ta Storage Bucket Oluşturma

1. **Supabase Dashboard**'a gidin: https://supabase.com/dashboard
2. **Storage** sekmesine tıklayın
3. **Create a new bucket** butonuna tıklayın
4. Bucket bilgilerini girin:
   - **Name**: `device-documents`
   - **Public**: ❌ (UNCHECKED) - Güvenlik için private
   - **File size limit**: `10MB`
   - **Allowed MIME types**: `image/jpeg,image/jpg,image/png,image/webp,application/pdf`

### 2. Bucket Policies Kurulumu

Storage bucket'ı oluşturduktan sonra, dosya yükleme ve erişim politikalarını ayarlamanız gerekir:

#### **🔍 RLS Policies Kontrol Rehberi**

**Supabase Dashboard'ta policies kontrol etmek için:**

1. **Dashboard** → **Storage** → **Policies** sekmesine gidin
2. **`device-documents`** bucket'ını seçin
3. Aşağıdaki 3 policy'nin olduğunu kontrol edin:

| Policy Adı | Operasyon | Durum | Açıklama |
|------------|-----------|-------|----------|
| `Users can upload their own files` | **INSERT** | ✅ Enabled | Dosya yükleme izni |
| `Users can view only their own files` | **SELECT** | ✅ Enabled | Dosya görüntüleme izni |
| `Users can delete their own files` | **DELETE** | ✅ Enabled | Dosya silme izni |

**❌ Eksik policy varsa aşağıdaki SQL komutlarını çalıştırın:**

#### **Upload Policy (Dosya Yükleme)**
```sql
-- Authenticated users can upload files to their own folder
CREATE POLICY "Users can upload their own files"
ON storage.objects FOR INSERT
WITH CHECK (
  auth.uid()::text = (storage.foldername(name))[2] 
  AND bucket_id = 'device-documents'
);
```

#### **Select Policy (Dosya Görüntüleme)**
```sql
-- Users can only view their own files (private access)
CREATE POLICY "Users can view only their own files"
ON storage.objects FOR SELECT
USING (
  auth.uid()::text = (storage.foldername(name))[2] 
  AND bucket_id = 'device-documents'
);
```

#### **Delete Policy (Dosya Silme)**
```sql
-- Users can delete their own files
CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE
USING (
  auth.uid()::text = (storage.foldername(name))[2] 
  AND bucket_id = 'device-documents'
);
```

### 3. Bucket Klasör Yapısı

Storage bucket'ta dosyalar şu şekilde organize edilir:

```
device-documents/
├── invoices/
│   ├── user-id-1/
│   │   ├── 1640995200000_abc123.pdf
│   │   └── 1640995300000_def456.jpg
│   └── user-id-2/
│       └── 1640995400000_ghi789.png
└── other-documents/
    └── ... (future use)
```

## 🔧 Teknik Detaylar

### File Upload Function
```typescript
// utils/fileUpload.ts
export const uploadInvoiceDocument = async (
  file: File,
  userId: string
): Promise<FileUploadResult> => {
  return uploadFileToStorage(file, 'device-documents', 'invoices', userId);
};
```

### File Naming Convention
- **Format**: `timestamp_randomString.extension`
- **Example**: `1640995200000_abc123def456.pdf`
- **Path**: `invoices/{userId}/{timestamp}_{random}.{ext}`

### Supported File Types
- **Images**: JPEG, JPG, PNG, WebP
- **Documents**: PDF
- **Max Size**: 10MB per file

### Security Features
- ✅ User-based folder isolation
- ✅ File type validation
- ✅ File size limits
- ✅ Automatic virus scanning (Supabase feature)
- ✅ CDN delivery for fast access

## 🚀 Usage Examples

### Upload a File
```typescript
import { uploadInvoiceDocument } from './utils/fileUpload';

const handleFileUpload = async (file: File) => {
  const result = await uploadInvoiceDocument(file, currentUser.id);
  
  if (result.success) {
    console.log('File uploaded:', result.url);
    // Save result.url to database
  } else {
    console.error('Upload failed:', result.error);
  }
};
```

### Delete a File
```typescript
import { deleteFileFromStorage } from './utils/fileUpload';

const handleFileDelete = async (fileUrl: string) => {
  const success = await deleteFileFromStorage(fileUrl, 'device-documents');
  
  if (success) {
    console.log('File deleted successfully');
  } else {
    console.error('Delete failed');
  }
};
```

## 📊 Database Integration

### Device Table Schema Update
```sql
-- Add invoice_url column to devices table
ALTER TABLE public.devices 
ADD COLUMN invoice_url TEXT;

-- Create index for faster queries
CREATE INDEX idx_devices_invoice_url 
ON public.devices(invoice_url);
```

### Migration from Base64 to Storage URLs
```sql
-- Migration script to move from invoiceDataUrl to invoice_url
-- This should be run after implementing the new storage system
UPDATE public.devices 
SET invoice_url = NULL, 
    invoiceDataUrl = NULL 
WHERE invoiceDataUrl IS NOT NULL;
```

## 🔍 Monitoring & Maintenance

### Storage Usage Monitoring
- **Dashboard**: Supabase Dashboard > Storage > Usage
- **Metrics**: File count, storage size, bandwidth usage
- **Alerts**: Set up alerts for storage limits

### Regular Maintenance Tasks
1. **Clean up orphaned files**: Files not referenced in database
2. **Monitor storage usage**: Prevent exceeding quotas  
3. **Review access logs**: Security monitoring
4. **Backup strategy**: Important documents backup

## 🐛 Troubleshooting

### Common Issues

#### **Upload Fails with "Policy violation"**
- **Cause**: RLS policies not configured correctly
- **Solution**: Check bucket policies in Supabase Dashboard

#### **Files not accessible with signed URLs**
- **Cause**: Bucket set to public instead of private
- **Solution**: Set bucket to private and use signed URLs

#### **Large files fail to upload**
- **Cause**: File size exceeds limits
- **Solution**: Check file size limits and compression

#### **CORS errors in development**
- **Cause**: CORS not configured for localhost
- **Solution**: Add localhost to allowed origins in Supabase

### Debug Commands
```typescript
// Check if bucket exists
const { data, error } = await supabase.storage.listBuckets();
console.log('Buckets:', data);

// Test file upload
const { data, error } = await supabase.storage
  .from('device-documents')
  .upload('test/test.txt', new Blob(['test']));
console.log('Test upload:', { data, error });
```

### 🧪 Policy Test Senaryoları

**Terminal veya Browser Console'da test edin:**

#### **1. Upload Policy Testi**
```javascript
// Kendi klasörünüze yükleme (✅ Başarılı olmalı)
const testUpload = await supabase.storage
  .from('device-documents')
  .upload(`invoices/${supabase.auth.user().id}/test.txt`, new Blob(['test']));
console.log('Own folder upload:', testUpload);

// Başkasının klasörüne yükleme (❌ Başarısız olmalı)
const unauthorizedUpload = await supabase.storage
  .from('device-documents')
  .upload('invoices/other-user-id/test.txt', new Blob(['test']));
console.log('Unauthorized upload:', unauthorizedUpload); // Error beklenir
```

#### **2. View Policy Testi**
```javascript
// Kendi dosyalarınızı listeleme (✅ Başarılı olmalı)
const ownFiles = await supabase.storage
  .from('device-documents')
  .list(`invoices/${supabase.auth.user().id}`);
console.log('Own files:', ownFiles);

// Başkasının dosyalarını listeleme (❌ Boş liste dönmeli)
const otherFiles = await supabase.storage
  .from('device-documents')
  .list('invoices/other-user-id');
console.log('Other user files:', otherFiles); // Boş array beklenir
```

#### **3. Delete Policy Testi**
```javascript
// Kendi dosyanızı silme (✅ Başarılı olmalı)
const deleteOwn = await supabase.storage
  .from('device-documents')
  .remove([`invoices/${supabase.auth.user().id}/test.txt`]);
console.log('Delete own file:', deleteOwn);

// Başkasının dosyasını silme (❌ Başarısız olmalı)
const deleteOther = await supabase.storage
  .from('device-documents')
  .remove(['invoices/other-user-id/test.txt']);
console.log('Delete other file:', deleteOther); // Error beklenir
```

## 📈 Performance Optimization

### CDN Configuration
- Supabase automatically provides CDN for storage
- Files are cached globally for faster access
- No additional configuration needed

### File Optimization
- Compress images before upload
- Use WebP format for better compression
- Implement progressive loading for large files

### Caching Strategy
- Browser caching: 1 hour (`Cache-Control: max-age=3600`)
- CDN caching: Automatic via Supabase
- Application caching: Store URLs in memory

---

## ✅ Checklist

Before going live, ensure:

- [ ] Storage bucket `device-documents` created
- [ ] Bucket set to **PRIVATE** access (güvenlik için)
- [ ] RLS policies configured (3 adet)
- [ ] File upload tested in development
- [ ] File deletion tested
- [ ] Database schema updated
- [ ] Error handling implemented
- [ ] File type validation working
- [ ] File size limits enforced
- [ ] Security policies reviewed

---

**Created**: January 2025  
**Last Updated**: January 2025  
**Version**: 1.0.0
