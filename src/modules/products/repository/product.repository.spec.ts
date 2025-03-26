import { Product } from 'src/models/product/product.schema';
import { ProductRepository } from './product.repository';
import { Model, Types } from 'mongoose';
import { User } from 'src/models/user/user.schema';
import { NotFoundException } from '@nestjs/common';

describe('ProductRepository', () => {
  let productRepository: ProductRepository;
  let productModel: jest.Mocked<Model<Product>>;
  let userModel: jest.Mocked<Model<User>>;

  const validObjectId = '507f1f77bcf86cd799439011';

  beforeEach(() => {
    productModel = {
      find: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      findByIdAndUpdate: jest.fn(),
    } as unknown as jest.Mocked<Model<Product>>;

    userModel = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<Model<User>>;

    productRepository = new ProductRepository(productModel, userModel);
  });

  describe('findAll', () => {
    it('should return a list of products', async () => {
      const mockProducts = [{ _id: validObjectId, name: 'Product 1' }];
      jest.spyOn(productModel, 'find').mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockProducts),
      } as any);

      const result = await productRepository.findAll(1, 10);

      expect(productModel.find).toHaveBeenCalledWith({ isActive: true });
      expect(result).toEqual(mockProducts);
    });
  });

  describe('findById', () => {
    it('should return a product by ID', async () => {
      const mockProduct = { _id: validObjectId, name: 'Product 1' };
      jest.spyOn(productModel, 'findById').mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockProduct),
      } as any);

      const result = await productRepository.findById(validObjectId);

      expect(productModel.findById).toHaveBeenCalledWith(expect.any(Types.ObjectId));
      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException if product is not found', async () => {
      jest.spyOn(productModel, 'findById').mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(productRepository.findById(validObjectId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const mockProduct = { _id: validObjectId, name: 'Product 1' };
      jest.spyOn(productModel, 'create').mockResolvedValue(mockProduct as any);

      const result = await productRepository.create({ name: 'Product 1' });

      expect(productModel.create).toHaveBeenCalledWith({ name: 'Product 1' });
      expect(result).toEqual(mockProduct);
    });
  });

  describe('update', () => {
    it('should update a product if it exists and is active', async () => {
      const mockActiveProduct = {
        _id: validObjectId,
        name: 'Active Product',
        isActive: true,
      };

      jest.spyOn(productModel, 'findById').mockReturnValueOnce({
        where: jest.fn().mockReturnValue(mockActiveProduct),
      } as any);

      const updatedProduct = {
        _id: validObjectId,
        name: 'Updated Product',
        isActive: true,
      };

      jest.spyOn(productModel, 'findByIdAndUpdate').mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(updatedProduct),
      } as any);

      const result = await productRepository.update(validObjectId, { name: 'Updated Product' });

      expect(result).toEqual(updatedProduct);
    });

    it('should throw NotFoundException if product is not found or not active', async () => {
      jest.spyOn(productModel, 'findById').mockReturnValueOnce({
        where: jest.fn().mockReturnValue(null),
      } as any);

      await expect(
        productRepository.update(validObjectId, { name: 'Updated Product' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findUserById', () => {
    it('should return a user by ID', async () => {
      const mockUser = { _id: validObjectId, email: 'user@example.com' };
      jest.spyOn(userModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      } as any);

      const result = await productRepository.findUserById(validObjectId);

      expect(userModel.findById).toHaveBeenCalledWith(expect.any(Types.ObjectId));
      expect(result).toEqual(mockUser);
    });

    it('should return null if user is not found', async () => {
      jest.spyOn(userModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      const result = await productRepository.findUserById(validObjectId);
      expect(result).toBeNull();
    });
  });

  describe('findByUser', () => {
    it('should return products by user ID', async () => {
      const mockProducts = [{ _id: validObjectId, name: 'Product 1' }];
      jest.spyOn(productModel, 'find').mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockProducts),
      } as any);

      const result = await productRepository.findByUser(validObjectId, 1, 10);

      expect(productModel.find).toHaveBeenCalledWith({
        owner: expect.any(Types.ObjectId),
        isActive: true,
      });
      expect(result).toEqual(mockProducts);
    });
  });
});
