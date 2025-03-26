// src/modules/products/services/product.service.ts
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ProductRepository } from '../repository/product.repository';
import { CreateProductDto } from '../dtos/createProduct.dto';
import {
  ProductResponse,
  ProductResponseMessage,
} from '../types/createProduct.response';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { mapProductToResponse } from '../utils/product.mapper';
import { Types } from 'mongoose';
import { UpdateProductDto } from '../dtos/updateProduct.dto';
import { CoreIntegrationService } from '../external/coreIntegration.service'; // 🆕 nuevo servicio externo

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    private readonly productRepo: ProductRepository,
    private readonly eventEmitter: EventEmitter2,
    private readonly coreService: CoreIntegrationService, // 🆕 inyectar servicio externo
  ) {}

  async findAll(page = 1, limit = 10) {
    const products = await this.productRepo.findAll(page, limit);
    return {
      data: products.map(mapProductToResponse),
      page,
      limit,
    };
  }

  async create(dto: CreateProductDto, userId: string): Promise<ProductResponse> {
    const user = await this.productRepo.findUserById(userId);
    if (!user) {
      throw new NotFoundException(ProductResponseMessage.PRODUCT_NOT_FOUND);
    }

    const product = await this.productRepo.create({
      ...dto,
      owner: user._id as unknown as Types.ObjectId,
    });

    // 📡 Simulación de validación externa
    const validated = await this.coreService.validateProduct(dto);
    this.logger.log(`Product validation result: ${validated}`);

    // 📝 Actualizar producto con estado de validación
    await this.productRepo.update(product._id.toString(), { validated });

    const populated = await this.productRepo.findById(product._id.toString());
    if (!populated) {
      throw new NotFoundException(ProductResponseMessage.PRODUCT_NOT_FOUND);
    }

    this.eventEmitter.emit('product.created', { productId: product._id });

    return {
      message: ProductResponseMessage.PRODUCT_CREATED,
      product: mapProductToResponse(populated),
    };
  }

  async update(id: string, dto: UpdateProductDto, userId: string): Promise<ProductResponse> {
    const product = await this.productRepo.findById(id);
    if (!product) {
      throw new NotFoundException(ProductResponseMessage.PRODUCT_NOT_FOUND);
    }

    const ownerId =
      'owner' in product && typeof product.owner === 'object'
        ? product.owner._id?.toString?.()
        : product.owner?.toString?.();

    if (ownerId !== userId) {
      throw new UnauthorizedException(ProductResponseMessage.UNAUTHORIZED);
    }

    const updatedProduct = await this.productRepo.update(id, dto);
    if (!updatedProduct) {
      throw new NotFoundException(ProductResponseMessage.PRODUCT_NOT_FOUND);
    }

    return {
      message: ProductResponseMessage.PRODUCT_UPDATED,
      product: mapProductToResponse(updatedProduct),
    };
  }

  async delete(id: string, userId: string): Promise<ProductResponse> {
    const product = await this.productRepo.findById(id);
    if (!product) {
      throw new NotFoundException(ProductResponseMessage.PRODUCT_NOT_FOUND);
    }

    const ownerId =
      'owner' in product && typeof product.owner === 'object'
        ? product.owner._id?.toString?.()
        : product.owner?.toString?.();

    if (ownerId !== userId) {
      throw new UnauthorizedException(ProductResponseMessage.UNAUTHORIZED);
    }

    const deactivated = await this.productRepo.update(id, { isActive: false });
    if (!deactivated) {
      throw new NotFoundException(ProductResponseMessage.PRODUCT_NOT_FOUND);
    }

    return {
      message: ProductResponseMessage.PRODUCT_DELETED,
      product: mapProductToResponse(deactivated),
    };
  }
}
