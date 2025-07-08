//cliente.perfil.controller

import { Controller, Get, UseGuards, Req, HttpException, HttpStatus } from '@nestjs/common'; // Adicione as importações
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ClienteService } from './cliente.service';

@Controller('perfil')
export class PerfilController {
  constructor(private readonly clienteService: ClienteService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getPerfil(@Req() req) {
    try {
      const userId = req.user.sub;
      const cliente = await this.clienteService.buscarPorId(Number(userId));
      
      return {
        success: true,
        data: {
          id: cliente.id,
          nome: cliente.nome,
          email: cliente.email
        }
      };
    } catch (error) {
      throw new HttpException( // Agora HttpException está disponível
        'Erro ao buscar perfil do usuário',
        HttpStatus.INTERNAL_SERVER_ERROR // E HttpStatus também
      );
    }
  }
}