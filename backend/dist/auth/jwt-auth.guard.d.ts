import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtTokenService } from './jwt.service';
export declare class JwtAuthGuard implements CanActivate {
    private readonly jwtTokenService;
    constructor(jwtTokenService: JwtTokenService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
