// src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtTokenService } from './jwt.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';


@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }),
  JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '7d' },
  }),

    CloudinaryModule,

  ],
  controllers: [AuthController],
  providers: [JwtTokenService],
  exports: [JwtTokenService],
})
export class AuthModule { }
