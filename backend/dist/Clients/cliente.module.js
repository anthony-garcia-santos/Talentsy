"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClienteModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cliente_entity_1 = require("./entities/cliente.entity");
const cliente_service_1 = require("./cliente.service");
const cliente_controller_1 = require("./cliente.controller");
const services_1 = require("../supabase/services");
const module_1 = require("../auth/module");
const cliente_perfil_controller_1 = require("./cliente.perfil.controller");
let ClienteModule = class ClienteModule {
};
exports.ClienteModule = ClienteModule;
exports.ClienteModule = ClienteModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([cliente_entity_1.Cliente]), module_1.AuthModule,],
        controllers: [cliente_controller_1.ClienteController, cliente_perfil_controller_1.PerfilController],
        providers: [cliente_service_1.ClienteService, services_1.SupabaseService],
    })
], ClienteModule);
//# sourceMappingURL=cliente.module.js.map