import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from '../repository/auth.repository';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';
import { IAuthService } from './auth.interface';
import { LoginResponse, LoginResponseMessage } from '../types/login.response';
import { RegisterResponse, RegisterResponseMessage } from '../types/register.response';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly authRepo: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<RegisterResponse> {
    const existingUser = await this.authRepo.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException(RegisterResponseMessage.USER_ALREADY_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.authRepo.createUser({
      email: dto.email,
      fullName: dto.fullName,
      password: hashedPassword,
    });

    return {
      message: RegisterResponseMessage.USER_REGISTERED_SUCCESSFULLY,
      user: {
        _id: user._id as string,
        email: user.email,
        fullName: user.fullName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  async login(dto: LoginDto): Promise<LoginResponse> {
    const user = await this.authRepo.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException(LoginResponseMessage.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(LoginResponseMessage.INVALID_CREDENTIALS);
    }

    const payload = {
      id: user._id as string,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      message: LoginResponseMessage.LOGIN_SUCCESS,
      accessToken,
      user: {
        id: user._id as string,
        email: user.email,
        fullName: user.fullName,
      },
    };
  }
}
