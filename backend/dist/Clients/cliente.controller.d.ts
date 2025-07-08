import { SupabaseService } from '../supabase/services';
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/cliente.dto';
import { JwtTokenService } from '../auth/jwt.service';
import { Response } from 'express';
export declare class ClienteController {
    private readonly supabaseService;
    private readonly clienteService;
    private readonly jwtService;
    constructor(supabaseService: SupabaseService, clienteService: ClienteService, jwtService: JwtTokenService);
    registrar(dto: CreateClienteDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: any;
            nome: any;
            email: any;
        };
        meta: {
            sync: string;
            timestamp: string;
        };
    }>;
    login(body: {
        email: string;
        senha: string;
    }, res: Response): Promise<{
        success: boolean;
        message: string;
        clienteId: number;
    }>;
    listarClientes(): Promise<{
        success: boolean;
        total: number;
        data: import("./entities/cliente.entity").Cliente[];
    }>;
    buscarPorId(id: string): Promise<{
        success: boolean;
        data: {
            id: number;
            nome: string;
            email: string;
        };
    }>;
    private validarDados;
    private verificarEmailDuplicado;
    private sincronizarComSupabase;
    private respostaDeSucesso;
    private lidarComErro;
}
