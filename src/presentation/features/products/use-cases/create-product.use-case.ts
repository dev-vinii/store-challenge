import { Injectable } from '@nestjs/common'
import { ProductsRepository } from '../../sales/products.repository'
import { CreateProductRequest } from '../dto/request/create-product.request'

@Injectable()
export class CreateProductUseCase {
  constructor(private readonly productRepository: ProductsRepository) {}

  async execute(product: CreateProductRequest): Promise<void> {
    await this.productRepository.save(product)
  }
}
