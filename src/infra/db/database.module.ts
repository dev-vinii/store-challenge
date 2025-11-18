import { Global, Module } from '@nestjs/common'
import { DatabaseProvider, databaseProvider } from './common/database.provider'

@Global()
@Module({
  providers: [
    {
      provide: DatabaseProvider,
      useValue: databaseProvider,
    },
  ],
  exports: [DatabaseProvider],
})
export class DatabaseModule {}
