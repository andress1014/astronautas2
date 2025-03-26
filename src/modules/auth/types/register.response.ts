import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponse {
  @ApiProperty({ example: 'User registered successfully' })
  message: string;

  @ApiProperty({
    example: {
      _id: '1234567890',
      email: 'test@test.com',
      fullName: 'John Doe',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    },
  })
  user: {
    _id: string;
    email: string;
    fullName: string;
    createdAt: Date;
    updatedAt: Date;
    [key: string]: any;
  };
}

export enum RegisterResponseMessage {
  USER_REGISTERED_SUCCESSFULLY = 'User registered successfully',
  USER_ALREADY_EXISTS = 'User already exists',
}