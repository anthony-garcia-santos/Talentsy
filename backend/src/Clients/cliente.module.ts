//src/cliente.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from '../ModelBD/cliente.entity';
import { ClienteService } from './cliente.service';
import { ClienteController } from './Controller.Cliente/cliente.controller.Registro';
import { SupabaseService } from '../supabase/services';
import { AuthModule } from '../auth/module';
import { PerfilController } from './Controller.Cliente/cliente.perfil.controller';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryModule } from '../cloudinary/cloudinary.module'; // <-- caminho correto

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true, 
  }),
    CloudinaryModule,

  TypeOrmModule.forFeature([Cliente]),

    AuthModule,],

  controllers: [ClienteController, PerfilController],
  providers: [ClienteService, SupabaseService],
})
export class ClienteModule { }