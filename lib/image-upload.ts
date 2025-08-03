import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export class ImageUploadService {
  // Upload profile image via API endpoint
  static async uploadProfileImage(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload/profile", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload image");
      }

      const data = await response.json();
      return data.filePath;
    } catch (error) {
      console.error("Profile image upload error:", error);
      throw error;
    }
  }

  // Upload image to Supabase Storage
  static async uploadBlogImage(file: File): Promise<string> {
    try {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        throw new Error(
          "Invalid file type. Please upload JPG, PNG, WebP, or GIF images."
        );
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error(
          "File size too large. Please upload images smaller than 5MB."
        );
      }

      // Generate unique filename
      const fileExt = file.name.split(".").pop()?.toLowerCase();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;
      const filePath = `blog-images/${fileName}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("blog-images").getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error("Image upload error:", error);
      throw error;
    }
  }

  // Delete image from Supabase Storage
  static async deleteBlogImage(imageUrl: string): Promise<void> {
    try {
      // Extract file path from URL
      const url = new URL(imageUrl);
      const pathParts = url.pathname.split("/");
      const filePath = pathParts.slice(-2).join("/"); // Get 'blog-images/filename.ext'

      const { error } = await supabase.storage
        .from("blog-images")
        .remove([filePath]);

      if (error) {
        console.error("Delete error:", error);
        throw new Error(`Failed to delete image: ${error.message}`);
      }
    } catch (error) {
      console.error("Image deletion error:", error);
      // Don't throw here - deletion failure shouldn't block other operations
    }
  }

  // Get optimized image URL with transformations
  static getOptimizedImageUrl(
    imageUrl: string,
    options?: {
      width?: number;
      height?: number;
      quality?: number;
    }
  ): string {
    if (!options) return imageUrl;

    try {
      const url = new URL(imageUrl);
      const searchParams = new URLSearchParams();

      if (options.width) searchParams.set("width", options.width.toString());
      if (options.height) searchParams.set("height", options.height.toString());
      if (options.quality)
        searchParams.set("quality", options.quality.toString());

      if (searchParams.toString()) {
        url.search = searchParams.toString();
      }

      return url.toString();
    } catch {
      return imageUrl;
    }
  }
}
