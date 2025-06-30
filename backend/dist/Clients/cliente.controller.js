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
const create_cliente_dto_1 = require("./dto/create-cliente.dto");
let ClienteController = class ClienteController {
    supabaseService;
    clienteService;
    constructor(supabaseService, clienteService) {
        this.supabaseService = supabaseService;
        this.clienteService = clienteService;
    }
    async register(dto) {
        try {
            if (!dto.email || !dto.senha || !dto.nome) {
                throw new common_1.HttpException('Dados incompletos', common_1.HttpStatus.BAD_REQUEST);
            }
            await this.verificarEmailExistente(dto.email);
            const cliente = await this.clienteService.register(dto);
            await this.sincronizarSupabase(cliente);
            return this.formatarRespostaSucesso(cliente);
        }
        catch (error) {
            this.handleRegistrationError(error);
        }
    }
    async verificarEmailExistente(email) {
        if (await this.clienteService.emailExists(email)) {
            throw new common_1.HttpException('Email já cadastrado localmente', common_1.HttpStatus.CONFLICT);
        }
        const supabase = this.supabaseService.getClient();
        const { data: existingUser, error } = await supabase
            .from('users')
            .select('email')
            .eq('email', email)
            .maybeSingle();
        if (error) {
            console.error('Erro ao verificar email no Supabase:', error);
            throw new common_1.HttpException('Erro ao validar e-mail', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if (existingUser) {
            throw new common_1.HttpException('Email já existe no Supabase', common_1.HttpStatus.CONFLICT);
        }
    }
    async sincronizarSupabase(cliente) {
        try {
            const supabase = this.supabaseService.getClient();
            const { error } = await supabase
                .from('users')
                .insert([{
                    nome: cliente.nome,
                    email: cliente.email,
                    created_at: new Date().toISOString()
                }]);
            if (error) {
                console.error('Erro na sincronização:', error);
                throw new common_1.HttpException('Registro local efetuado, mas falha na sincronização', common_1.HttpStatus.ACCEPTED);
            }
        }
        catch (syncError) {
            console.error('Falha crítica na sincronização:', syncError);
        }
    }
    formatarRespostaSucesso(cliente) {
        return {
            success: true,
            message: 'Registro concluído com sucesso',
            data: {
                id: cliente.id,
                nome: cliente.nome,
                email: cliente.email,
            },
            meta: {
                sync: 'completed',
                timestamp: new Date().toISOString()
            }
        };
    }
    handleRegistrationError(error) {
        if (error instanceof common_1.HttpException) {
            throw error;
        }
        console.error('Erro não tratado no registro:', error);
        throw new common_1.HttpException({
            status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Ocorreu um erro durante o registro',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
};
exports.ClienteController = ClienteController;
__decorate([
    (0, common_1.Post)('registrar'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cliente_dto_1.CreateClienteDto]),
    __metadata("design:returntype", Promise)
], ClienteController.prototype, "register", null);
exports.ClienteController = ClienteController = __decorate([
    (0, common_1.Controller)('clientes'),
    __metadata("design:paramtypes", [services_1.SupabaseService,
        cliente_service_1.ClienteService])
], ClienteController);
//# sourceMappingURL=cliente.controller.js.map