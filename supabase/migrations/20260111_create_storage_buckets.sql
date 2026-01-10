-- Create storage buckets for product and vendor images
-- Run this in Supabase Dashboard > Storage or SQL Editor

-- Create products bucket for inventory item images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'products',
  'products',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Create vendors bucket for vendor logos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'vendors',
  'vendors',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- RLS policies for products bucket
-- Anyone can view product images (public)
CREATE POLICY "Public read access for products"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

-- Authenticated users can upload to products bucket
CREATE POLICY "Authenticated users can upload products"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'products');

-- Users can update their own uploads
CREATE POLICY "Users can update own products"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'products' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Users can delete their own uploads
CREATE POLICY "Users can delete own products"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'products' AND auth.uid()::text = (storage.foldername(name))[1]);

-- RLS policies for vendors bucket
-- Anyone can view vendor logos (public)
CREATE POLICY "Public read access for vendors"
ON storage.objects FOR SELECT
USING (bucket_id = 'vendors');

-- Authenticated users can upload to vendors bucket
CREATE POLICY "Authenticated users can upload vendors"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'vendors');

-- Users can update their own uploads
CREATE POLICY "Users can update own vendors"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'vendors' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Users can delete their own uploads
CREATE POLICY "Users can delete own vendors"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'vendors' AND auth.uid()::text = (storage.foldername(name))[1]);
