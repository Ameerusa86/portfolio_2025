import { supabase } from "./supabase";

/**
 * Check if a URL is an external URL (starts with http:// or https://)
 */
function isExternalUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

/**
 * Get the public URL for an image stored in Supabase storage
 * @param bucket - The storage bucket name
 * @param path - The file path in the bucket
 * @returns The public URL or null if no path provided
 */
export function getSupabaseImageUrl(
  bucket: string,
  path: string | null | undefined
): string | null {
  if (!path) return null;

  // If it's already an external URL, return it as-is
  if (isExternalUrl(path)) {
    return path;
  }

  // Otherwise, get the Supabase storage URL
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Get the public URL for a project image
 * @param imagePath - The image path/key from the database
 * @returns The public URL or null
 */
export function getProjectImageUrl(
  imagePath: string | null | undefined
): string | null {
  if (!imagePath) return null;

  // If it's already an external URL, return it as-is
  if (isExternalUrl(imagePath)) {
    return imagePath;
  }

  return getSupabaseImageUrl("project-images", imagePath);
}

/**
 * Get the public URL for a blog image
 * @param imagePath - The image path/key from the database
 * @returns The public URL or null
 */
export function getBlogImageUrl(
  imagePath: string | null | undefined
): string | null {
  if (!imagePath) return null;

  // If it's already an external URL, return it as-is
  if (isExternalUrl(imagePath)) {
    return imagePath;
  }

  return getSupabaseImageUrl("blog-images", imagePath);
}

/**
 * Get the public URL for a profile image
 * @param imagePath - The image path/key from the database
 * @returns The public URL or null
 */
export function getProfileImageUrl(
  imagePath: string | null | undefined
): string | null {
  if (!imagePath) return null;

  // If it's already an external URL, return it as-is
  if (isExternalUrl(imagePath)) {
    return imagePath;
  }

  return getSupabaseImageUrl("profile-images", imagePath);
}
