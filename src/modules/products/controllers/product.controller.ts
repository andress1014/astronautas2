import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProductService } from '../services/product.service';
import { CreateProductDto } from '../dtos/createProduct.dto';
import { UpdateProductDto } from '../dtos/updateProduct.dto';
import { JwtAuthGuard } from '../../auth/guards/auth.guard';
import { handlerResponse } from '../../../config/handlers/handler.response';
import { CurrentUser } from '../../auth/decorator/currentUser.decorator';
import { UserPayload } from '../../auth/types/userPayload.type';

@ApiTags('Products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @CurrentUser() user: UserPayload,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const result = await this.productService.findAll(+page, +limit);
    return handlerResponse(result, 200, 'Products retrieved successfully');
  }

  @Post()
  async create(
    @Body() dto: CreateProductDto,
    @CurrentUser() user: UserPayload,
  ) {
    const product = await this.productService.create(dto, user.id);
    return handlerResponse(product, 201, product.message);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @CurrentUser() user: UserPayload,
  ) {
    const product = await this.productService.update(id, dto, user.id);
    return handlerResponse(product, 200, product.message);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: UserPayload,
  ) {
    const product = await this.productService.delete(id, user.id);
    return handlerResponse(product, 200, product.message);
  }
}
