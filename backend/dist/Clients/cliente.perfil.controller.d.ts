import { ClienteService } from './cliente.service';
export declare class PerfilController {
    private readonly clienteService;
    constructor(clienteService: ClienteService);
    getPerfil(req: any): Promise<{
        success: boolean;
        data: {
            id: number;
            nome: string;
            email: string;
        };
    }>;
}
