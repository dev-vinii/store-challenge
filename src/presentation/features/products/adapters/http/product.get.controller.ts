import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { BasePaginationDto } from 'src/presentation/common/dto/base-pagination.dto'
import { PaginatedResponse } from 'src/presentation/common/factories/pagination.factory'
import { FindAllProductsResponse } from '../../dto/response/find-all-products.response'
import { FindAllProductsUseCase } from '../../use-cases/find-all-products.use-case'

@ApiTags('Products')
@Controller('products')
export class ProductGetController {
  constructor(
    private readonly findAllProductsUseCase: FindAllProductsUseCase,
  ) {}

  @Get()
  async create(
    @Query() query: BasePaginationDto,
  ): Promise<PaginatedResponse<FindAllProductsResponse>> {
    return this.findAllProductsUseCase.execute(query)
  }
}
