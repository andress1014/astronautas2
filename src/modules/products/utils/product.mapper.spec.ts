import { mapProductToResponse } from './product.mapper';
import { HydratedDocument } from 'mongoose';
import { Product } from '../../../models/product/product.schema';
import { ProductResponse } from '../types/createProduct.response';

describe('mapProductToResponse', () => {
  it('should map a product document to a ProductResponse object', () => {
    const mockProduct: HydratedDocument<Product> = {
      _id: '12345',
      name: 'Test Product',
      price: 100,
      isActive: true,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-02'),
      owner: {
        _id: '67890',
        email: 'owner@example.com',
        fullName: 'Owner Name',
      },
    } as any;

    const expectedResponse: ProductResponse['product'] = {
      _id: '12345',
      name: 'Test Product',
      price: 100,
      isActive: true,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-02'),
      owner: {
        _id: '67890',
        email: 'owner@example.com',
        fullName: 'Owner Name',
      },
    };

    const result = mapProductToResponse(mockProduct);

    expect(result).toEqual(expectedResponse);
  });

  it('should handle missing owner fields gracefully', () => {
    const mockProduct: HydratedDocument<Product> = {
      _id: '12345',
      name: 'Test Product',
      price: 100,
      isActive: true,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-02'),
      owner: {
        email: 'owner@example.com',
        fullName: '', // ✅ agregado para evitar undefined
      },
    } as any;

    const expectedResponse: ProductResponse['product'] = {
      _id: '12345',
      name: 'Test Product',
      price: 100,
      isActive: true,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-02'),
      owner: {
        _id: '',
        email: 'owner@example.com',
        fullName: '', // ✅ esperado
      },
    };

    const result = mapProductToResponse(mockProduct);

    expect(result).toEqual(expectedResponse);
  });
});
