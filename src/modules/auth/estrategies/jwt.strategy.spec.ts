import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let configService: ConfigService;

  beforeEach(() => {
    configService = {
      get: jest.fn().mockReturnValue('test-secret'),
    } as unknown as ConfigService;
  });

  it('should be defined', () => {
    const jwtStrategy = new JwtStrategy(configService);
    expect(jwtStrategy).toBeDefined();
  });

  it('should call ConfigService to get JWT_SECRET', () => {
    const jwtStrategy = new JwtStrategy(configService);
    expect(configService.get).toHaveBeenCalledWith('JWT_SECRET');
    expect(jwtStrategy).toBeDefined();
  });

  it('should validate the payload and return user object', async () => {
    const jwtStrategy = new JwtStrategy(configService);
    const payload = { id: 1, email: 'test@example.com' };
    const result = await jwtStrategy.validate(payload);
    expect(result).toEqual({ id: payload.id, email: payload.email });
  });
});
