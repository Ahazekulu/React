import { supabase } from '../supabase';

export { supabase };

/**
 * Universal Media Upload Helper
 * @param {File} file - The file object to upload
 * @param {string} bucket - The bucket name (e.g. 'products', 'posts', 'orgs')
 * @param {string} userId - Current user ID for folder organization
 */
export const uploadMedia = async (file, folder, userId) => {
    if (!file) return null;

    try {
        const bucket = 'ahaze-media'; // Consolidated bucket for all media
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).slice(2)}_${Date.now()}.${fileExt}`;
        const filePath = `${folder}/${userId}/${fileName}`; // Folder-based structure

        console.log(`[Storage Debug] Uploading to bucket: "${bucket}", path: "${filePath}"`);

        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, file);

        if (uploadError) {
            console.error(`[Storage Error] ${uploadError.message}`, uploadError);
            throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return publicUrl;
    } catch (err) {
        console.error(`[Storage Failure] Path "${folder}/${userId}":`, err);
        throw err;
    }
};
