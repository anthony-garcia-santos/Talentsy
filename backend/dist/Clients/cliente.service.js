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
exports.ClienteService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cliente_entity_1 = require("../ModelBD/cliente.entity");
const bcrypt = require("bcrypt");
const class_validator_1 = require("class-validator");
let ClienteService = class ClienteService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async validateUUID(id) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            throw new common_1.BadRequestException('ID inválido - formato UUID requerido');
        }
    }
    async emailExists(email) {
        try {
            const user = await this.repo.findOne({ where: { email } });
            return !!user;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Erro ao verificar e-mail');
        }
    }
    async register(dto) {
        const errors = await (0, class_validator_1.validate)(dto);
        if (errors.length > 0) {
            throw new common_1.BadRequestException(errors);
        }
        if (await this.emailExists(dto.email)) {
            throw new common_1.BadRequestException('E-mail já está em uso');
        }
        try {
            const senhaHash = await bcrypt.hash(dto.senha, 10);
            const novoCliente = this.repo.create({ ...dto, senha: senhaHash });
            return await this.repo.save(novoCliente);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Falha ao registrar cliente');
        }
    }
    async listarTodos() {
        try {
            return await this.repo.find({
                select: ['id', 'nome', 'email', 'foto', 'cargo'],
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Erro ao listar clientes');
        }
    }
    async buscarPorId(id) {
        await this.validateUUID(id);
        try {
            const cliente = await this.repo.findOne({
                where: { id },
                select: ['id', 'nome', 'email', 'foto', 'sobre', 'habilidades', 'projetosRecentes', 'cargo']
            });
            if (!cliente) {
                throw new common_1.NotFoundException(`Cliente com ID ${id} não encontrado`);
            }
            return cliente;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Erro ao buscar cliente');
        }
    }
    async editarPerfil(id, dto) {
        await this.validateUUID(id);
        try {
            const cliente = await this.repo.findOne({ where: { id } });
            if (!cliente) {
                throw new common_1.NotFoundException('Cliente não encontrado');
            }
            const camposPermitidos = ['foto', 'sobre', 'habilidades', 'projetosRecentes', 'cargo'];
            camposPermitidos.forEach(campo => {
                if (dto[campo] !== undefined)
                    cliente[campo] = dto[campo];
            });
            await this.repo.save(cliente);
            return cliente;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Falha ao atualizar perfil');
        }
    }
    async validarLogin(email, senha) {
        const cliente = await this.repo.findOne({
            where: { email },
            select: ['id', 'nome', 'email', 'senha', 'foto']
        });
        if (!cliente)
            return null;
        const senhaConfere = await bcrypt.compare(senha, cliente.senha);
        if (!senhaConfere)
            return null;
        const { senha: _, ...clienteSemSenha } = cliente;
        return clienteSemSenha;
    }
};
exports.ClienteService = ClienteService;
exports.ClienteService = ClienteService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cliente_entity_1.Cliente)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ClienteService);
//# sourceMappingURL=cliente.service.js.map