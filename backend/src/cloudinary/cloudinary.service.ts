// src/cloudinary/cloudinary.service.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private config: ConfigService) {
    cloudinary.config({
      cloud_name: this.config.get('CLOUDINARY_CLOUD_NAME'),
      api_key:    this.config.get('CLOUDINARY_API_KEY'),
      api_secret: this.config.get('CLOUDINARY_API_SECRET'),
      secure:     true,
    });
  }

  async uploadImage(file: Express.Multer.File, folder: string): Promise<UploadApiResponse> {
    const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

    try {
      const result = await cloudinary.uploader.upload(dataUri, {
        folder,
        resource_type: 'auto',
      });
      return result;
    } catch (err) {
      console.error('Erro no upload Cloudinary:', err);
      throw err;
    }
  }
}
