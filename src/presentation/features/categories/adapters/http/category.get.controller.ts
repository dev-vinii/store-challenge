import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindAllCategoryUseCase } from '../../use-cases/find-all-category.use-case';

@ApiTags('Categories')
@Controller('categories')
export class CategoryGetController {
  constructor(
    private readonly findAllCategoriesUseCase: FindAllCategoryUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all categories' })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
  })
  async findAll() {
    return this.findAllCategoriesUseCase.execute();
  }
}
