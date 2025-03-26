import { JwtService } from "@nestjs/jwt";
import { AuthRepository } from "../repository/auth.repository";
import { AuthService } from "./auth.service";
import { ConflictException, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcrypt";

describe('AuthService', () => {
  let authService: AuthService;
  let authRepo: jest.Mocked<AuthRepository>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(() => {
    authRepo = {
      findByEmail: jest.fn(),
      createUser: jest.fn(),
    } as unknown as jest.Mocked<AuthRepository>;

    jwtService = {
      sign: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    authService = new AuthService(authRepo, jwtService);
  });

  describe('register', () => {
    it('should throw ConflictException if user already exists', async () => {
      authRepo.findByEmail.mockResolvedValueOnce({ email: 'test@example.com' } as any);

      await expect(
        authService.register({
          email: 'test@example.com',
          fullName: 'Test User',
          password: 'password123',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should create a new user and return success response', async () => {
      authRepo.findByEmail.mockResolvedValueOnce(null);
      authRepo.createUser.mockResolvedValueOnce({
        _id: '123',
        email: 'test@example.com',
        fullName: 'Test User',
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      const result = await authService.register({
        email: 'test@example.com',
        fullName: 'Test User',
        password: 'password123',
      });

      expect(result.message).toBe('User registered successfully');
      expect(authRepo.createUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        fullName: 'Test User',
        password: expect.any(String),
      });
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user does not exist', async () => {
      authRepo.findByEmail.mockResolvedValueOnce(null);

      await expect(
        authService.login({
          email: 'test@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      authRepo.findByEmail.mockResolvedValueOnce({
        _id: '123',
        email: 'test@example.com',
        fullName: 'Test User',
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false as never);

      await expect(
        authService.login({
          email: 'test@example.com',
          password: 'wrongPassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return login response if credentials are valid', async () => {
      authRepo.findByEmail.mockResolvedValueOnce({
        _id: '123',
        email: 'test@example.com',
        fullName: 'Test User',
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true as never);
      jwtService.sign.mockReturnValueOnce('accessToken');

      const result = await authService.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.message).toBe('Login successful');
      expect(result.accessToken).toBe('accessToken');
      expect(result.user).toEqual({
        id: '123',
        email: 'test@example.com',
        fullName: 'Test User',
      });
    });
  });
});
