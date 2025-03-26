import { JwtAuthGuard } from './auth.guard';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtAuthGuard', () => {
  let jwtAuthGuard: JwtAuthGuard;

  beforeEach(() => {
    jwtAuthGuard = new JwtAuthGuard();
  });

  describe('handleRequest', () => {
    it('should return the user if no error and user exists', () => {
      const user = { id: 1, username: 'testuser' };
      const result = jwtAuthGuard.handleRequest(null, user, null);
      expect(result).toBe(user);
    });

    it('should throw UnauthorizedException if no user is provided', () => {
      expect(() => jwtAuthGuard.handleRequest(null, null, null)).toThrow(
        UnauthorizedException,
      );
    });

    it('should throw the error if an error is provided', () => {
      const error = new Error('Some error');
      expect(() => jwtAuthGuard.handleRequest(error, null, null)).toThrow(
        error,
      );
    });
  });
});