import { InjectQueue } from '@nestjs/bullmq'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bullmq'
import { ProductEntity } from 'src/infra/db/common/entities/postgres/product.entity'

@Injectable()
export class ProductsQueueService {
  constructor(@InjectQueue('products') private readonly queue: Queue) {}

  async addIndexJob(product: ProductEntity): Promise<void> {
    await this.queue.add('index-product', { ...product })
  }
}
