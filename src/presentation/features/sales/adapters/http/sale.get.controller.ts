import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/presentation/common/decorators/api-paginated-response.decorator';
import { BasePaginationDto } from 'src/presentation/common/dto/base-pagination.dto';
import { PaginatedResponse } from 'src/presentation/common/factories/pagination.factory';
import { FindAllSalesResponse } from '../../dto/response/find-all-sales.response';
import { FindAllSalesUseCase } from '../../use-cases/find-all-sales.use-case';

@ApiTags('Sales')
@Controller('sales')
@ApiExtraModels(FindAllSalesResponse, PaginatedResponse)
export class SaleGetController {
  constructor(
    private readonly findAllSalesUseCase: FindAllSalesUseCase,
  ) {}

  @Get()
  @ApiPaginatedResponse(FindAllSalesResponse)
  async findAll(
    @Query() query: BasePaginationDto,
  ): Promise<PaginatedResponse<FindAllSalesResponse>> {
    return this.findAllSalesUseCase.execute(query);
  }
}
