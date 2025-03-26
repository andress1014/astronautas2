import { EventEmitter2 } from "@nestjs/event-emitter";
import { ProductRepository } from "../repository/product.repository";
import { ProductService } from "./product.service";
import { CoreIntegrationService } from "../external/coreIntegration.service";
import { mapProductToResponse } from "../utils/product.mapper";
import { UpdateProductDto } from "../dtos/updateProduct.dto";
import { UnauthorizedException, NotFoundException } from "@nestjs/common";
import { CreateProductDto } from "../dtos/createProduct.dto";
import { ProductResponseMessage } from "../types/createProduct.response";

const mockProduct = {
  _id: 'product123',
  name: 'Product 1',
  price: 100,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  owner: {
    _id: 'user123',
    email: 'user@example.com',
    fullName: 'User Example',
  },
} as any;

const mockUser = {
  _id: 'user123',
  email: 'user@example.com',
  fullName: 'User Example',
  password: 'pass',
  createdAt: new Date(),
  updatedAt: new Date(),
} as any;

describe('ProductService', () => {
  let productService: ProductService;
  let productRepo: jest.Mocked<ProductRepository>;
  let eventEmitter: jest.Mocked<EventEmitter2>;
  let coreService: jest.Mocked<CoreIntegrationService>;

  beforeEach(() => {
    productRepo = {
      findAll: jest.fn(),
      findUserById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
    } as unknown as jest.Mocked<ProductRepository>;

    eventEmitter = {
      emit: jest.fn(),
    } as unknown as jest.Mocked<EventEmitter2>;

    coreService = {
      validateProduct: jest.fn(),
    } as unknown as jest.Mocked<CoreIntegrationService>;

    productService = new ProductService(productRepo, eventEmitter, coreService);
  });

  describe('findAll', () => {
    it('should return paginated products', async () => {
      const mockProducts = [mockProduct];
      productRepo.findAll.mockResolvedValue(mockProducts);

      const result = await productService.findAll(1, 10);

      expect(productRepo.findAll).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual({
        data: mockProducts.map(mapProductToResponse),
        page: 1,
        limit: 10,
      });
    });
  });

  describe('create', () => {
    it('should create a product and return the response', async () => {
      const dto: CreateProductDto = { name: 'Product 1', price: 100 };
      const userId = 'user123';

      productRepo.findUserById.mockResolvedValue(mockUser);
      productRepo.create.mockResolvedValue(mockProduct);
      coreService.validateProduct.mockResolvedValue(true);
      productRepo.update.mockResolvedValue(mockProduct);
      productRepo.findById.mockResolvedValue(mockProduct);

      const result = await productService.create(dto, userId);

      expect(productRepo.findUserById).toHaveBeenCalledWith(userId);
      expect(productRepo.create).toHaveBeenCalledWith({
        ...dto,
        owner: mockUser._id,
      });
      expect(coreService.validateProduct).toHaveBeenCalledWith(dto);
      expect(productRepo.update).toHaveBeenCalledWith(mockProduct._id.toString(), { validated: true });
      expect(eventEmitter.emit).toHaveBeenCalledWith('product.created', { productId: mockProduct._id });
      expect(result).toEqual({
        message: ProductResponseMessage.PRODUCT_CREATED,
        product: mapProductToResponse(mockProduct),
      });
    });

    it('should throw NotFoundException if user is not found', async () => {
      const dto: CreateProductDto = { name: 'Product 1', price: 100 };
      productRepo.findUserById.mockResolvedValue(null);

      await expect(productService.create(dto, 'user123')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if product is not found after creation', async () => {
      const dto: CreateProductDto = { name: 'Product 1', price: 100 };
      productRepo.findUserById.mockResolvedValue(mockUser);
      productRepo.create.mockResolvedValue(mockProduct);
      coreService.validateProduct.mockResolvedValue(true);
      productRepo.update.mockResolvedValue(mockProduct);
      productRepo.findById.mockResolvedValue(null as any);

      await expect(productService.create(dto, 'user123')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a product and return the response', async () => {
      const dto: UpdateProductDto = { name: 'Updated Product' };
      const updatedProduct = { ...mockProduct, ...dto };

      productRepo.findById.mockResolvedValue(mockProduct);
      productRepo.update.mockResolvedValue(updatedProduct);

      const result = await productService.update('product123', dto, 'user123');

      expect(productRepo.findById).toHaveBeenCalledWith('product123');
      expect(productRepo.update).toHaveBeenCalledWith('product123', dto);
      expect(result).toEqual({
        message: ProductResponseMessage.PRODUCT_UPDATED,
        product: mapProductToResponse(updatedProduct),
      });
    });

    it('should throw NotFoundException if product does not exist', async () => {
      productRepo.findById.mockResolvedValue(null as any);

      await expect(
        productService.update('product123', { name: 'Updated' }, 'user123'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if user is not the owner', async () => {
      const productNotOwned = { ...mockProduct, owner: { _id: 'otherUser' } };
      productRepo.findById.mockResolvedValue(productNotOwned);

      await expect(
        productService.update('product123', { name: 'Updated' }, 'user123'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('delete', () => {
    it('should deactivate a product and return the response', async () => {
      const deactivatedProduct = { ...mockProduct, isActive: false };

      productRepo.findById.mockResolvedValue(mockProduct);
      productRepo.update.mockResolvedValue(deactivatedProduct);

      const result = await productService.delete('product123', 'user123');

      expect(productRepo.findById).toHaveBeenCalledWith('product123');
      expect(productRepo.update).toHaveBeenCalledWith('product123', { isActive: false });
      expect(result).toEqual({
        message: ProductResponseMessage.PRODUCT_DELETED,
        product: mapProductToResponse(deactivatedProduct),
      });
    });

    it('should throw NotFoundException if product is not found', async () => {
      productRepo.findById.mockResolvedValue(null as any);

      await expect(productService.delete('product123', 'user123')).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if user is not the owner', async () => {
      const productNotOwned = { ...mockProduct, owner: { _id: 'otherUser' } };
      productRepo.findById.mockResolvedValue(productNotOwned);

      await expect(productService.delete('product123', 'user123')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw NotFoundException if update fails', async () => {
      productRepo.findById.mockResolvedValue(mockProduct);
      productRepo.update.mockResolvedValue(null as any);

      await expect(productService.delete('product123', 'user123')).rejects.toThrow(NotFoundException);
    });
  });
});
