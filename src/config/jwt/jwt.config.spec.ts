import { ConfigService } from '@nestjs/config';
import { jwtConfig } from './jwt.config';

describe('jwtConfig', () => {
  let configService: ConfigService;

  beforeEach(() => {
    configService = new ConfigService();
  });

  it('should return the correct JWT configuration', async () => {
    jest.spyOn(configService, 'get').mockImplementation((key: string) => {
      if (key === 'JWT_SECRET') {
        return 'test-secret';
      }
      return null;
    });

    if (!jwtConfig.useFactory) {
      throw new Error('useFactory is not defined on jwtConfig');
    }
    const result = await jwtConfig.useFactory(configService);

    expect(result).toEqual({
      secret: 'test-secret',
      signOptions: { expiresIn: '1d' },
    });
  });

  it('should include ConfigModule in imports', () => {
    expect(jwtConfig.imports).toContainEqual(expect.any(Function));
  });

  it('should inject ConfigService', () => {
    expect(jwtConfig.inject).toContain(ConfigService);
  });
});