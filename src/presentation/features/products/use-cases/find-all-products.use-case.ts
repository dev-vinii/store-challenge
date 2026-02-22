import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BasePaginationDto } from 'src/presentation/common/dto/base-pagination.dto';
import { PaginatedResponse } from '../../../common/factories/pagination.factory';
import { ProductsRepository } from '../../sales/products.repository';
import { FindAllProductsResponse } from '../dto/response/find-all-products.response';

@Injectable()
export class FindAllProductsUseCase {
  constructor(private readonly productRepository: ProductsRepository) {}

  async execute({
    cursor = '',
    limit = 10,
  }: BasePaginationDto): Promise<PaginatedResponse<FindAllProductsResponse>> {
    const products = await this.productRepository.findpaginated({
      cursor,
      limit,
    });

    const nextCursor = products[products.length - 1]?.id;

    const hasNextPage = products.length > limit;

    const items = plainToInstance(
      FindAllProductsResponse,
      products.slice(0, limit),
      {
        excludeExtraneousValues: true,
      },
    );

    return PaginatedResponse.create(
      items,
      limit,
      cursor,
      nextCursor,
      hasNextPage,
    );
  }
}
