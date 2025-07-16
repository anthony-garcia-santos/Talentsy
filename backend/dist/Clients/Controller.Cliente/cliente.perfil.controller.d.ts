export {};
import { ClienteService } from '../cliente.service';
interface RequestWithUsuario extends Request {
    usuario: {
        sub: string;
    };
}
export declare class PerfilController {
    private readonly clienteService;
    constructor(clienteService: ClienteService);
    getPerfil(req: RequestWithUsuario): Promise<{
        success: boolean;
        data: {
            id: string;
            nome: string;
            email: string;
        };
    }>;
}
