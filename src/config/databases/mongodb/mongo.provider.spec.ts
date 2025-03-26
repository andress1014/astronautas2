// test/config/databases/mongo.provider.spec.ts
import { ConfigService } from '@nestjs/config';
import { createMongoConfig } from './mongo.provider';

describe('MongoProvider', () => {
  it('should throw an error if MONGODB_URI is not defined', async () => {
    const mockConfigService = {
      get: jest.fn().mockReturnValue(null),
    };

    await expect(createMongoConfig(mockConfigService as unknown as ConfigService))
      .rejects
      .toThrow('MONGODB_URI is not defined');
  });

  it('should return valid mongo config when URI is defined', async () => {
    const mockConfigService = {
      get: jest.fn().mockReturnValue('mongodb://localhost:27017/test'),
    };

    const result = await createMongoConfig(mockConfigService as unknown as ConfigService);

    expect(result).toEqual({ uri: 'mongodb://localhost:27017/test' });
  });
});
