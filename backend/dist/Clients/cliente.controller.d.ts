import { SupabaseService } from '../supabase/services';
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
export declare class ClienteController {
    private readonly supabaseService;
    private readonly clienteService;
    constructor(supabaseService: SupabaseService, clienteService: ClienteService);
    register(dto: CreateClienteDto): Promise<any>;
    private verificarEmailExistente;
    private sincronizarSupabase;
    private formatarRespostaSucesso;
    private handleRegistrationError;
}
