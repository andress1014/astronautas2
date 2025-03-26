// src/modules/products/listeners/product.listener.ts
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ProductListener {
  private readonly logger = new Logger(ProductListener.name);

  @OnEvent('product.created')
  handleProductCreated(payload: { productId: string }) {
    this.logger.log(`📦 Producto creado con ID: ${payload.productId}`);
    
    // Aquí podrías simular otras acciones: enviar notificación, auditoría, etc.
  }
}
