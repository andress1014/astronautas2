import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
  } from '@nestjs/common';
  import { AuthService } from '../services/auth.service';
  import { LoginDto } from '../dtos/login.dto';
  import { RegisterDto } from '../dtos/register.dto';
  import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { handlerResponse } from 'src/config/handlers/handler.response';
import { LoginResponse } from '../types/login.response';
  
  @ApiTags('Auth')
  @Controller('auth')
  export class AuthController {
    constructor(private readonly authService: AuthService) {}
  
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: LoginDto })
    @ApiResponse({ type: LoginResponse })
    async login(@Body() dto: LoginDto) {
      return handlerResponse(await this.authService.login(dto), HttpStatus.OK);
    }
  
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @ApiBody({ type: RegisterDto })
    @ApiResponse({ status: 201, description: 'Usuario registrado' })
    async register(@Body() dto: RegisterDto) {
      return this.authService.register(dto);
    }
  }
  