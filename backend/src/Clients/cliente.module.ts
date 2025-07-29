//src/cliente.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from '../ModelBD/cliente.entity';
import { ClienteService } from './cliente.service';
import { ClienteController } from './Controller.Cliente/cliente.controller.Registro';
import { SupabaseService } from '../supabase/services';
import { AuthModule } from '../auth/module';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true, 
  }),
    CloudinaryModule,

  TypeOrmModule.forFeature([Cliente]),

    AuthModule,],

  controllers: [ClienteController],
  providers: [ClienteService, SupabaseService],
})
export class ClienteModule { }