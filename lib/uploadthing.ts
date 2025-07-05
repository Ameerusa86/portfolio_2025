import { generateReactHelpers } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";

const { uploadFiles } = generateReactHelpers<OurFileRouter>();

export async function uploadImageFile(file: File): Promise<string> {
  try {
    const response = await uploadFiles("imageUploader", {
      files: [file],
    });

    if (!response || response.length === 0) {
      throw new Error("No file returned from UploadThing.");
    }

    return response[0].url;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
}
