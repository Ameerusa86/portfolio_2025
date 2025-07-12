import { supabase } from "@/lib/supabase";

export async function uploadImageFile(
  file: File
): Promise<{ url: string; key: string }> {
  const fileExt = file.name.split(".").pop();
  const filePath = `projects/${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 8)}.${fileExt}`;
  const bucket = "project-images";
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });
  if (error) throw error;
  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);
  return { url: publicUrlData.publicUrl, key: filePath };
}
