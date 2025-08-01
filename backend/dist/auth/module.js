"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const jwt_service_1 = require("./jwt.service");
const auth_controller_1 = require("./auth.controller");
const config_1 = require("@nestjs/config");
const cloudinary_module_1 = require("../cloudinary/cloudinary.module");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: '7d' },
            }),
            cloudinary_module_1.CloudinaryModule,
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [jwt_service_1.JwtTokenService],
        exports: [jwt_service_1.JwtTokenService],
    })
], AuthModule);
//# sourceMappingURL=module.js.map