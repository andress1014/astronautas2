import { validate } from 'class-validator';
import { CreateProductDto } from './createProduct.dto';

describe('CreateProductDto', () => {
  it('should validate successfully with valid data', async () => {
    const dto = new CreateProductDto();
    dto.name = 'Laptop Gaming';
    dto.price = 999.99;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation when name is empty', async () => {
    const dto = new CreateProductDto();
    dto.name = '';
    dto.price = 999.99;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('name');
  });

  it('should fail validation when price is negative', async () => {
    const dto = new CreateProductDto();
    dto.name = 'Laptop Gaming';
    dto.price = -10;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('price');
  });

  it('should fail validation when price is not a number', async () => {
    const dto = new CreateProductDto();
    dto.name = 'Laptop Gaming';
    dto.price = 'invalid' as any;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('price');
  });
});