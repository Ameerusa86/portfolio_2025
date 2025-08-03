-- Create a new storage bucket for profile images
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true);

-- Create policies for the profile-images bucket
-- Allow public read access
CREATE POLICY "Public can view profile images" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-images');

-- Allow authenticated users to upload profile images
CREATE POLICY "Authenticated users can upload profile images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'profile-images');

-- Allow authenticated users to update their profile images
CREATE POLICY "Authenticated users can update profile images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'profile-images');

-- Allow authenticated users to delete their profile images
CREATE POLICY "Authenticated users can delete profile images" ON storage.objects
  FOR DELETE USING (bucket_id = 'profile-images');
