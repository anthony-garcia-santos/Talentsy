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
const services_1 = require("../supabase/services");
const cliente_service_1 = require("./cliente.service");
const cliente_dto_1 = require("./dto/cliente.dto");
const jwt_service_1 = require("../auth/jwt.service");
let ClienteController = class ClienteController {
    supabaseService;
    clienteService;
    jwtService;
    constructor(supabaseService, clienteService, jwtService) {
        this.supabaseService = supabaseService;
        this.clienteService = clienteService;
        this.jwtService = jwtService;
    }
    async registrar(dto) {
        try {
            this.validarDados(dto);
            await this.verificarEmailDuplicado(dto.email);
            const cliente = await this.clienteService.register(dto);
            await this.sincronizarComSupabase(cliente);
            return this.respostaDeSucesso(cliente);
        }
        catch (error) {
            this.lidarComErro(error);
        }
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
        const clientes = await this.clienteService.listarTodos();
        return {
            success: true,
            total: clientes.length,
            data: clientes,
        };
    }
    async buscarPorId(id) {
        try {
            const cliente = await this.clienteService.buscarPorId(Number(id));
            return {
                success: true,
                data: {
                    id: cliente.id,
                    nome: cliente.nome,
                    email: cliente.email
                }
            };
        }
        catch (error) {
            throw new common_1.HttpException('Cliente não encontrado', common_1.HttpStatus.NOT_FOUND);
        }
    }
    validarDados(dto) {
        const camposVazios = !dto.nome || !dto.email || !dto.senha;
        if (camposVazios) {
            throw new common_1.HttpException('Dados incompletos', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async verificarEmailDuplicado(email) {
        const emailLocalExiste = await this.clienteService.emailExists(email);
        if (emailLocalExiste) {
            throw new common_1.HttpException('Email já cadastrado localmente', common_1.HttpStatus.CONFLICT);
        }
        const { data, error } = await this.supabaseService.getClient()
            .from('users')
            .select('email')
            .eq('email', email)
            .maybeSingle();
        if (error) {
            console.error('Erro ao verificar email no Supabase:', error);
            throw new common_1.HttpException('Erro ao validar e-mail no Supabase', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if (data) {
            throw new common_1.HttpException('Email já cadastrado no Supabase', common_1.HttpStatus.CONFLICT);
        }
    }
    async sincronizarComSupabase(cliente) {
        const { error } = await this.supabaseService.getClient()
            .from('users')
            .insert([{
                nome: cliente.nome,
                email: cliente.email,
                created_at: new Date().toISOString()
            }]);
        if (error) {
            console.error('Erro na sincronização com Supabase:', error);
            throw new common_1.HttpException('Registro local efetuado, mas falha na sincronização com Supabase', common_1.HttpStatus.ACCEPTED);
        }
    }
    respostaDeSucesso(cliente) {
        return {
            success: true,
            message: 'Registro concluído com sucesso',
            data: {
                id: cliente.id,
                nome: cliente.nome,
                email: cliente.email
            },
            meta: {
                sync: 'completed',
                timestamp: new Date().toISOString()
            }
        };
    }
    lidarComErro(error) {
        if (error instanceof common_1.HttpException)
            throw error;
        console.error('Erro inesperado no registro:', error);
        throw new common_1.HttpException({
            status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Erro inesperado ao registrar usuário',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
};
exports.ClienteController = ClienteController;
__decorate([
    (0, common_1.Post)('registrar'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cliente_dto_1.CreateClienteDto]),
    __metadata("design:returntype", Promise)
], ClienteController.prototype, "registrar", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
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
    __metadata("design:paramtypes", [services_1.SupabaseService,
        cliente_service_1.ClienteService,
        jwt_service_1.JwtTokenService])
], ClienteController);
//# sourceMappingURL=cliente.controller.js.map