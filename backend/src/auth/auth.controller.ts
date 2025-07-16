// src/auth/auth.controller.ts

import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('api')
export class AuthController {
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: any) {
    const user = req.user; 
    return { id: user.sub };
  }
}
