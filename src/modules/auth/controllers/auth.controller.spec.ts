import { HttpStatus } from "@nestjs/common";
import { LoginDto } from "../dtos/login.dto";
import { RegisterDto } from "../dtos/register.dto";
import { AuthService } from "../services/auth.service";
import { AuthController } from "./auth.controller";

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(() => {
    authService = {
      login: jest.fn(),
      register: jest.fn(),
    } as any;
    authController = new AuthController(authService);
  });

  describe('login', () => {
    it('should call authService.login with the correct parameters and return the response', async () => {
      const loginDto: LoginDto = { email: 'test@example.com', password: 'password123' };
      const mockResponse = {
        accessToken: 'mockToken',
        user: { id: 'mockUserId', email: 'test@example.com', fullName: "sadsa" },
      };

      jest.spyOn(authService, 'login').mockResolvedValue({
        ...mockResponse,
        message: 'Login successful',
      });

      const result = await authController.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual({
        data: mockResponse,
        statusCode: HttpStatus.OK,
        message: 'Login successful',
      });
    });
  });

  describe('register', () => {
    it('should call authService.register with the correct parameters and return the response', async () => {
      const registerDto: RegisterDto = { email: 'test@example.com', password: 'password123', fullName: 'Test User' };

      const mockResponse = {
        user: {
          _id: 'mockUserId',
          email: 'test@example.com',
          fullName: 'Test User',
          createdAt: new Date('2025-03-26T06:55:55.378Z'),
          updatedAt: new Date('2025-03-26T06:55:55.378Z'),
        },
      };

      jest.spyOn(authService, 'register').mockResolvedValue({
        ...mockResponse,
        message: 'Registration successful',
      });

      const result = await authController.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual({
        data: mockResponse,
        statusCode: HttpStatus.CREATED,
        message: 'Registration successful',
      });
    });
  });
});
