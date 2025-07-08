// auth/auth.module.ts

import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtTokenService} from './jwt.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'suaChaveSecretaSuperForte',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [JwtTokenService],
  exports: [JwtTokenService], 
})
export class AuthModule {}
