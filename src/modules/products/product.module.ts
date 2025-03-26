import { Module } from '@nestjs/common';
import { ProductController } from './controllers/product.controller';
import { ProductService } from './services/product.service';
import { ProductRepository } from './repository/product.repository';
import { ProductModel } from '../../models/product/product.model';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { User } from 'src/models/user/user.schema';
import { UserModel } from 'src/models/user/user.model';
import { CoreIntegrationService } from './external/coreIntegration.service';
import { ProductListener } from './listener/product.listener';

@Module({
  imports: [ProductModel, UserModel, EventEmitterModule.forRoot()],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository, CoreIntegrationService, ProductListener],
})
export class ProductModule {}