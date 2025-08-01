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
const common_2 = require("@nestjs/common");
const bcrypt = require("bcrypt");
let ClienteService = class ClienteService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async emailExists(email) {
        const user = await this.repo.findOne({ where: { email } });
        return !!user;
    }
    async register(dto) {
        const senhaHash = await bcrypt.hash(dto.senha, 10);
        const novoCliente = this.repo.create({ ...dto, senha: senhaHash });
        return this.repo.save(novoCliente);
    }
    async listarTodos() {
        return this.repo.find();
    }
    async buscarPorId(id) {
        const cliente = await this.repo.findOne({ where: { id } });
        if (!cliente) {
            throw new common_2.NotFoundException('Cliente não encontrado');
        }
        return cliente;
    }
    async editarPerfil(id, dto) {
        const cliente = await this.repo.findOne({ where: { id } });
        if (!cliente) {
            throw new common_2.NotFoundException('Cliente não encontrado');
        }
        if (dto.foto !== undefined)
            cliente.foto = dto.foto;
        if (dto.sobre !== undefined)
            cliente.sobre = dto.sobre;
        if (dto.habilidades !== undefined)
            cliente.habilidades = dto.habilidades;
        if (dto.projetosRecentes !== undefined)
            cliente.projetosRecentes = dto.projetosRecentes;
        if (dto.cargo !== undefined)
            cliente.cargo = dto.cargo;
        await this.repo.save(cliente);
        return cliente;
    }
    async validarLogin(email, senha) {
        const cliente = await this.repo.findOne({ where: { email } });
        if (!cliente)
            return null;
        const senhaConfere = await bcrypt.compare(senha, cliente.senha);
        return senhaConfere ? cliente : null;
    }
};
exports.ClienteService = ClienteService;
exports.ClienteService = ClienteService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cliente_entity_1.Cliente)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ClienteService);
//# sourceMappingURL=cliente.service.js.map