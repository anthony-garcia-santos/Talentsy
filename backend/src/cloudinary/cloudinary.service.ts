// src/cloudinary/cloudinary.service.ts


import { Injectable, Inject } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject('CLOUDINARY') private readonly cloudinaryClient: typeof cloudinary,
  ) {}

  async uploadImage(
    file: Express.Multer.File, 
    folder: string
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinaryClient.uploader.upload_stream(
        { 
          folder,
          resource_type: 'auto'
        },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      uploadStream.end(file.buffer);
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      await this.cloudinaryClient.uploader.destroy(publicId);
    } catch (error) {
      console.error('Erro ao deletar imagem:', error);
      throw new Error('Falha ao deletar imagem do Cloudinary');
    }
  }
}
