import { Module } from '@nestjs/common';
import { CategoriesControllers } from './adapters/http';
import { CategoriesRepository } from './categories.repository';
import { CategoriesUseCases } from './use-cases';

@Module({
  controllers: [...CategoriesControllers],
  providers: [CategoriesRepository, ...CategoriesUseCases],
  exports: [...CategoriesUseCases],
})
export class CategoryModule {}
