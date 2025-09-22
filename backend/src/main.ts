// src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://api-talentsy.onrender.com'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization'
  });

  await app.listen(process.env.PORT || 5000);
  console.log(`✅ Servidor rodando em porta ${process.env.PORT || 5000}`);
}

bootstrap();
