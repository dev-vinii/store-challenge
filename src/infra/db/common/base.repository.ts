import {
  DeepPartial,
  EntityTarget,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ObjectId,
  ObjectLiteral,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm'
import { DatabaseProvider } from './database.provider'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

export abstract class BaseRepository<T extends ObjectLiteral> {
  constructor(
    protected readonly entity: EntityTarget<T>,
    protected readonly databaseProvider: DatabaseProvider,
  ) {}

  protected get repository(): Repository<T> {
    return this.databaseProvider.getRepository(this.entity)
  }

  getQueryRunner(): QueryRunner | null {
    return this.databaseProvider.getQueryRunner()
  }

  async save(entity: DeepPartial<T>): Promise<T> {
    return this.repository.save(entity)
  }

  async find(options: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options)
  }

  async softDelete(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectId
      | ObjectId[]
      | FindOptionsWhere<T>,
  ): Promise<UpdateResult> {
    return this.repository.softDelete(criteria)
  }

  async update(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectId
      | ObjectId[]
      | FindOptionsWhere<T>,
    entity: QueryDeepPartialEntity<T>,
  ): Promise<UpdateResult> {
    return this.repository.update(criteria, entity)
  }

  async findOne(options: FindOneOptions<T>): Promise<T | null> {
    return this.repository.findOne(options)
  }

  async count(options: FindManyOptions<T>): Promise<number> {
    return this.repository.count(options)
  }

  async countBy(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
  ): Promise<number> {
    return this.repository.countBy(where)
  }

  create(entity: DeepPartial<T>): T {
    return this.repository.create(entity)
  }

  createQueryBuilder(
    alias?: string,
    queryRunner?: QueryRunner,
  ): SelectQueryBuilder<T> {
    return this.repository.createQueryBuilder(alias, queryRunner)
  }
}
