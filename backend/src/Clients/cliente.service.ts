import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from '../ModelBD/cliente.entity';
import { CreateClienteDto } from '../dto/Cliente.DTO/cliente.dto.Registro';
import { EditarPerfilDto } from 'src/dto/Cliente.DTO/editar-perfil.dto';
import * as bcrypt from 'bcrypt';
import { validate } from 'class-validator';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente)
    private repo: Repository<Cliente>,
  ) { }

  private async validateUUID(id: string): Promise<void> {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new BadRequestException('ID inválido - formato UUID requerido');
    }
  }

  async emailExists(email: string): Promise<boolean> {
    try {
      const user = await this.repo.findOne({ where: { email } });
      return !!user;
    } catch (error) {
      throw new InternalServerErrorException('Erro ao verificar e-mail');
    }
  }

  async register(dto: CreateClienteDto): Promise<Cliente> {
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    if (await this.emailExists(dto.email)) {
      throw new BadRequestException('E-mail já está em uso');
    }

    try {
      const senhaHash = await bcrypt.hash(dto.senha, 10);
      const novoCliente = this.repo.create({ ...dto, senha: senhaHash });
      return await this.repo.save(novoCliente);
    } catch (error) {
      throw new InternalServerErrorException('Falha ao registrar cliente');
    }
  }

  async listarTodos(): Promise<Cliente[]> {
    try {
      return await this.repo.find({
        select: ['id', 'nome', 'email', 'foto', 'cargo'], // Campos seguros para retornar
      });
    } catch (error) {
      throw new InternalServerErrorException('Erro ao listar clientes');
    }
  }

  async buscarPorId(id: string): Promise<Cliente> {
    await this.validateUUID(id);

    try {
      const cliente = await this.repo.findOne({
        where: { id },
        select: ['id', 'nome', 'email', 'foto', 'sobre', 'habilidades', 'projetosRecentes', 'cargo']
      });

      if (!cliente) {
        throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
      }

      return cliente;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao buscar cliente');
    }
  }

  async editarPerfil(id: string, dto: EditarPerfilDto): Promise<Cliente> {
    await this.validateUUID(id);

    try {
      const cliente = await this.repo.findOne({ where: { id } });
      if (!cliente) {
        throw new NotFoundException('Cliente não encontrado');
      }

      // Atualiza apenas os campos fornecidos
      const camposPermitidos = ['foto', 'sobre', 'habilidades', 'projetosRecentes', 'cargo'];
      camposPermitidos.forEach(campo => {
        if (dto[campo] !== undefined) cliente[campo] = dto[campo];
      });

      await this.repo.save(cliente);
      return cliente;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Falha ao atualizar perfil');
    }
  }




  
  async validarLogin(email: string, senha: string): Promise<Cliente | null> {
    const cliente = await this.repo.findOne({
      where: { email },
      select: ['id', 'nome', 'email', 'senha', 'foto'] // Inclui senha para comparação
    });

    if (!cliente) return null;

    const senhaConfere = await bcrypt.compare(senha, cliente.senha);
    if (!senhaConfere) return null;

    // Remove a senha antes de retornar
    const { senha: _, ...clienteSemSenha } = cliente;
    return clienteSemSenha as Cliente;
  }
}