import { Body, Controller, Post } from '@nestjs/common'
import { CreateProductRequest } from '../../dto/request/create-product.request'
import { CreateProductUseCase } from '../../use-cases/create-product.use-case'

@Controller('products')
export class ProductPostController {
  constructor(private readonly createProductUseCase: CreateProductUseCase) {}

  @Post()
  async create(@Body() product: CreateProductRequest): Promise<void> {
    return this.createProductUseCase.execute(product)
  }
}
