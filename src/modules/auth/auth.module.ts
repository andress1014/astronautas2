import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { AuthRepository } from './repository/auth.repository';
import { JwtModule } from '@nestjs/jwt';
import { UserModel } from '../../models/user/user.model';
import { JwtStrategy } from './estrategies/jwt.strategy';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UserModel,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    AuthRepository,
    JwtStrategy  // Añadido JwtStrategy a los providers
  ],
  exports: [JwtStrategy],
})
export class AuthModule {}