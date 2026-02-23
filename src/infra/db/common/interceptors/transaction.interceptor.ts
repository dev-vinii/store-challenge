import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, from, lastValueFrom } from 'rxjs';
import { DatabaseProvider } from '../database.provider';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private readonly databaseProvider: DatabaseProvider) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return from(
      (async () => {
        await this.databaseProvider.startTransaction();
        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const result = await lastValueFrom(next.handle());
          await this.databaseProvider.commitTransaction();
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return result;
        } catch (error) {
          await this.databaseProvider.rollbackTransaction();
          throw error;
        } finally {
          await this.databaseProvider.endTransaction();
        }
      })(),
    );
  }
}
