// src/cliente.controller.ts

import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { SupabaseService } from '../supabase/services';
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';

@Controller('clientes')
export class ClienteController {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly clienteService: ClienteService
  ) {}

  @Post('registrar')
  async register(@Body() dto: CreateClienteDto) {
    try {
      if (!dto.email || !dto.senha || !dto.nome) {
        throw new HttpException('Dados incompletos', HttpStatus.BAD_REQUEST);
      }

      await this.verificarEmailExistente(dto.email);

      const cliente = await this.clienteService.register(dto);

      await this.sincronizarSupabase(cliente);

      return this.formatarRespostaSucesso(cliente);
      
    } catch (error) {
      this.handleRegistrationError(error);
    }
  }

  private async verificarEmailExistente(email: string): Promise<void> {
    if (await this.clienteService.emailExists(email)) {
      throw new HttpException('Email já cadastrado localmente', HttpStatus.CONFLICT);
    }

    const supabase = this.supabaseService.getClient();
    const { data: existingUser, error } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error('Erro ao verificar email no Supabase:', error);
      throw new HttpException(
        'Erro ao validar e-mail', 
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    if (existingUser) {
      throw new HttpException('Email já existe no Supabase', HttpStatus.CONFLICT);
    }
  }

  private async sincronizarSupabase(cliente: any): Promise<void> {
    try {
      const supabase = this.supabaseService.getClient();
      const { error } = await supabase
        .from('users')
        .insert([{
          nome: cliente.nome,
          email: cliente.email,
          created_at: new Date().toISOString()
        }]);

      if (error) {
        console.error('Erro na sincronização:', error);
        throw new HttpException(
          'Registro local efetuado, mas falha na sincronização', 
          HttpStatus.ACCEPTED
        );
      }
    } catch (syncError) {
      console.error('Falha crítica na sincronização:', syncError);
    }
  }

  private formatarRespostaSucesso(cliente: any): any {
    return {
      success: true,
      message: 'Registro concluído com sucesso',
      data: {
        id: cliente.id,
        nome: cliente.nome,
        email: cliente.email,
      },
      meta: {
        sync: 'completed',
        timestamp: new Date().toISOString()
      }
    };
  }

  private handleRegistrationError(error: any): never {
    if (error instanceof HttpException) {
      throw error;
    }

    console.error('Erro não tratado no registro:', error);
    throw new HttpException(
      {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Ocorreu um erro durante o registro',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}