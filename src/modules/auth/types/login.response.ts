import { ApiProperty } from "@nestjs/swagger";

export class LoginResponse {
  @ApiProperty({ example: 'user@email.com' })
  accessToken: string;

  @ApiProperty({ 
    example: {
      id: '1234567890',
      email: 'test@tets.com',
      fullName: 'John Doe'
    } 
  })
  user: {
    id: string;
    email: string;
    fullName: string;
  };
}