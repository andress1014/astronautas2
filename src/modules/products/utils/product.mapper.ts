import { HydratedDocument } from 'mongoose';
import { Product } from '../../../models/product/product.schema';
import { ProductResponse } from '../types/createProduct.response';

export function mapProductToResponse(product: HydratedDocument<Product>): ProductResponse['product'] {
  const owner = product.owner as any;

  return {
    _id: product._id.toString(),
    name: product.name,
    price: product.price,
    isActive: product.isActive,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    owner: {
      _id: owner._id?.toString?.() || '',
      email: owner.email,
      fullName: owner.fullName,
    },
  };
}
