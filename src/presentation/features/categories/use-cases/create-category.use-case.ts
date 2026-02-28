import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from '../categories.repository';
import { CreateCategoryRequest } from '../dto/request/create-category.request';

@Injectable()
export class CreateCategoryUseCase {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async execute(category: CreateCategoryRequest) {
    await this.categoriesRepository.save(category);
  }
}
