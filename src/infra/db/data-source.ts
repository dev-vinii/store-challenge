import { DataSource } from 'typeorm'

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'store_challenge',
  entities: ['src/infra/db/common/entities/postgres/*.ts'],
  migrations: ['src/infra/db/migrations/*.ts'],
  migrationsTableName: 'migrations',
  synchronize: false,
  logging: true,
})

export default AppDataSource
