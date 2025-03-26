import { validate } from 'class-validator';
import { LoginDto } from './login.dto';

describe('LoginDto', () => {
  it('should validate a valid LoginDto', async () => {
    const dto = new LoginDto();
    dto._id = '1234567890';
    dto.email = 'user@email.com';
    dto.password = '123456';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation if email is invalid', async () => {
    const dto = new LoginDto();
    dto._id = '1234567890';
    dto.email = 'invalid-email';
    dto.password = '123456';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isEmail).toBeDefined();
  });

  it('should fail validation if password is too short', async () => {
    const dto = new LoginDto();
    dto._id = '1234567890';
    dto.email = 'user@email.com';
    dto.password = '123';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.minLength).toBeDefined();
  });

  it('should pass validation with only required fields', async () => {
    const dto = new LoginDto();
    dto._id = '1234567890';
    dto.email = 'user@email.com';
    dto.password = '123456';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});