import { InjectQueue } from '@nestjs/bullmq'
import { Injectable } from '@nestjs/common'
import { Queue as BullQueue } from 'bullmq'
import { ProductEntity } from 'src/infra/db/common/entities/postgres/product.entity'
import { BaseQueueService } from 'src/infra/queue/common/base-queue.service'
import { Queue as QueueEnum } from 'src/infra/queue/common/queue.enum'

@Injectable()
export class ProductsQueueService extends BaseQueueService {
  constructor(@InjectQueue(QueueEnum.PRODUCTS) queue: BullQueue) {
    super(queue)
  }

  async addIndexJob(product: ProductEntity): Promise<void> {
    await this.add('index-product', { ...product })
  }
}
