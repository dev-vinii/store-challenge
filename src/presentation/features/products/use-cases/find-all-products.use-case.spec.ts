import { ProductsRepository } from '../products.repository';
import { productEntityBuilder } from '../testing/product-entity.builder';
import { FindAllProductsUseCase } from './find-all-products.use-case';

describe('FindAllProductsUseCase', () => {
  let useCase: FindAllProductsUseCase;
  let productsRepository: jest.Mocked<
    Pick<ProductsRepository, 'findpaginated'>
  >;

  beforeEach(() => {
    productsRepository = { findpaginated: jest.fn() };
    useCase = new FindAllProductsUseCase(
      productsRepository as unknown as ProductsRepository,
    );
  });

  it('should return paginated response with data and meta', async () => {
    productsRepository.findpaginated.mockResolvedValue([
      productEntityBuilder(),
      productEntityBuilder(),
    ]);

    const result = await useCase.execute({ limit: 10, cursor: '' });

    expect(result.data).toHaveLength(2);
    expect(result.meta).toHaveProperty('hasNextPage');
    expect(result.meta).toHaveProperty('hasPreviousPage');
    expect(result.meta).toHaveProperty('nextCursor');
    expect(result.meta).toHaveProperty('limit');
  });

  it('should set hasNextPage true when repository returns limit+1 items', async () => {
    productsRepository.findpaginated.mockResolvedValue([
      productEntityBuilder(),
      productEntityBuilder(),
      productEntityBuilder(),
    ]);

    const result = await useCase.execute({ limit: 2, cursor: '' });

    expect(result.meta.hasNextPage).toBe(true);
    expect(result.data).toHaveLength(2);
  });

  it('should set hasNextPage false when no extra items returned', async () => {
    productsRepository.findpaginated.mockResolvedValue([
      productEntityBuilder(),
      productEntityBuilder(),
    ]);

    const result = await useCase.execute({ limit: 10, cursor: '' });

    expect(result.meta.hasNextPage).toBe(false);
  });

  it('should set hasPreviousPage true when cursor is provided', async () => {
    const cursor = productEntityBuilder().id;
    productsRepository.findpaginated.mockResolvedValue([
      productEntityBuilder(),
    ]);

    const result = await useCase.execute({ limit: 10, cursor });

    expect(result.meta.hasPreviousPage).toBe(true);
  });

  it('should set hasPreviousPage false on first page (no cursor)', async () => {
    productsRepository.findpaginated.mockResolvedValue([
      productEntityBuilder(),
    ]);

    const result = await useCase.execute({ limit: 10, cursor: '' });

    expect(result.meta.hasPreviousPage).toBe(false);
  });

  it('should return meta.limit matching the requested limit', async () => {
    productsRepository.findpaginated.mockResolvedValue([
      productEntityBuilder(),
    ]);

    const result = await useCase.execute({ limit: 5, cursor: '' });

    expect(result.meta.limit).toBe(5);
  });

  it('should return empty data array when no products found', async () => {
    productsRepository.findpaginated.mockResolvedValue([]);

    const result = await useCase.execute({ limit: 10, cursor: '' });

    expect(result.data).toHaveLength(0);
    expect(result.meta.hasNextPage).toBe(false);
    expect(result.meta.nextCursor).toBeNull();
  });

  it('should pass cursor and limit to the repository', async () => {
    const cursor = productEntityBuilder().id;
    productsRepository.findpaginated.mockResolvedValue([]);

    await useCase.execute({ limit: 5, cursor });

    expect(productsRepository.findpaginated).toHaveBeenCalledWith({
      limit: 5,
      cursor,
    });
  });
});
