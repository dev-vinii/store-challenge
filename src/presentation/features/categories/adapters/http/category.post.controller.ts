import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCategoryRequest } from '../../dto/request/create-category.request';
import { CreateCategoryUseCase } from '../../use-cases/create-category.use-case';

@ApiTags('Categories')
@Controller('categories')
export class CategoryPostController {
  constructor(private readonly createCategoryUseCase: CreateCategoryUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new category' })
  @ApiBody({ type: CreateCategoryRequest })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  async create(@Body() category: CreateCategoryRequest): Promise<void> {
    await this.createCategoryUseCase.execute(category);
  }
}
