import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { LoginResponse } from '../types/login.response';
import { RegisterResponse } from '../types/register.response';

export interface IAuthService {
  register(dto: RegisterDto): Promise<RegisterResponse>;
  login(dto: LoginDto): Promise<LoginResponse>;
}
