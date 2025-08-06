// src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

app.enableCors({
  origin: [
    'https://talentsy.vercel.app', // Seu frontend na Vercel
    'https://talentsy.onrender.com', // Seu backend
    'http://localhost:3000'         // Para desenvolvimento local
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Permite cookies/tokens
  allowedHeaders: 'Content-Type,Authorization'
});

  await app.listen(process.env.PORT || 5000);
  console.log(`✅ Servidor rodando em porta ${process.env.PORT || 5000}`);
}

bootstrap();
