import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/presentation/common/decorators/api-paginated-response.decorator';
import { BasePaginationDto } from 'src/presentation/common/dto/base-pagination.dto';
import { PaginatedResponse } from 'src/presentation/common/factories/pagination.factory';
import { SearchProductsRequest } from '../../dto/request/search-products.request';
import { FindAllProductsResponse } from '../../dto/response/find-all-products.response';
import { FindAllProductsUseCase } from '../../use-cases/find-all-products.use-case';
import { SearchProductsUseCase } from '../../use-cases/search-products.use-case';

@ApiTags('Products')
@Controller('products')
@ApiExtraModels(FindAllProductsResponse, PaginatedResponse)
export class ProductGetController {
  constructor(
    private readonly findAllProductsUseCase: FindAllProductsUseCase,
    private readonly searchProductsUseCase: SearchProductsUseCase,
  ) {}

  @Get()
  @ApiPaginatedResponse(FindAllProductsResponse)
  async create(
    @Query() query: BasePaginationDto,
  ): Promise<PaginatedResponse<FindAllProductsResponse>> {
    return this.findAllProductsUseCase.execute(query);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search products via Elasticsearch' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  async search(@Query() query: SearchProductsRequest) {
    return this.searchProductsUseCase.execute(query);
  }
}
