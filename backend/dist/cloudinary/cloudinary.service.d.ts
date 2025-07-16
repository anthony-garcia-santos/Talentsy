import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
export declare class CloudinaryService {
    private readonly cloudinaryClient;
    constructor(cloudinaryClient: typeof cloudinary);
    uploadImage(file: Express.Multer.File, folder: string): Promise<UploadApiResponse>;
    deleteImage(publicId: string): Promise<void>;
}
