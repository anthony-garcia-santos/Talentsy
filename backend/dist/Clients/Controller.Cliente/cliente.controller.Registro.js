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
exports.ClienteController = void 0;
const common_1 = require("@nestjs/common");
const cliente_service_1 = require("../cliente.service");
const cliente_dto_login_1 = require("../../dto/Cliente.DTO/cliente.dto.login");
const jwt_service_1 = require("../../auth/jwt.service");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const platform_express_1 = require("@nestjs/platform-express");
const cloudinary_service_1 = require("../../cloudinary/cloudinary.service");
let ClienteController = class ClienteController {
    clienteService;
    jwtService;
    cloudinaryService;
    constructor(clienteService, jwtService, cloudinaryService) {
        this.clienteService = clienteService;
        this.jwtService = jwtService;
        this.cloudinaryService = cloudinaryService;
    }
    async uploadFotoPerfil(id, file) {
        if (!file) {
            throw new common_1.BadRequestException('Nenhum arquivo enviado');
        }
        const result = await this.cloudinaryService.uploadImage(file, 'perfis');
        const clienteAtual = await this.clienteService.buscarPorId(id);
        await this.clienteService.editarPerfil(id, {
            foto: result.secure_url,
            sobre: clienteAtual.sobre || '',
            habilidades: clienteAtual.habilidades || '',
            projetosRecentes: clienteAtual.projetosRecentes || '[]',
            cargo: clienteAtual.cargo || ''
        });
        return {
            success: true,
            url: result.secure_url,
            public_id: result.public_id
        };
    }
    async editarPerfil(id, dto, req) {
        if (req.user.sub !== id) {
            throw new common_1.HttpException('Não autorizado a editar este perfil', common_1.HttpStatus.FORBIDDEN);
        }
        const cliente = await this.clienteService.editarPerfil(id, dto);
        return {
            success: true,
            message: 'Perfil atualizado com sucesso!',
            data: {
                id: cliente.id,
                foto: cliente.foto,
                sobre: cliente.sobre,
                habilidades: cliente.habilidades,
                projetosRecentes: cliente.projetosRecentes,
            }
        };
    }
    async login(body, res) {
        const cliente = await this.clienteService.validarLogin(body.email, body.senha);
        if (!cliente) {
            throw new common_1.HttpException('Credenciais inválidas', common_1.HttpStatus.UNAUTHORIZED);
        }
        const token = this.jwtService.gerarToken({ sub: cliente.id });
        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return { success: true, message: 'Login efetuado', clienteId: cliente.id };
    }
    async listarClientes() {
        try {
            const clientes = await this.clienteService.listarTodos();
            if (!clientes.length) {
                return { success: true, message: 'Nenhum cliente encontrado', data: [], total: 0 };
            }
            return {
                success: true,
                total: clientes.length,
                data: clientes.map(c => ({
                    id: c.id,
                    nome: c.nome,
                    email: c.email,
                    cargo: c.cargo,
                    foto: c.foto
                }))
            };
        }
        catch (error) {
            throw new common_1.HttpException('Erro ao listar clientes', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async buscarPorId(id) {
        const cliente = await this.clienteService.buscarPorId(id);
        return {
            success: true,
            data: {
                id: cliente.id,
                nome: cliente.nome,
                email: cliente.email,
                foto: cliente.foto || null,
                sobre: cliente.sobre || null,
                habilidades: cliente.habilidades || null,
                projetos_recentes: cliente.projetosRecentes || null,
                cargo: cliente.cargo || null
            }
        };
    }
};
exports.ClienteController = ClienteController;
__decorate([
    (0, common_1.Post)(':id/foto'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('foto')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClienteController.prototype, "uploadFotoPerfil", null);
__decorate([
    (0, common_1.Patch)(':id/editar-perfil'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ClienteController.prototype, "editarPerfil", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cliente_dto_login_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], ClienteController.prototype, "login", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClienteController.prototype, "listarClientes", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClienteController.prototype, "buscarPorId", null);
exports.ClienteController = ClienteController = __decorate([
    (0, common_1.Controller)('clientes'),
    __metadata("design:paramtypes", [cliente_service_1.ClienteService,
        jwt_service_1.JwtTokenService,
        cloudinary_service_1.CloudinaryService])
], ClienteController);
//# sourceMappingURL=cliente.controller.Registro.js.map