import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { handlerResponse } from 'src/config/handlers/handler.response';
import { LoginResponse } from '../types/login.response';
import { RegisterResponse } from '../types/register.response';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginDto })
  @ApiResponse({ type: LoginResponse })
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.login(dto);
    return handlerResponse(
      user,
      HttpStatus.OK,
      user.message,
    );
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ type: RegisterResponse })
  async register(@Body() dto: RegisterDto) {
    const registerData = await this.authService.register(dto);
    return handlerResponse(
      registerData,
      HttpStatus.CREATED,
      registerData.message,
    );
  }
}
