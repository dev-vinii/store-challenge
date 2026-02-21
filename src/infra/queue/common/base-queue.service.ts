import { Queue } from 'bullmq'

export abstract class BaseQueueService {
  constructor(protected readonly queue: Queue) {}

  async add<TData = unknown>(jobName: string, data: TData): Promise<void> {
    await this.queue.add(jobName, data)
  }
}
