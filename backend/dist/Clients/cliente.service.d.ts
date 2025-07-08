import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/cliente.dto';
export declare class ClienteService {
    private repo;
    constructor(repo: Repository<Cliente>);
    emailExists(email: string): Promise<boolean>;
    register(dto: CreateClienteDto): Promise<Cliente>;
    listarTodos(): Promise<Cliente[]>;
    buscarPorId(id: number): Promise<Cliente>;
    validarLogin(email: string, senha: string): Promise<Cliente | null>;
}
