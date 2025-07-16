//src/cliente.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from '../ModelBD/cliente.entity';
import { CreateClienteDto } from '../dto/Cliente.DTO/cliente.dto.Registro';
import { NotFoundException } from '@nestjs/common';
import { EditarPerfilDto } from 'src/dto/Cliente.DTO/editar-perfil.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente)
    private repo: Repository<Cliente>,
  ) { }

  async emailExists(email: string): Promise<boolean> {
    const user = await this.repo.findOne({ where: { email } });
    return !!user;
  }

  async register(dto: CreateClienteDto) {
    const senhaHash = await bcrypt.hash(dto.senha, 10);
    const novoCliente = this.repo.create({ ...dto, senha: senhaHash });
    return this.repo.save(novoCliente);
  }


  async listarTodos(): Promise<Cliente[]> {
    return this.repo.find();
  }












  async buscarPorId(id: string): Promise<Cliente> {
    const cliente = await this.repo.findOne({ where: { id } });
    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado');
    }
    return cliente;
  }



  async editarPerfil(id: string, dto: EditarPerfilDto): Promise<Cliente> {
    const cliente = await this.repo.findOne({ where: { id } });

    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado');
    }

    cliente.sobre = dto.sobre;
    cliente.habilidades = dto.habilidades;
    cliente.projetosRecentes = dto.projetosRecentes;
    cliente.cargo = dto.cargo;

    await this.repo.save(cliente);

    return cliente;
  }








  async validarLogin(email: string, senha: string) {
    const cliente = await this.repo.findOne({ where: { email } });
    if (!cliente) return null;

    const senhaConfere = await bcrypt.compare(senha, cliente.senha);
    return senhaConfere ? cliente : null;
  }


}




