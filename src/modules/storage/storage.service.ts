import {
  Injectable,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import {
  UploadApiResponse,
  UploadApiErrorResponse,
  ResourceApiResponse,
} from 'cloudinary';
import { ImageResource, ListImagesResult } from './intefaces/storage.interface';

export interface CloudinaryImageResource {
  publicId: string;
  url: string;
  format: string;
  bytes: number;
  createdAt: Date;
}

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);

  constructor(private configService: ConfigService) {
    this.initializeCloudinary();
  }

  private initializeCloudinary(): void {
    try {
      cloudinary.config({
        cloud_name: this.configService.getOrThrow<string>(
          'CLOUDINARY_CLOUD_NAME',
        ),
        api_key: this.configService.getOrThrow<string>('CLOUDINARY_API_KEY'),
        api_secret: this.configService.getOrThrow<string>(
          'CLOUDINARY_API_SECRET',
        ),
      });
      this.logger.log('Cloudinary configuration initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Cloudinary', error);
      throw new HttpException(
        'Cloudinary configuration failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async uploadImage(
    file: Express.Multer.File,
    options: {
      folder?: string;
      overwriteOptions?: Record<string, any>;
    } = {},
  ): Promise<CloudinaryImageResource> {
    try {
      const { folder = 'products-images', overwriteOptions = {} } = options;

      // Generate a default public ID if not provided
      const publicId = this.generateDefaultPublicId(file);

      const uploadOptions = {
        public_id: publicId, // Add the public ID to upload options
        folder,
        transformation: [
          { width: 1200, crop: 'limit' },
          { quality: 'auto' },
          { format: 'auto' },
        ],
        overwrite: true, // Allow overwriting if same public ID is used
        ...overwriteOptions,
      };

      const result = (await cloudinary.uploader.upload(
        file.path,
        uploadOptions,
      )) as UploadApiResponse;

      return {
        publicId: result.public_id,
        url: result.secure_url,
        format: result.format,
        bytes: result.bytes,
        createdAt: new Date(result.created_at),
      };
    } catch (error) {
      this.logger.error('Image upload failed', error);
      throw new HttpException(
        'Image upload failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private generateDefaultPublicId(file: Express.Multer.File): string {
    const timestamp = Date.now();
    const sanitizedFileName = file.originalname
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9]/g, '_')
      .toLowerCase();
    return `${timestamp}_${sanitizedFileName}`;
  }

  async listImages(
    options: {
      maxResults?: number;
      folder?: string;
    } = {},
  ): Promise<CloudinaryImageResource[]> {
    try {
      const { maxResults = 100, folder = 'products-images' } = options;

      const result = await cloudinary.api.resources({
        type: 'upload',
        prefix: folder,
        max_results: maxResults,
      });

      return result.resources.map((resource: ImageResource) => ({
        publicId: resource.public_id,
        url: resource.secure_url,
        format: resource.format,
        bytes: resource.bytes,
        createdAt: new Date(resource.created_at),
      }));
    } catch (error) {
      throw new NotFoundException({
        message: `Failed to list images, ${error.error.message}`,
      });
    }
  }

  async getImage(publicId: string): Promise<CloudinaryImageResource> {
    try {
      const result = await cloudinary.api.resource(publicId);
      return {
        publicId: result.public_id,
        url: result.secure_url,
        format: result.format,
        bytes: result.bytes,
        createdAt: new Date(result.created_at),
      };
    } catch (error) {
      this.logger.error(`Image not found: ${publicId}`, error);
      throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
    }
  }

  async deleteImage(publicId: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);

      if (result.result === 'ok') {
        this.logger.log(`Image deleted successfully: ${publicId}`);
        return true;
      }

      this.logger.warn(`Image deletion unexpected result: ${publicId}`, result);
      return false;
    } catch (error) {
      this.logger.error(`Failed to delete image: ${publicId}`, error);
      throw new HttpException(
        'Failed to delete image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteMultipleImages(publicIds: string[]): Promise<boolean[]> {
    try {
      const deletionResults = await Promise.all(
        publicIds.map((id) => this.deleteImage(id)),
      );
      return deletionResults;
    } catch (error) {
      this.logger.error('Failed to delete multiple images', error);
      throw new HttpException(
        'Failed to delete multiple images',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
