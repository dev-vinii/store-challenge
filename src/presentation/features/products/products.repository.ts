import { Injectable } from '@nestjs/common'
import { BaseRepository } from 'src/infra/db/common/base.repository'
import { DatabaseProvider } from 'src/infra/db/common/database.provider'
import { ProductEntity } from 'src/infra/db/common/entities/postgres/product.entity'
import { BasePaginationDto } from 'src/presentation/common/dto/base-pagination.dto'

@Injectable()
export class ProductsRepository extends BaseRepository<ProductEntity> {
  constructor(databaseProvider: DatabaseProvider) {
    super(ProductEntity, databaseProvider)
  }

  findpaginated(query: BasePaginationDto) {
    const qb = this.databaseProvider
      .getRepository(ProductEntity)
      .createQueryBuilder('product')
      .select([
        'product.id',
        'product.name',
        'product.description',
        'product.price',
        'product.createdAt',
        'product.updatedAt',
      ])
      .limit(query.limit + 1)

    if (query.cursor) {
      qb.where('product.id > :cursor', { cursor: query.cursor })
    }

    return qb.getMany()
  }
}
