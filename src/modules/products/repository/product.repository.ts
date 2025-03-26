import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, HydratedDocument, Types } from 'mongoose';
import { Product } from '../../../models/product/product.schema';
import { User } from '../../../models/user/user.schema';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,

    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<HydratedDocument<Product>[]> {
    const skip = (page - 1) * limit;
    return this.productModel
      .find({ isActive: true })
      .populate('owner', 'email fullName')
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async findById(id: string): Promise<HydratedDocument<Product>> {
    const product = await this.productModel
      .findById(new Types.ObjectId(id))
      .populate('owner', 'email fullName')
      .exec();

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async create(data: Partial<Product>): Promise<HydratedDocument<Product>> {
    return this.productModel.create(data);
  }

  async update(
    id: string,
    data: Partial<Product>,
  ): Promise<HydratedDocument<Product> | null> {
    const validateActiveProd = await this.productModel
      .findById(new Types.ObjectId(id))
      .where({ isActive: true });

    if (!validateActiveProd) {
      throw new NotFoundException('Product not found');
    }
    return this.productModel
      .findByIdAndUpdate(new Types.ObjectId(id), data, { new: true })
      .populate('owner', 'email fullName')
      .exec();
  }

  async findUserById(id: string): Promise<User | null> {
    return this.userModel.findById(new Types.ObjectId(id)).exec();
  }

  async findByUser(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<HydratedDocument<Product>[]> {
    const skip = (page - 1) * limit;
    return this.productModel
      .find({ owner: new Types.ObjectId(userId), isActive: true })
      .populate('owner', 'email fullName')
      .skip(skip)
      .limit(limit)
      .exec();
  }
}
