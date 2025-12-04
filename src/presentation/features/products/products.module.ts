import { Module } from '@nestjs/common'
import { ProductControllers } from './adapters/http/index'
import { ProductsRepository } from './products.repository'
import { ProductsUseCases } from './use-cases'

@Module({
  imports: [],
  controllers: [...ProductControllers],
  providers: [...ProductsUseCases, ProductsRepository],
  exports: [...ProductsUseCases, ProductsRepository],
})
export class ProductModule {}
