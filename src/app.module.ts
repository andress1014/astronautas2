// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongoProvider } from './config/databases/mongodb/mongo.provider';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,          // <-- Esto permite usar ConfigService en todo el proyecto
      envFilePath: '.env',     // <-- Aquí se carga dotenv automáticamente
    }),
    MongoProvider,
    AuthModule
  ],
})
export class AppModule {}
