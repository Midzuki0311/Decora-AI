import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { config } from '../config';
import logger from '../utils/logger';

// ─── Cloudinary конфигурация ──────────────
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
  secure: true,
});

/**
 * Локал файлни Cloudinary-га юклаш
 */
export async function uploadToCloudinary(
  filePath: string,
  folder = 'ai-interior/originals'
): Promise<{ url: string; publicId: string }> {
  try {
    const result: UploadApiResponse = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'image',
      transformation: [
        { width: 2048, height: 2048, crop: 'limit' }, // Макс ўлчам
        { quality: 'auto:good' },
        { fetch_format: 'auto' },
      ],
    });

    logger.info(`☁️ Uploaded to Cloudinary: ${result.public_id} (${result.bytes} bytes)`);

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error: any) {
    logger.error(`Cloudinary upload failed: ${error.message}`);
    throw new Error(`Failed to upload image to cloud: ${error.message}`);
  }
}

/**
 * URL орқали расмни Cloudinary-га юклаш (AI натижа расмлар учун)
 */
export async function uploadUrlToCloudinary(
  imageUrl: string,
  folder = 'ai-interior/generated'
): Promise<{ url: string; publicId: string }> {
  try {
    const result: UploadApiResponse = await cloudinary.uploader.upload(imageUrl, {
      folder,
      resource_type: 'image',
    });

    logger.info(`☁️ URL uploaded to Cloudinary: ${result.public_id}`);

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error: any) {
    logger.error(`Cloudinary URL upload failed: ${error.message}`);
    throw new Error(`Failed to upload generated image to cloud: ${error.message}`);
  }
}

/**
 * Cloudinary-дан расм ўчириш
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    const success = result.result === 'ok';
    if (success) {
      logger.info(`☁️ Deleted from Cloudinary: ${publicId}`);
    } else {
      logger.warn(`Cloudinary delete returned: ${result.result} for ${publicId}`);
    }
    return success;
  } catch (error: any) {
    logger.error(`Cloudinary delete failed: ${error.message}`);
    return false;
  }
}

/**
 * Cloudinary URL-дан оптимизация қилинган версиясини олиш
 */
export function getOptimizedUrl(publicId: string, options?: {
  width?: number;
  height?: number;
  quality?: string;
}): string {
  return cloudinary.url(publicId, {
    secure: true,
    transformation: [
      {
        width: options?.width || 1024,
        height: options?.height || 1024,
        crop: 'limit',
        quality: options?.quality || 'auto:good',
        fetch_format: 'auto',
      },
    ],
  });
}

/**
 * Thumbnail URL олиш
 */
export function getThumbnailUrl(publicId: string, size = 300): string {
  return cloudinary.url(publicId, {
    secure: true,
    transformation: [
      { width: size, height: size, crop: 'fill', gravity: 'auto' },
      { quality: 'auto:low', fetch_format: 'auto' },
    ],
  });
}

export default cloudinary;
