import {
  DataSource,
  DataSourceOptions,
  EntityTarget,
  ObjectLiteral,
  QueryRunner,
  Repository,
} from 'typeorm';
import { ProductEntity } from './entities/postgres/product.entity';

export interface DatabaseConfig {
  type: 'postgres';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize?: boolean;
  logging?: boolean;
}

export class DatabaseProvider {
  private dataSource: DataSource;
  private queryRunner: QueryRunner | null = null;

  constructor(private readonly config: DatabaseConfig) {
    const dataSourceOptions: DataSourceOptions = {
      type: config.type,
      host: config.host,
      port: config.port,
      username: config.username,
      password: config.password,
      database: config.database,
      entities: [ProductEntity],
      synchronize: config.synchronize ?? false,
      logging: config.logging ?? false,
    };

    this.dataSource = new DataSource(dataSourceOptions);
  }

  async initialize(): Promise<void> {
    if (!this.dataSource.isInitialized) {
      await this.dataSource.initialize();
    }
  }

  async destroy(): Promise<void> {
    if (this.dataSource.isInitialized) {
      await this.dataSource.destroy();
    }
  }

  getDataSource(): DataSource {
    return this.dataSource;
  }

  getRepository<T extends ObjectLiteral>(
    entity: EntityTarget<T>,
  ): Repository<T> {
    return this.dataSource.getRepository(entity);
  }

  async startTransaction(): Promise<void> {
    if (!this.queryRunner) {
      this.queryRunner = this.dataSource.createQueryRunner();
      await this.queryRunner.connect();
    }
    await this.queryRunner.startTransaction();
  }

  async commitTransaction(): Promise<void> {
    if (this.queryRunner) {
      await this.queryRunner.commitTransaction();
    }
  }

  async rollbackTransaction(): Promise<void> {
    if (this.queryRunner) {
      await this.queryRunner.rollbackTransaction();
    }
  }

  async endTransaction(): Promise<void> {
    if (this.queryRunner) {
      await this.queryRunner.release();
      this.queryRunner = null;
    }
  }

  getQueryRunner(): QueryRunner | null {
    return this.queryRunner;
  }
}

export const databaseProvider = new DatabaseProvider({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'store_challenge',
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: process.env.DB_LOGGING === 'true',
});
