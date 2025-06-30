import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
export declare class ClienteService {
    private repo;
    constructor(repo: Repository<Cliente>);
    emailExists(email: string): Promise<boolean>;
    register(dto: CreateClienteDto): Promise<Cliente>;
}
