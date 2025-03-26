import { ProductService } from "../services/product.service";
import { ProductController } from "./product.controller";
import { ProductResponse } from "../types/createProduct.response";

describe('ProductController', () => {
  let productController: ProductController;
  let productService: ProductService;

  const mockProduct = {
    _id: '1',
    name: 'Product 1',
    price: 100,
    isActive: true,
    createdAt: new Date('2025-03-26T14:50:12.734Z'),
    updatedAt: new Date('2025-03-26T14:50:12.734Z'),
    owner: {
      _id: 'user1',
      email: 'user@example.com',
      fullName: 'User Test',
    },
  };

  beforeEach(() => {
    productService = {
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;
    productController = new ProductController(productService);
  });

  describe('findAll', () => {
    it('should return a list of products', async () => {
      const mockResult = {
        data: [mockProduct],
        page: 1,
        limit: 10,
      };
      jest.spyOn(productService, 'findAll').mockResolvedValue(mockResult);

      const result = await productController.findAll({ id: 'user1' } as any, 1, 10);

      expect(productService.findAll).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual({
        statusCode: 200,
        message: 'Products retrieved successfully',
        data: mockResult,
      });
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const mockDto = { name: 'Product 1', price: 100 };
      const mockResult: ProductResponse = {
        message: 'Product created successfully',
        product: mockProduct,
      };
      jest.spyOn(productService, 'create').mockResolvedValue(mockResult);

      const result = await productController.create(mockDto as any, { id: 'user1' } as any);

      expect(productService.create).toHaveBeenCalledWith(mockDto, 'user1');
      expect(result).toEqual({
        statusCode: 201,
        message: 'Product created successfully',
        data: {
          product: mockProduct,
        },
      });
    });
  });

  describe('update', () => {
    it('should update a product by ID', async () => {
      const mockDto = { name: 'Updated Product', price: 150 };
      const mockResult: ProductResponse = {
        message: 'Product updated successfully',
        product: mockProduct,
      };
      jest.spyOn(productService, 'update').mockResolvedValue(mockResult);

      const result = await productController.update('1', mockDto as any, { id: 'user1' } as any);

      expect(productService.update).toHaveBeenCalledWith('1', mockDto, 'user1');
      expect(result).toEqual({
        statusCode: 200,
        message: 'Product updated successfully',
        data: {
          product: mockProduct,
        },
      });
    });
  });

  describe('delete', () => {
    it('should deactivate a product by ID', async () => {
      const mockResult: ProductResponse = {
        message: 'Product deactivated successfully',
        product: mockProduct,
      };
      jest.spyOn(productService, 'delete').mockResolvedValue(mockResult);

      const result = await productController.delete('1', { id: 'user1' } as any);

      expect(productService.delete).toHaveBeenCalledWith('1', 'user1');
      expect(result).toEqual({
        statusCode: 200,
        message: 'Product deactivated successfully',
        data: {
          product: mockProduct,
        },
      });
    });
  });  describe('findAll with default params', () => {
    it('should use default page and limit when none provided', async () => {
      const mockResult = {
        data: [mockProduct],
        page: 1,
        limit: 10,
      };
      jest.spyOn(productService, 'findAll').mockResolvedValue(mockResult);

      const result = await productController.findAll({ id: 'user1' } as any, undefined, undefined);

      expect(productService.findAll).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual({
        statusCode: 200,
        message: 'Products retrieved successfully',
        data: mockResult,
      });
    });
  });

});
