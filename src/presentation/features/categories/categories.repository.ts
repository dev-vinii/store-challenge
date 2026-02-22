import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/infra/db/common/base.repository';
import { DatabaseProvider } from 'src/infra/db/common/database.provider';
import { CategoryEntity } from 'src/infra/db/common/entities/postgres/category.entity';

@Injectable()
export class CategoriesRepository extends BaseRepository<CategoryEntity> {
  constructor(dbProvider: DatabaseProvider) {
    super(CategoryEntity, dbProvider);
  }
}
