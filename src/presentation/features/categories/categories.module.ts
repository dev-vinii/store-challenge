import { Module } from '@nestjs/common';
import { CategoriesControllers } from './adapters/http';
import { CategoriesUseCases } from './use-cases';

@Module({
  imports: [],
  controllers: [...CategoriesControllers],
  providers: [...CategoriesUseCases],
  exports: [],
})
export class CategoryModule {}
