-- FIX for Storage Upload RLS Policy Error
-- Error: "new row violates row-level security policy"
-- This means storage bucket policies are missing or incorrect

-- Step 1: Check current storage policies
SELECT 
    'CURRENT STORAGE POLICIES:' as info,
    policyname,
    cmd as operation,
    qual as using_clause,
    with_check as with_check_clause
FROM pg_policies 
WHERE schemaname = 'storage' 
  AND tablename = 'objects'
ORDER BY policyname;

-- Step 2: Check if device-documents bucket exists
SELECT 
    'STORAGE BUCKETS:' as info,
    name,
    public,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets
ORDER BY created_at DESC;

-- Step 3: Drop any existing conflicting policies (if they exist)
DROP POLICY IF EXISTS "Users can upload their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view only their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;

-- Step 4: Create correct RLS policies for storage.objects table

-- Policy 1: Allow users to upload files to their own folder in device-documents bucket
CREATE POLICY "Users can upload their own files"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'device-documents' 
    AND auth.uid()::text = (string_to_array(name, '/'))[2]
);

-- Policy 2: Allow users to view only their own files in device-documents bucket
CREATE POLICY "Users can view only their own files"  
ON storage.objects FOR SELECT
USING (
    bucket_id = 'device-documents'
    AND auth.uid()::text = (string_to_array(name, '/'))[2]
);

-- Policy 3: Allow users to delete their own files in device-documents bucket
CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE  
USING (
    bucket_id = 'device-documents'
    AND auth.uid()::text = (string_to_array(name, '/'))[2]
);

-- Step 5: Verify policies are created correctly
SELECT 
    'VERIFICATION - NEW POLICIES:' as info,
    policyname,
    cmd as operation,
    CASE 
        WHEN cmd = 'INSERT' THEN 'Upload Policy ✅'
        WHEN cmd = 'SELECT' THEN 'View Policy ✅'
        WHEN cmd = 'DELETE' THEN 'Delete Policy ✅'
        ELSE 'Other Policy'
    END as policy_type
FROM pg_policies 
WHERE schemaname = 'storage' 
  AND tablename = 'objects'
  AND policyname IN (
      'Users can upload their own files',
      'Users can view only their own files', 
      'Users can delete their own files'
  )
ORDER BY policy_type;

-- Step 6: Test the policies with a sample path
-- This shows how the policy logic works
SELECT 
    'POLICY LOGIC TEST:' as info,
    'invoices/8a23de9a-020e-4baa-accc-1154ae906ff7/test.pdf' as sample_path,
    (string_to_array('invoices/8a23de9a-020e-4baa-accc-1154ae906ff7/test.pdf', '/'))[2] as extracted_user_id,
    '8a23de9a-020e-4baa-accc-1154ae906ff7' as expected_user_id,
    CASE 
        WHEN (string_to_array('invoices/8a23de9a-020e-4baa-accc-1154ae906ff7/test.pdf', '/'))[2] = '8a23de9a-020e-4baa-accc-1154ae906ff7'
        THEN 'MATCH ✅ - Upload should work'
        ELSE 'NO MATCH ❌ - Upload will fail'
    END as policy_result;

-- Step 7: If bucket doesn't exist, you need to create it via Supabase Dashboard
-- Go to: Supabase Dashboard > Storage > Create bucket
-- Name: device-documents
-- Public: NO (unchecked)
-- File size limit: 10MB
-- Allowed MIME types: image/jpeg,image/jpg,image/png,image/webp,application/pdf

SELECT 'SETUP COMPLETE! File upload should now work.' as status;
