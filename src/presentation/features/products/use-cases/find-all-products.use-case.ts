import { Injectable } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { BasePaginationDto } from 'src/presentation/common/dto/base-pagination.dto'
import { PaginatedResponse } from '../../../common/factories/pagination.factory'
import { ProductsRepository } from '../../sales/products.repository'
import { FindAllProductsResponse } from '../dto/response/find-all-products.response'

@Injectable()
export class FindAllProductsUseCase {
  constructor(private readonly productRepository: ProductsRepository) {}

  async execute({
    page = 0,
    limit = 10,
  }: BasePaginationDto): Promise<PaginatedResponse<FindAllProductsResponse>> {
    const products = await this.productRepository.find({
      skip: page * limit,
      take: limit,
    })

    const items = plainToInstance(FindAllProductsResponse, products, {
      excludeExtraneousValues: true,
    })

    const total = await this.productRepository.count({})

    return PaginatedResponse.create(items, page, limit, total)
  }
}
