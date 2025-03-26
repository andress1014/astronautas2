import { Test, TestingModule } from '@nestjs/testing';
import { CoreIntegrationService } from './coreIntegration.service';
import { CreateProductDto } from '../dtos/createProduct.dto';

describe('CoreIntegrationService', () => {
  let service: CoreIntegrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoreIntegrationService],
    }).compile();

    service = module.get<CoreIntegrationService>(CoreIntegrationService);
  });

  it('should return true if product price is greater than or equal to 10', async () => {
    const dto: CreateProductDto = { name: 'Sample Product', price: 10 };
    const result = await service.validateProduct(dto);
    expect(result).toBe(true);
  });

  it('should return false if product price is less than 10', async () => {
    const dto: CreateProductDto = { name: 'Sample Product', price: 5 };
    const result = await service.validateProduct(dto);
    expect(result).toBe(false);
  });
});