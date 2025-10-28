-- ========================================
-- RLS Policies for device-pics Storage
-- ========================================
-- This script creates Row Level Security policies for the device-pics storage bucket
-- Users can only upload to their own folder and view their own photos

-- Enable RLS on storage.objects
-- Note: This is already enabled by default in Supabase, but we're documenting it here

-- ========================================
-- Policy 1: Users can upload photos to their own folder
-- ========================================
CREATE POLICY "Users can upload device photos to their own folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'device-pics' AND
  (storage.foldername(name))[1] = (auth.uid()::text)
);

-- ========================================
-- Policy 2: Users can view their own uploaded photos
-- ========================================
CREATE POLICY "Users can view their own device photos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'device-pics' AND
  (storage.foldername(name))[1] = (auth.uid()::text)
);

-- ========================================
-- Policy 3: Users can delete their own photos
-- ========================================
CREATE POLICY "Users can delete their own device photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'device-pics' AND
  (storage.foldername(name))[1] = (auth.uid()::text)
);

-- ========================================
-- Policy 4: Users can update their own photos
-- ========================================
CREATE POLICY "Users can update their own device photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'device-pics' AND
  (storage.foldername(name))[1] = (auth.uid()::text)
)
WITH CHECK (
  bucket_id = 'device-pics' AND
  (storage.foldername(name))[1] = (auth.uid()::text)
);

-- ========================================
-- Note: To apply these policies in Supabase Dashboard:
-- ========================================
-- 1. Go to Storage → device-pics bucket
-- 2. Click on "Policies" tab
-- 3. Enable "Enable Row Level Security" if not already enabled
-- 4. Run the SQL commands above in the SQL Editor
-- ========================================

-- ========================================
-- Verification Queries (for testing)
-- ========================================
-- Check if policies are active:
-- SELECT * FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects';

-- Test policy with a specific user:
-- SELECT * FROM storage.objects 
-- WHERE bucket_id = 'device-pics' 
-- AND (storage.foldername(name))[1] = 'USER_UUID_HERE';

-- ========================================
-- Alternative: Use Supabase Dashboard
-- ========================================
-- Instead of running SQL, you can also create these policies in the Supabase Dashboard:
-- 
-- 1. Navigate to Storage → device-pics
-- 2. Click "Policies" tab
-- 3. Click "New Policy"
-- 4. Create each policy with the following settings:
--    - Policy name: "Users can upload device photos to their own folder"
--    - Allowed operations: INSERT
--    - Policy using: bucket_id = 'device-pics' AND (storage.foldername(name))[1] = (auth.uid()::text)
--    
-- Repeat for SELECT, UPDATE, and DELETE operations

