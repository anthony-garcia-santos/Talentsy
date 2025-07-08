// auth/jwt.service.ts

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtTokenService {
  constructor(private readonly jwtService: JwtService) { }

  gerarToken(payload: any): string {
    return this.jwtService.sign(payload);
  }

  async verificarToken(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (e) {
      throw new UnauthorizedException('Token inválido');
    }
  }
}