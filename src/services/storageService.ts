// /src/services/storageService.ts
import { supabase } from "../supabaseClient";

/**
 * Uploads a file to the 'avatars' storage bucket.
 * @param userId The ID of the user, used to create a unique folder path.
 * @param file The file to upload.
 * @returns The public URL of the uploaded file.
 */
export const uploadAvatar = async (
  userId: string,
  file: File
): Promise<string> => {
  // Create a unique file path for each user and upload
  const filePath = `${userId}/${Date.now()}_${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file);

  if (uploadError) {
    console.error("Error uploading avatar:", uploadError);
    throw uploadError;
  }

  // Get the public URL of the file we just uploaded
  const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

  return data.publicUrl;
};
