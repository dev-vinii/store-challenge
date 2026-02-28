import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateSaleRequest } from '../../dto/request/create-sale.request';
import { CreateSaleUseCase } from '../../use-cases/create-sale.use-case';

@ApiTags('Sales')
@Controller('sales')
export class SalePostController {
  constructor(private readonly createSaleUseCase: CreateSaleUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new sale' })
  @ApiBody({ type: CreateSaleRequest })
  @ApiResponse({ status: 201, description: 'Sale created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  async create(@Body() sale: CreateSaleRequest): Promise<void> {
    return this.createSaleUseCase.execute(sale);
  }
}
