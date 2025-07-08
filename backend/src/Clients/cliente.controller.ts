// src/cliente.controller.ts

import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Get,
  Param,
  Res
} from '@nestjs/common';
import { SupabaseService } from '../supabase/services';
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/cliente.dto';
import { JwtTokenService } from '../auth/jwt.service';
import { Response } from 'express';

@Controller('clientes')
export class ClienteController {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly clienteService: ClienteService,
    private readonly jwtService: JwtTokenService

  ) { }

  @Post('registrar')
  async registrar(@Body() dto: CreateClienteDto) {
    try {
      this.validarDados(dto);
      await this.verificarEmailDuplicado(dto.email);

      const cliente = await this.clienteService.register(dto);
      await this.sincronizarComSupabase(cliente);

      return this.respostaDeSucesso(cliente);

    } catch (error) {
      this.lidarComErro(error);
    }
  }


  @Post('login')

  async login(@Body() body: { email: string; senha: string },

    @Res ({ passthrough: true }) res: Response) {
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

    return { success: true, message: 'Login efetuado', clienteId: cliente.id };
  }





  @Get()
  async listarClientes() {
    const clientes = await this.clienteService.listarTodos();
    return {
      success: true,
      total: clientes.length,
      data: clientes,
    };
  }

  

  @Get(':id')
  async buscarPorId(@Param('id') id: string) {
    try {
      const cliente = await this.clienteService.buscarPorId(Number(id));
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
        'Cliente não encontrado',
        HttpStatus.NOT_FOUND
      );
    }
  }

  // ====================
  // Métodos auxiliares
  // ====================

  private validarDados(dto: CreateClienteDto): void {
    const camposVazios = !dto.nome || !dto.email || !dto.senha;

    if (camposVazios) {
      throw new HttpException('Dados incompletos', HttpStatus.BAD_REQUEST);
    }
  }

  private async verificarEmailDuplicado(email: string): Promise<void> {
    const emailLocalExiste = await this.clienteService.emailExists(email);
    if (emailLocalExiste) {
      throw new HttpException('Email já cadastrado localmente', HttpStatus.CONFLICT);
    }

    const { data, error } = await this.supabaseService.getClient()
      .from('users')
      .select('email')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error('Erro ao verificar email no Supabase:', error);
      throw new HttpException('Erro ao validar e-mail no Supabase', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (data) {
      throw new HttpException('Email já cadastrado no Supabase', HttpStatus.CONFLICT);
    }
  }

  private async sincronizarComSupabase(cliente: any): Promise<void> {
    const { error } = await this.supabaseService.getClient()
      .from('users')
      .insert([{
        nome: cliente.nome,
        email: cliente.email,
        created_at: new Date().toISOString()
      }]);

    if (error) {
      console.error('Erro na sincronização com Supabase:', error);
      throw new HttpException(
        'Registro local efetuado, mas falha na sincronização com Supabase',
        HttpStatus.ACCEPTED
      );
    }
  }

  private respostaDeSucesso(cliente: any) {
    return {
      success: true,
      message: 'Registro concluído com sucesso',
      data: {
        id: cliente.id,
        nome: cliente.nome,
        email: cliente.email
      },
      meta: {
        sync: 'completed',
        timestamp: new Date().toISOString()
      }
    };
  }

  private lidarComErro(error: any): never {
    if (error instanceof HttpException) throw error;

    console.error('Erro inesperado no registro:', error);
    throw new HttpException(
      {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Erro inesperado ao registrar usuário',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
