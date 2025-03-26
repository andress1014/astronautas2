import { Injectable, Logger } from '@nestjs/common';
import { CreateProductDto } from '../dtos/createProduct.dto';

@Injectable()
export class CoreIntegrationService {
  private readonly logger = new Logger(CoreIntegrationService.name);

  async validateProduct(dto: CreateProductDto): Promise<boolean> {
    // Simula una regla: si el precio es menor a 10, lo rechaza
    const isValid = dto.price >= 10;

    // Simula logueo de resultado como si fuera la respuesta de un servicio externo
    this.logger.log(`Simulated core validation result: ${isValid}`);

    return isValid;
  }
}
