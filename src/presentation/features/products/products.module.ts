import { Module } from '@nestjs/common'
import { ProductsRepository } from '../sales/products.repository'
import { ProductControllers } from './adapters/http/index'
import { ProductsUseCases } from './use-cases'

@Module({
  imports: [],
  controllers: [...ProductControllers],
  providers: [...ProductsUseCases, ProductsRepository],
  exports: [...ProductsUseCases, ProductsRepository],
})
export class ProductModule {}
