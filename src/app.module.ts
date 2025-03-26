// src/app.module.ts
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongoProvider } from './config/databases/mongodb/mongo.provider';
import { AuthModule } from './modules/auth/auth.module';
import { ProductModule } from './modules/products/product.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware'; // 👈 importa el middleware

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongoProvider,
    AuthModule,
    ProductModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*'); // 👈 aplica a todas las rutas
  }
}
