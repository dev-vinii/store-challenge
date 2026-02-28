import { CategoriesRepository } from '../categories.repository';
import { categoryEntityBuilder } from '../testing/category-entity.builder';
import { FindAllCategoryUseCase } from './find-all-category.use-case';

describe('FindAllCategoryUseCase', () => {
  let useCase: FindAllCategoryUseCase;
  let categoriesRepository: jest.Mocked<Pick<CategoriesRepository, 'find'>>;

  beforeEach(() => {
    categoriesRepository = { find: jest.fn() };
    useCase = new FindAllCategoryUseCase(
      categoriesRepository as unknown as CategoriesRepository,
    );
  });

  it('should return all categories mapped to response DTO', async () => {
    const category1 = categoryEntityBuilder();
    const category2 = categoryEntityBuilder();
    categoriesRepository.find.mockResolvedValue([category1, category2]);

    const result = await useCase.execute();

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      id: category1.id,
      name: category1.name,
      createdAt: category1.createdAt,
    });
    expect(result[1]).toMatchObject({
      id: category2.id,
      name: category2.name,
      createdAt: category2.createdAt,
    });
  });

  it('should return empty array when no categories exist', async () => {
    categoriesRepository.find.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toHaveLength(0);
  });

  it('should query only id, name and createdAt fields', async () => {
    categoriesRepository.find.mockResolvedValue([]);

    await useCase.execute();

    expect(categoriesRepository.find).toHaveBeenCalledWith({
      select: { id: true, name: true, createdAt: true },
    });
  });

  it('should propagate errors from the repository', async () => {
    categoriesRepository.find.mockRejectedValue(new Error('DB error'));

    await expect(useCase.execute()).rejects.toThrow('DB error');
  });
});
