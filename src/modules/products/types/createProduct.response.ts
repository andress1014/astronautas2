import { ApiProperty } from '@nestjs/swagger';

export class ProductResponse {
  @ApiProperty({ example: 'Product created successfully' })
  message: string;

  @ApiProperty({
    example: {
      _id: '1234567890',
      name: 'Laptop Gaming',
      price: 999.99,
      owner: {
        _id: '0987654321',
        email: 'user@email.com',
        fullName: 'John Doe'
      },
      isActive: true,
      createdAt: '2024-03-26T00:00:00.000Z',
      updatedAt: '2024-03-26T00:00:00.000Z'
    }
  })
  product: {
    _id: string;
    name: string;
    price: number;
    owner: {
      _id: string;
      email: string;
      fullName: string;
    };
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
}

export enum ProductResponseMessage {
  PRODUCT_CREATED = 'Product created successfully',
  PRODUCT_UPDATED = 'Product updated successfully',
  PRODUCT_DELETED = 'Product deactivated successfully',
  PRODUCT_NOT_FOUND = 'Product not found',
  UNAUTHORIZED = 'You are not authorized to perform this action'
}