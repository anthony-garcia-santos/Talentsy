//src/cliente.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { ClienteService } from './cliente.service';
import { ClienteController } from './cliente.controller';
import { SupabaseService } from '../supabase/services';
import { AuthModule } from '../auth/module';
import { PerfilController } from './cliente.perfil.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente]), AuthModule,],
  controllers: [ClienteController, PerfilController],
  providers: [ClienteService, SupabaseService],
})
export class ClienteModule { }