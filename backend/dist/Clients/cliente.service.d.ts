import { Repository } from 'typeorm';
import { Cliente } from '../ModelBD/cliente.entity';
import { CreateClienteDto } from '../dto/Cliente.DTO/cliente.dto.Registro';
import { EditarPerfilDto } from 'src/dto/Cliente.DTO/editar-perfil.dto';
export declare class ClienteService {
    private repo;
    constructor(repo: Repository<Cliente>);
    emailExists(email: string): Promise<boolean>;
    register(dto: CreateClienteDto): Promise<Cliente>;
    listarTodos(): Promise<Cliente[]>;
    buscarPorId(id: string): Promise<Cliente>;
    editarPerfil(id: string, dto: EditarPerfilDto): Promise<Cliente>;
    validarLogin(email: string, senha: string): Promise<Cliente | null>;
}
