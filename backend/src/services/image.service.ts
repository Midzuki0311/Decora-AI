import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config';
import logger from '../utils/logger';

export interface ProcessedImage {
  path: string;
  filename: string;
  width: number;
  height: number;
  format: string;
}

export async function processUploadedImage(filePath: string): Promise<ProcessedImage> {
  const metadata = await sharp(filePath).metadata();
  const maxDimension = 2048;

  let pipeline = sharp(filePath);

  // Resize if too large while maintaining aspect ratio
  if ((metadata.width && metadata.width > maxDimension) || (metadata.height && metadata.height > maxDimension)) {
    pipeline = pipeline.resize(maxDimension, maxDimension, {
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  // Convert to JPEG for consistency
  const outputFilename = `processed_${uuidv4()}.jpg`;
  const outputPath = path.join(config.storage.uploadDir, outputFilename);

  await pipeline
    .jpeg({ quality: 90, progressive: true })
    .toFile(outputPath);

  const processedMeta = await sharp(outputPath).metadata();

  logger.info(`Image processed: ${outputFilename} (${processedMeta.width}x${processedMeta.height})`);

  return {
    path: outputPath,
    filename: outputFilename,
    width: processedMeta.width || 0,
    height: processedMeta.height || 0,
    format: 'jpeg',
  };
}

export async function createThumbnail(filePath: string, size = 300): Promise<string> {
  const outputFilename = `thumb_${uuidv4()}.jpg`;
  const outputPath = path.join(config.storage.uploadDir, outputFilename);

  await sharp(filePath)
    .resize(size, size, { fit: 'cover' })
    .jpeg({ quality: 80 })
    .toFile(outputPath);

  return outputPath;
}

export function deleteFile(filePath: string): boolean {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      logger.info(`File deleted: ${filePath}`);
      return true;
    }
    return false;
  } catch (error: any) {
    logger.error(`Failed to delete file: ${error.message}`);
    return false;
  }
}

export function getImageUrl(filename: string): string {
  return `/uploads/${filename}`;
}

export function ensureUploadDir(): void {
  const dir = config.storage.uploadDir;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    logger.info(`Upload directory created: ${dir}`);
  }
}
