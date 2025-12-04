import { Injectable } from '@nestjs/common'
import { CreateProductRequest } from '../dto/request/create-product.request'
import { ProductsRepository } from '../products.repository'

@Injectable()
export class CreateProductUseCase {
  constructor(private readonly productRepository: ProductsRepository) {}

  async execute(product: CreateProductRequest): Promise<void> {
    await this.productRepository.save(product)
  }
}
