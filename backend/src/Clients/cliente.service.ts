//src/cliente.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
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

}




