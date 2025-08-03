# Profile Images Storage Setup Guide

## Step 1: Create Storage Bucket in Supabase

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the sidebar
3. Click **"Create bucket"**
4. Enter bucket name: `profile-images`
5. Set as **Public** (enable public access)
6. Click **Create bucket**

### Option B: Using SQL (Alternative)

Run this SQL in your Supabase SQL Editor:

```sql
-- Create a new storage bucket for profile images
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true);

-- Create policies for the profile-images bucket
CREATE POLICY "Public can view profile images" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-images');

CREATE POLICY "Authenticated users can upload profile images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'profile-images');

CREATE POLICY "Authenticated users can update profile images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'profile-images');

CREATE POLICY "Authenticated users can delete profile images" ON storage.objects
  FOR DELETE USING (bucket_id = 'profile-images');
```

## Step 2: Verify Setup

After creating the bucket, test the upload functionality:

1. Go to `/admin/about`
2. Try uploading a profile image
3. Check that it appears in your Supabase Storage under `profile-images/about/`
4. Verify the image displays on `/about` page

## File Structure

Profile images will be stored with this structure:

```
profile-images/
└── about/
    ├── profile-1704240000000-abc123.jpg
    ├── profile-1704240001000-def456.png
    └── ...
```

## Updated Components

- ✅ **Upload API**: Now uses `profile-images` bucket
- ✅ **Storage Helper**: New `getProfileImageUrl()` function
- ✅ **Frontend**: Uses dedicated profile image URL helper
- ✅ **Admin Form**: ImagePicker component for easy uploads

## Troubleshooting

### If upload fails:

1. Check that the `profile-images` bucket exists in Supabase Storage
2. Verify the bucket is set to **public**
3. Check browser console for specific error messages
4. Ensure your Supabase environment variables are correct

### If images don't display:

1. Check that the bucket policies allow public read access
2. Verify the image path is correct in the database
3. Check browser network tab for failed image requests

## Security Notes

- Images are stored in a public bucket for easy access
- File names are randomized to prevent conflicts
- File size limited to 5MB
- Only image types allowed: JPG, PNG, WebP
- Files are organized in `about/` subfolder for easy management
