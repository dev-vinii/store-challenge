import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Observable, from, lastValueFrom } from 'rxjs'
import { DatabaseProvider } from '../database.provider'

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private readonly databaseProvider: DatabaseProvider) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return from(
      (async () => {
        await this.databaseProvider.startTransaction()
        try {
          const result = await lastValueFrom(next.handle())
          await this.databaseProvider.commitTransaction()
          return result
        } catch (error) {
          await this.databaseProvider.rollbackTransaction()
          throw error
        } finally {
          await this.databaseProvider.endTransaction()
        }
      })(),
    )
  }
}
