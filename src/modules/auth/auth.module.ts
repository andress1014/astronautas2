import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { AuthRepository } from './repository/auth.repository';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from '../../config/jwt/jwt.config';
import { UserModel } from '../../models/user/user.model';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig),
    UserModel,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository],
})
export class AuthModule {}
