"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
const common_1 = require("@nestjs/common");
let CloudinaryService = class CloudinaryService {
    cloudinaryClient;
    constructor(cloudinaryClient) {
        this.cloudinaryClient = cloudinaryClient;
    }
    async uploadImage(file, folder) {
        return new Promise((resolve, reject) => {
            const uploadStream = this.cloudinaryClient.uploader.upload_stream({
                folder,
                resource_type: 'auto'
            }, (error, result) => {
                if (error)
                    return reject(error);
                resolve(result);
            });
            uploadStream.end(file.buffer);
        });
    }
    async deleteImage(publicId) {
        try {
            await this.cloudinaryClient.uploader.destroy(publicId);
        }
        catch (error) {
            console.error('Erro ao deletar imagem:', error);
            throw new Error('Falha ao deletar imagem do Cloudinary');
        }
    }
};
exports.CloudinaryService = CloudinaryService;
exports.CloudinaryService = CloudinaryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('CLOUDINARY')),
    __metadata("design:paramtypes", [Object])
], CloudinaryService);
//# sourceMappingURL=cloudinary.service.js.map