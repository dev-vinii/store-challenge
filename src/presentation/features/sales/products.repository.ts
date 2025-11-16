import { Injectable } from '@nestjs/common'
import { BaseRepository } from 'src/infra/db/common/base.repository'
import { ProductEntity } from 'src/infra/db/common/entities/postgres/product.entity'
import { DatabaseProvider } from 'src/infra/db/common/database.provider'

@Injectable()
export class ProductsRepository extends BaseRepository<ProductEntity> {
  constructor(databaseProvider: DatabaseProvider) {
    super(ProductEntity, databaseProvider)
  }
}
