import { ProductResponse, ProductResponseMessage } from "./createProduct.response";

describe('ProductResponse', () => {
  it('should have the correct message property', () => {
    const response = new ProductResponse();
    response.message = 'Product created successfully';
    expect(response.message).toBe('Product created successfully');
  });

  it('should have the correct product structure', () => {
    const response = new ProductResponse();
    response.product = {
      _id: '1234567890',
      name: 'Laptop Gaming',
      price: 999.99,
      owner: {
        _id: '0987654321',
        email: 'user@email.com',
        fullName: 'John Doe',
      },
      isActive: true,
      createdAt: new Date('2024-03-26T00:00:00.000Z'),
      updatedAt: new Date('2024-03-26T00:00:00.000Z'),
    };

    expect(response.product).toEqual({
      _id: '1234567890',
      name: 'Laptop Gaming',
      price: 999.99,
      owner: {
        _id: '0987654321',
        email: 'user@email.com',
        fullName: 'John Doe',
      },
      isActive: true,
      createdAt: new Date('2024-03-26T00:00:00.000Z'),
      updatedAt: new Date('2024-03-26T00:00:00.000Z'),
    });
  });
});

describe('ProductResponseMessage', () => {
  it('should have the correct enum values', () => {
    expect(ProductResponseMessage.PRODUCT_CREATED).toBe('Product created successfully');
    expect(ProductResponseMessage.PRODUCT_UPDATED).toBe('Product updated successfully');
    expect(ProductResponseMessage.PRODUCT_DELETED).toBe('Product deactivated successfully');
    expect(ProductResponseMessage.PRODUCT_NOT_FOUND).toBe('Product not found');
    expect(ProductResponseMessage.UNAUTHORIZED).toBe('You are not authorized to perform this action');
  });
});