import { NotFoundException } from '@nestjs/common';
import { ProductsRepository } from '../../products/products.repository';
import { productEntityBuilder } from '../../products/testing/product-entity.builder';
import { SalesRepository } from '../sales.repository';
import { createSaleRequestBuilder } from '../testing/create-sale-request.builder';
import { CreateSaleUseCase } from './create-sale.use-case';

describe('CreateSaleUseCase', () => {
  let useCase: CreateSaleUseCase;
  let salesRepository: jest.Mocked<Pick<SalesRepository, 'save'>>;
  let productsRepository: jest.Mocked<Pick<ProductsRepository, 'findOne'>>;

  beforeEach(() => {
    salesRepository = { save: jest.fn() };
    productsRepository = { findOne: jest.fn() };
    useCase = new CreateSaleUseCase(
      salesRepository as unknown as SalesRepository,
      productsRepository as unknown as ProductsRepository,
    );
  });

  it('should save the sale with correct price from product', async () => {
    const product = productEntityBuilder();
    const request = createSaleRequestBuilder({ productId: product.id });
    productsRepository.findOne.mockResolvedValue(product);
    salesRepository.save.mockResolvedValue(undefined as never);

    await useCase.execute(request);

    expect(salesRepository.save).toHaveBeenCalledWith({
      productId: product.id,
      quantity: request.quantity,
      unitPrice: product.price,
      totalPrice: product.price * request.quantity,
    });
  });

  it('should throw NotFoundException when product does not exist', async () => {
    productsRepository.findOne.mockResolvedValue(null);

    await expect(useCase.execute(createSaleRequestBuilder())).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should look up the product by productId', async () => {
    const request = createSaleRequestBuilder();
    const product = productEntityBuilder();
    productsRepository.findOne.mockResolvedValue(product);
    salesRepository.save.mockResolvedValue(undefined as never);

    await useCase.execute(request);

    expect(productsRepository.findOne).toHaveBeenCalledWith({
      where: { id: request.productId },
    });
  });

  it('should propagate errors from the repository', async () => {
    productsRepository.findOne.mockRejectedValue(new Error('DB error'));

    await expect(useCase.execute(createSaleRequestBuilder())).rejects.toThrow(
      'DB error',
    );
  });
});
