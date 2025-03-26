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
import {
  ApiTags,
  ApiBearerAuth,
  ApiQuery,
  ApiResponse,
  ApiOperation,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { ProductService } from '../services/product.service';
import { CreateProductDto } from '../dtos/createProduct.dto';
import { UpdateProductDto } from '../dtos/updateProduct.dto';
import { JwtAuthGuard } from '../../auth/guards/auth.guard';
import { handlerResponse } from '../../../config/handlers/handler.response';
import { CurrentUser } from '../../auth/decorator/currentUser.decorator';
import { UserPayload } from '../../auth/types/userPayload.type';
import { ProductResponse } from '../types/createProduct.response';

@ApiTags('Products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'List all products' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  async findAll(
    @CurrentUser() user: UserPayload,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const result = await this.productService.findAll(+page, +limit);
    return handlerResponse(result, 200, 'Products retrieved successfully');
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, type: ProductResponse, description: 'Product created successfully' })
  async create(
    @Body() dto: CreateProductDto,
    @CurrentUser() user: UserPayload,
  ) {
    const product = await this.productService.create(dto, user.id);
    return handlerResponse(product, 201, product.message);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Product ID' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, type: ProductResponse, description: 'Product updated successfully' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @CurrentUser() user: UserPayload,
  ) {
    const product = await this.productService.update(id, dto, user.id);
    return handlerResponse(product, 200, product.message);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete (deactivate) a product by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Product ID' })
  @ApiResponse({ status: 200, type: ProductResponse, description: 'Product deactivated successfully' })
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: UserPayload,
  ) {
    const product = await this.productService.delete(id, user.id);
    return handlerResponse(product, 200, product.message);
  }
}
