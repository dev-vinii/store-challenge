import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BasePaginationDto } from 'src/presentation/common/dto/base-pagination.dto';
import { PaginatedResponse } from '../../../common/factories/pagination.factory';
import { FindAllSalesResponse } from '../dto/response/find-all-sales.response';
import { SalesRepository } from '../sales.repository';

@Injectable()
export class FindAllSalesUseCase {
  constructor(private readonly salesRepository: SalesRepository) {}

  async execute({
    cursor = '',
    limit = 10,
  }: BasePaginationDto): Promise<PaginatedResponse<FindAllSalesResponse>> {
    const sales = await this.salesRepository.findPaginated({
      cursor,
      limit,
    });

    const nextCursor = sales[sales.length - 1]?.id;
    const hasNextPage = sales.length > limit;

    const items = plainToInstance(FindAllSalesResponse, sales.slice(0, limit), {
      excludeExtraneousValues: true,
    });

    return PaginatedResponse.create(
      items,
      limit,
      cursor,
      nextCursor,
      hasNextPage,
    );
  }
}
