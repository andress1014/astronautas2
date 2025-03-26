import { validate } from 'class-validator';
import { RegisterDto } from './register.dto';

describe('RegisterDto', () => {
  it('should validate successfully with valid data', async () => {
    const dto = new RegisterDto();
    dto.email = 'user@email.com';
    dto.password = '123456';
    dto.fullName = 'Juan Pérez';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation if email is invalid', async () => {
    const dto = new RegisterDto();
    dto.email = 'invalid-email';
    dto.password = '123456';
    dto.fullName = 'Juan Pérez';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isEmail).toBeDefined();
  });

  it('should fail validation if password is too short', async () => {
    const dto = new RegisterDto();
    dto.email = 'user@email.com';
    dto.password = '123';
    dto.fullName = 'Juan Pérez';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.minLength).toBeDefined();
  });

  it('should fail validation if fullName is empty', async () => {
    const dto = new RegisterDto();
    dto.email = 'user@email.com';
    dto.password = '123456';
    dto.fullName = '';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isNotEmpty).toBeDefined();
  });
});