// src/config/databases/mongodb/mongo.provider.ts
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const createMongoConfig = async (configService: ConfigService) => {
  const uri = configService.get<string>('MONGODB_URI');
  if (!uri) {
    throw new Error('MONGODB_URI is not defined');
  }
  return {
    uri,
  };
};

export const MongoProvider = MongooseModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: createMongoConfig,
});
