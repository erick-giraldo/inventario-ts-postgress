import { v2 as cloudinary } from 'cloudinary';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CloudinaryProvider {
  constructor() {
    const config = {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    }
    console.log("🚀 ~ CloudinaryProvider ~ constructor ~ config:", config)
    cloudinary.config(config);
}

  uploadImage(file: Express.Multer.File, folder = 'products') {
    console.log("🚀 ~ CloudinaryProvider ~ uploadImage ~ file:", file)
    return cloudinary.uploader.upload(file.path, {
      folder,
    });
  }
}
