import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/infra/db/common/base.repository';
import { DatabaseProvider } from 'src/infra/db/common/database.provider';
import { SaleEntity } from 'src/infra/db/common/entities/postgres/sale.entity';
import { BasePaginationDto } from 'src/presentation/common/dto/base-pagination.dto';

@Injectable()
export class SalesRepository extends BaseRepository<SaleEntity> {
  constructor(dbProvider: DatabaseProvider) {
    super(SaleEntity, dbProvider);
  }

  findPaginated(query: BasePaginationDto): Promise<SaleEntity[]> {
    const qb = this.dbProvider
      .getRepository(SaleEntity)
      .createQueryBuilder('sale')
      .select([
        'sale.id',
        'sale.productId',
        'sale.quantity',
        'sale.unitPrice',
        'sale.totalPrice',
        'sale.createdAt',
      ])
      .limit(query.limit + 1);

    if (query.cursor) {
      qb.where('sale.id > :cursor', { cursor: query.cursor });
    }

    return qb.getMany();
  }
}
