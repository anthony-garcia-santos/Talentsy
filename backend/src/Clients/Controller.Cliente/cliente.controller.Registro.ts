// src/cliente.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Res,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  InternalServerErrorException,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { ClienteService } from '../cliente.service';
import { CreateClienteDto } from '../../dto/Cliente.DTO/cliente.dto.Registro';
import { LoginDto } from 'src/dto/Cliente.DTO/cliente.dto.login';
import { JwtTokenService } from '../../auth/jwt.service';
import { Response } from 'express';
import { EditarPerfilDto } from 'src/dto/Cliente.DTO/editar-perfil.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';

interface RequestWithUsuario extends Request {
  user: { sub: string };
}

@Controller('clientes')
export class ClienteController {
  constructor(
    private readonly clienteService: ClienteService,
    private readonly jwtService: JwtTokenService,
    private readonly cloudinaryService: CloudinaryService
  ) { }


  @Post(':id/foto')
  @UseInterceptors(FileInterceptor('foto'))
  async uploadFotoPerfil(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }

    const result = await this.cloudinaryService.uploadImage(file, 'perfis');
    const clienteAtual = await this.clienteService.buscarPorId(id);

    await this.clienteService.editarPerfil(id, {
      foto: result.secure_url,
      sobre: clienteAtual.sobre || '',
      habilidades: clienteAtual.habilidades || '',
      projetosRecentes: clienteAtual.projetosRecentes || '[]',
      cargo: clienteAtual.cargo || ''
    });

    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id
    };
  }










  @Patch(':id/editar-perfil')
  @UseGuards(JwtAuthGuard)
  async editarPerfil(
    @Param('id') id: string,
    @Body() dto: EditarPerfilDto & { foto?: string },
    @Req() req: RequestWithUsuario,
  ) {
    if (req.user.sub !== id) {
      throw new HttpException('Não autorizado a editar este perfil', HttpStatus.FORBIDDEN);
    }
    const cliente = await this.clienteService.editarPerfil(id, dto);
    return {
      success: true,
      message: 'Perfil atualizado com sucesso!',
      data: {
        id: cliente.id,
        foto: cliente.foto,
        sobre: cliente.sobre,
        habilidades: cliente.habilidades,
        projetosRecentes: cliente.projetosRecentes,
      }
    };
  }





  @Post('login')
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {
    const cliente = await this.clienteService.validarLogin(body.email, body.senha);
    if (!cliente) {
      throw new HttpException('Credenciais inválidas', HttpStatus.UNAUTHORIZED);
    }
    const token = this.jwtService.gerarToken({ sub: cliente.id });
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      domain: '.talentsy.onrender.com'
    });
    return { success: true, message: 'Login efetuado', clienteId: cliente.id };
  }





  @Get()
  async listarClientes() {
    try {
      const clientes = await this.clienteService.listarTodos();
      if (!clientes.length) {
        return { success: true, message: 'Nenhum cliente encontrado', data: [], total: 0 };
      }
      return {
        success: true,
        total: clientes.length,
        data: clientes.map(c => ({
          id: c.id,
          nome: c.nome,
          email: c.email,
          cargo: c.cargo,
          foto: c.foto
        }))
      };
    } catch (error) {
      throw new HttpException('Erro ao listar clientes', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }






  @Get(':id')
  async buscarPorId(@Param('id') id: string) {
    // Verifica se é um UUID válido
    if (!this.isValidUUID(id)) {
      throw new BadRequestException('ID deve ser um UUID válido');
    }

    try {
      const cliente = await this.clienteService.buscarPorId(id);

      if (!cliente) {
        throw new HttpException('Cliente não encontrado', HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        data: {
          id: cliente.id,
          nome: cliente.nome,
          email: cliente.email,
          foto: cliente.foto || null,
          sobre: cliente.sobre || null,
          habilidades: cliente.habilidades || null,
          projetos_recentes: cliente.projetosRecentes || null,
          cargo: cliente.cargo || null
        }
      };
    } catch (error) {
      throw new HttpException('Erro ao buscar cliente', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private isValidUUID(id: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }


}
