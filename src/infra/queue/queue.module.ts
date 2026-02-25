import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { Queue } from './common/queue.enum';

@Global()
@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
      },
    }),
    BullModule.registerQueue({
      name: Queue.PRODUCTS,
      defaultJobOptions: {
        attempts: 3,
        backoff: 1000,
      },
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
