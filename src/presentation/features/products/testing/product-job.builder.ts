import { Job } from 'bullmq';
import { ProductEntity } from 'src/infra/db/common/entities/postgres/product.entity';
import { productEntityBuilder } from './product-entity.builder';

export function productJobBuilder(): Job<ProductEntity> {
  const job = Object.create(Job.prototype) as Job<ProductEntity>;
  job.data = productEntityBuilder();
  return job;
}
