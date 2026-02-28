import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from '../../products/products.repository';
import { CreateSaleRequest } from '../dto/request/create-sale.request';
import { SalesRepository } from '../sales.repository';

@Injectable()
export class CreateSaleUseCase {
  constructor(
    private readonly salesRepository: SalesRepository,
    private readonly productsRepository: ProductsRepository,
  ) {}

  async execute(sale: CreateSaleRequest): Promise<void> {
    const product = await this.productsRepository.findOne({
      where: { id: sale.productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.salesRepository.save({
      productId: sale.productId,
      quantity: sale.quantity,
      unitPrice: product.price,
      totalPrice: product.price * sale.quantity,
    });
  }
}
