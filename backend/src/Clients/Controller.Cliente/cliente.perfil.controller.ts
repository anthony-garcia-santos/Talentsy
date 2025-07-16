// src/Clients/Controller.Cliente/cliente.perfil.controller.ts

export {}; // força o TS a reconhecer como módulo, evite erro TS2306

import {
  Controller,
  Get,
  UseGuards,
  Req,
  HttpException,
  HttpStatus
} from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ClienteService } from '../cliente.service';

interface RequestWithUsuario extends Request {
  usuario: {
    sub: string;
  };
}

@Controller('perfil')
export class PerfilController {
  constructor(private readonly clienteService: ClienteService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getPerfil(@Req() req: RequestWithUsuario) {
    try {
      const userId = req.usuario.sub;
      const cliente = await this.clienteService.buscarPorId(String(userId));

      return {
        success: true,
        data: {
          id: cliente.id,
          nome: cliente.nome,
          email: cliente.email
        }
      };
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar perfil do usuário',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
