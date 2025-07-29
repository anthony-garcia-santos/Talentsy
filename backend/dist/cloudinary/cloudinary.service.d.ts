import { ConfigService } from '@nestjs/config';
import { UploadApiResponse } from 'cloudinary';
export declare class CloudinaryService {
    private config;
    constructor(config: ConfigService);
    uploadImage(file: Express.Multer.File, folder: string): Promise<UploadApiResponse>;
}
