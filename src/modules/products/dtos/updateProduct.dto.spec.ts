import { UpdateProductDto } from './updateProduct.dto';

describe('UpdateProductDto', () => {
  it('should be defined', () => {
    expect(new UpdateProductDto()).toBeDefined();
  });

  it('should allow partial properties of CreateProductDto', () => {
    const dto = new UpdateProductDto();
    dto.name = 'Updated Name';
    dto.price = 199.99;

    expect(dto.name).toBe('Updated Name');
    expect(dto.price).toBe(199.99);
  });
});
