import { createProductRequestBuilder } from '../testing/create-product-request.builder';
import { ProductsQueueService } from '../products-queue.service';
import { ProductsRepository } from '../products.repository';
import { productEntityBuilder } from '../testing/product-entity.builder';
import { CreateProductUseCase } from './create-product.use-case';

describe('CreateProductUseCase', () => {
  let useCase: CreateProductUseCase;
  let productsRepository: jest.Mocked<Pick<ProductsRepository, 'save'>>;
  let productsQueueService: jest.Mocked<
    Pick<ProductsQueueService, 'addIndexJob'>
  >;

  beforeEach(() => {
    productsRepository = { save: jest.fn() };
    productsQueueService = { addIndexJob: jest.fn() };
    useCase = new CreateProductUseCase(
      productsRepository as unknown as ProductsRepository,
      productsQueueService as unknown as ProductsQueueService,
    );
  });

  it('should save the product to the repository', async () => {
    const request = createProductRequestBuilder();
    const saved = productEntityBuilder();
    productsRepository.save.mockResolvedValue(saved);
    productsQueueService.addIndexJob.mockResolvedValue(undefined);

    await useCase.execute(request);

    expect(productsRepository.save).toHaveBeenCalledWith(request);
  });

  it('should enqueue an index job with the saved entity', async () => {
    const saved = productEntityBuilder();
    productsRepository.save.mockResolvedValue(saved);
    productsQueueService.addIndexJob.mockResolvedValue(undefined);

    await useCase.execute(createProductRequestBuilder());

    expect(productsQueueService.addIndexJob).toHaveBeenCalledWith(saved);
  });

  it('should propagate errors from the repository', async () => {
    productsRepository.save.mockRejectedValue(new Error('DB error'));

    await expect(
      useCase.execute(createProductRequestBuilder()),
    ).rejects.toThrow('DB error');
  });

  it('should propagate errors from the queue service', async () => {
    productsRepository.save.mockResolvedValue(productEntityBuilder());
    productsQueueService.addIndexJob.mockRejectedValue(
      new Error('Queue error'),
    );

    await expect(
      useCase.execute(createProductRequestBuilder()),
    ).rejects.toThrow('Queue error');
  });
});
