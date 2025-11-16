import { Module } from '@nestjs/common'
import { ProductsRepository } from '../sales/products.repository'
import { ProductControllers } from './adapters/http/index'
import { CreateProductUseCase } from './use-cases/create-product.use-case'

@Module({
  imports: [],
  controllers: [...ProductControllers],
  providers: [CreateProductUseCase, ProductsRepository],
  exports: [CreateProductUseCase, ProductsRepository],
})
export class ProductModule {}
