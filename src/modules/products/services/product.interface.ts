import { CreateProductDto } from '../dtos/createProduct.dto';
import { UpdateProductDto } from '../dtos/updateProduct.dto';
import { ProductResponse } from '../types/createProduct.response';

export interface IProductService {
  findAll(page?: number, limit?: number): Promise<{
    data: ProductResponse['product'][];
    page: number;
    limit: number;
  }>;

  create(dto: CreateProductDto, userId: string): Promise<ProductResponse>;

  update(
    id: string,
    dto: UpdateProductDto,
    userId: string
  ): Promise<ProductResponse>;

  delete(id: string, userId: string): Promise<ProductResponse>;
}
