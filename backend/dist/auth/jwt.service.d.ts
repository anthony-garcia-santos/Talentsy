import { JwtService } from '@nestjs/jwt';
export declare class JwtTokenService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    gerarToken(payload: any): string;
    verificarToken(token: string): Promise<any>;
}
