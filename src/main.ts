import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get MongoDB Connection from NestJS
  const connection = app.get<Connection>(getConnectionToken());

  // MongoDB Event Listeners
  connection.on('connected', () => {
    console.log('MongoDB connected successfully!');
  });

  connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });

  connection.on('disconnected', () => {
    console.log('MongoDB disconnected!');
  });

  app.setGlobalPrefix('chella_api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
