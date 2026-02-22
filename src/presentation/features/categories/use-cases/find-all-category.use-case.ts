import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CategoriesRepository } from '../categories.repository';
import { FindAllCategoriesResponse } from '../dto/response/find-all-categories.response';

@Injectable()
export class FindAllCategoryUseCase {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async execute() {
    const results = await this.categoriesRepository.find({
      select: { id: true, name: true, createdAt: true },
    });

    return plainToInstance(FindAllCategoriesResponse, results);
  }
}
