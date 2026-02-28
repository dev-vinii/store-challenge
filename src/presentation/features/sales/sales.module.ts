import { Module } from '@nestjs/common';
import { ProductModule } from '../products/products.module';
import { SaleControllers } from './adapters/http';
import { SalesRepository } from './sales.repository';
import { SalesUseCases } from './use-cases';

@Module({
  imports: [ProductModule],
  controllers: [...SaleControllers],
  providers: [...SalesUseCases, SalesRepository],
  exports: [...SalesUseCases],
})
export class SaleModule {}
