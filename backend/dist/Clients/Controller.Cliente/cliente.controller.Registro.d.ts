import { ClienteService } from '../cliente.service';
import { LoginDto } from 'src/dto/Cliente.DTO/cliente.dto.login';
import { JwtTokenService } from '../../auth/jwt.service';
import { Response } from 'express';
import { EditarPerfilDto } from 'src/dto/Cliente.DTO/editar-perfil.dto';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
interface RequestWithUsuario extends Request {
    user: {
        sub: string;
    };
}
export declare class ClienteController {
    private readonly clienteService;
    private readonly jwtService;
    private readonly cloudinaryService;
    constructor(clienteService: ClienteService, jwtService: JwtTokenService, cloudinaryService: CloudinaryService);
    uploadFotoPerfil(id: string, file: Express.Multer.File): Promise<{
        success: boolean;
        url: string;
        public_id: string;
    }>;
    editarPerfil(id: string, dto: EditarPerfilDto & {
        foto?: string;
    }, req: RequestWithUsuario): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            foto: string | undefined;
            sobre: string;
            habilidades: string;
            projetosRecentes: string;
        };
    }>;
    login(body: LoginDto, res: Response): Promise<{
        success: boolean;
        message: string;
        clienteId: string;
    }>;
    listarClientes(): Promise<{
        success: boolean;
        message: string;
        data: never[];
        total: number;
    } | {
        success: boolean;
        total: number;
        data: {
            id: string;
            nome: string;
            email: string;
            cargo: string;
            foto: string | undefined;
        }[];
        message?: undefined;
    }>;
    buscarPorId(id: string): Promise<{
        success: boolean;
        data: {
            id: string;
            nome: string;
            email: string;
            foto: string | null;
            sobre: string | null;
            habilidades: string | null;
            projetos_recentes: string | null;
            cargo: string | null;
        };
    }>;
}
export {};
