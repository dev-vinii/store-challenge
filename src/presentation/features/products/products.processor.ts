import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ProductEntity } from 'src/infra/db/common/entities/postgres/product.entity';
import { Queue } from 'src/infra/queue/common/queue.enum';
import { SearchProvider } from 'src/infra/search/search.provider';

@Processor(Queue.PRODUCTS)
export class ProductsProcessor extends WorkerHost {
  constructor(private readonly searchProvider: SearchProvider) {
    super();
  }

  async process(job: Job<ProductEntity>): Promise<void> {
    const { id, ...document } = job.data;

    await this.searchProvider.getClient().index({
      index: Queue.PRODUCTS,
      id,
      document,
    });
  }
}
