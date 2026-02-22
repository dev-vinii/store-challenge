import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProductRequest } from '../../dto/request/create-product.request';
import { CreateProductUseCase } from '../../use-cases/create-product.use-case';

@ApiTags('Products')
@Controller('products')
export class ProductPostController {
  constructor(private readonly createProductUseCase: CreateProductUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ type: CreateProductRequest })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  async create(@Body() product: CreateProductRequest): Promise<void> {
    return this.createProductUseCase.execute(product);
  }
}
