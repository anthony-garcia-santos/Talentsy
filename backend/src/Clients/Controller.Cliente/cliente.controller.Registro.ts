// src/cliente.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Res,
  HttpException,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
  Request,
  UploadedFile,
  UseInterceptors
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
  user: {
    sub: string;
  };
}

@Controller('clientes')
export class ClienteController {
  constructor(
    private readonly clienteService: ClienteService,
    private readonly jwtService: JwtTokenService,
    private readonly cloudinaryService: CloudinaryService
  ) { }

  @Post('registrar')
  @UsePipes(new ValidationPipe())
  async registrar(@Body() dto: CreateClienteDto) {
    const cliente = await this.clienteService.register(dto);
    return {
      success: true,
      data: {
        id: cliente.id,
        nome: cliente.nome,
        email: cliente.email,
      }
    };
  }

  @Patch(':id/editar-perfil')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('foto'))
  async editarPerfil(
    @Param('id') id: string,
    @Body() dto: EditarPerfilDto,
    @Req() req: RequestWithUsuario,
    @UploadedFile() file?: Express.Multer.File
  ) {
    if (req.user.sub !== id) {
      throw new HttpException(
        'Não autorizado a editar este perfil',
        HttpStatus.FORBIDDEN
      );
    }

    let fotoUrl: string | undefined;
    
    if (file) {
      try {
        const uploadResult = await this.cloudinaryService.uploadImage(file, 'perfis');
        fotoUrl = uploadResult.secure_url;
      } catch (error) {
        throw new HttpException(
          'Erro ao fazer upload da imagem',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }

    const cliente = await this.clienteService.editarPerfil(id, {
      ...dto,
      ...(fotoUrl && { foto: fotoUrl }), 
    });

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
    });

    return {
      success: true,
      message: 'Login efetuado',
      clienteId: cliente.id
    };
  }









  @Get()
  async listarClientes() {
    try {
      const clientes = await this.clienteService.listarTodos();

      if (!clientes || clientes.length === 0) {
        return {
          success: true,
          message: 'Nenhum cliente encontrado',
          data: [],
          total: 0
        };
      }

      return {
        success: true,
        total: clientes.length,
        data: clientes.map(cliente => ({
          id: cliente.id,
          nome: cliente.nome,
          email: cliente.email,
          cargo: cliente.cargo,
          foto: cliente.foto 
        }))
      };
    } catch (error) {
      throw new HttpException(
        'Erro ao listar clientes',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }











  @Get(':id')
  async buscarPorId(@Param('id') id: string) {
    const cliente = await this.clienteService.buscarPorId(id);
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
  }
}