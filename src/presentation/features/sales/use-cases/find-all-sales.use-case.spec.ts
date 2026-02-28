import { SalesRepository } from '../sales.repository';
import { saleEntityBuilder } from '../testing/sale-entity.builder';
import { FindAllSalesUseCase } from './find-all-sales.use-case';

describe('FindAllSalesUseCase', () => {
  let useCase: FindAllSalesUseCase;
  let salesRepository: jest.Mocked<Pick<SalesRepository, 'findPaginated'>>;

  beforeEach(() => {
    salesRepository = { findPaginated: jest.fn() };
    useCase = new FindAllSalesUseCase(
      salesRepository as unknown as SalesRepository,
    );
  });

  it('should return paginated response with data and meta', async () => {
    salesRepository.findPaginated.mockResolvedValue([
      saleEntityBuilder(),
      saleEntityBuilder(),
    ]);

    const result = await useCase.execute({ limit: 10, cursor: '' });

    expect(result.data).toHaveLength(2);
    expect(result.meta).toHaveProperty('hasNextPage');
    expect(result.meta).toHaveProperty('hasPreviousPage');
    expect(result.meta).toHaveProperty('nextCursor');
    expect(result.meta).toHaveProperty('limit');
  });

  it('should set hasNextPage true when repository returns limit+1 items', async () => {
    salesRepository.findPaginated.mockResolvedValue([
      saleEntityBuilder(),
      saleEntityBuilder(),
      saleEntityBuilder(),
    ]);

    const result = await useCase.execute({ limit: 2, cursor: '' });

    expect(result.meta.hasNextPage).toBe(true);
    expect(result.data).toHaveLength(2);
  });

  it('should set hasNextPage false when no extra items returned', async () => {
    salesRepository.findPaginated.mockResolvedValue([
      saleEntityBuilder(),
      saleEntityBuilder(),
    ]);

    const result = await useCase.execute({ limit: 10, cursor: '' });

    expect(result.meta.hasNextPage).toBe(false);
  });

  it('should set hasPreviousPage true when cursor is provided', async () => {
    const cursor = saleEntityBuilder().id;
    salesRepository.findPaginated.mockResolvedValue([saleEntityBuilder()]);

    const result = await useCase.execute({ limit: 10, cursor });

    expect(result.meta.hasPreviousPage).toBe(true);
  });

  it('should set hasPreviousPage false on first page (no cursor)', async () => {
    salesRepository.findPaginated.mockResolvedValue([saleEntityBuilder()]);

    const result = await useCase.execute({ limit: 10, cursor: '' });

    expect(result.meta.hasPreviousPage).toBe(false);
  });

  it('should return meta.limit matching the requested limit', async () => {
    salesRepository.findPaginated.mockResolvedValue([saleEntityBuilder()]);

    const result = await useCase.execute({ limit: 5, cursor: '' });

    expect(result.meta.limit).toBe(5);
  });

  it('should return empty data array when no sales found', async () => {
    salesRepository.findPaginated.mockResolvedValue([]);

    const result = await useCase.execute({ limit: 10, cursor: '' });

    expect(result.data).toHaveLength(0);
    expect(result.meta.hasNextPage).toBe(false);
    expect(result.meta.nextCursor).toBeNull();
  });

  it('should pass cursor and limit to the repository', async () => {
    const cursor = saleEntityBuilder().id;
    salesRepository.findPaginated.mockResolvedValue([]);

    await useCase.execute({ limit: 5, cursor });

    expect(salesRepository.findPaginated).toHaveBeenCalledWith({
      limit: 5,
      cursor,
    });
  });
});
