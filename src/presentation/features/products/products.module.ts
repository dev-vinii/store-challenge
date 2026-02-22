import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { Queue } from 'src/infra/queue/common/queue.enum';
import { ProductControllers } from './adapters/http/index';
import { ProductsQueueService } from './products-queue.service';
import { ProductsProcessor } from './products.processor';
import { ProductsRepository } from './products.repository';
import { ProductsUseCases } from './use-cases';

@Module({
  imports: [BullModule.registerQueue({ name: Queue.PRODUCTS })],
  controllers: [...ProductControllers],
  providers: [
    ...ProductsUseCases,
    ProductsRepository,
    ProductsProcessor,
    ProductsQueueService,
  ],
  exports: [...ProductsUseCases, ProductsRepository],
})
export class ProductModule {}
