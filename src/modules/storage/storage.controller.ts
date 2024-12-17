import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import { StorageService } from './storage.service';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
});

@Controller('images')
export class StorageController {
  constructor(private readonly imagesService: StorageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage }))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    console.log("🚀 ~ StorageController ~ uploadImage ~ file:", file)
    return await this.imagesService.uploadImage(file);
  }

  @Get()
  async listImages() {
    const images = await this.imagesService.listImages();
    return { images };
  }

  @Get(':publicId')
  async getImage(@Param('publicId') publicId: string) {
    const imageUrl = await this.imagesService.getImage(publicId);
    return { imageUrl };
  }

  @Delete(':publicId')
  async deleteImage(@Param('publicId') publicId: string) {
    await this.imagesService.deleteImage(publicId);
    return { message: 'Image deleted successfully' };
  }
}
