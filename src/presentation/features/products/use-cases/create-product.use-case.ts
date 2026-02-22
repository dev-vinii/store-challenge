import { Injectable } from '@nestjs/common';
import { CreateProductRequest } from '../dto/request/create-product.request';
import { ProductsQueueService } from '../products-queue.service';
import { ProductsRepository } from '../products.repository';

@Injectable()
export class CreateProductUseCase {
  constructor(
    private readonly productRepository: ProductsRepository,
    private readonly productsQueueService: ProductsQueueService,
  ) {}

  async execute(product: CreateProductRequest): Promise<void> {
    const productEntity = await this.productRepository.save(product);

    await this.productsQueueService.addIndexJob(productEntity);
  }
}
