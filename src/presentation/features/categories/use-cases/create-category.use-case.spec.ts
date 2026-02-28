import { CategoriesRepository } from '../categories.repository';
import { createCategoryRequestBuilder } from '../testing/create-category-request.builder';
import { CreateCategoryUseCase } from './create-category.use-case';

describe('CreateCategoryUseCase', () => {
  let useCase: CreateCategoryUseCase;
  let categoriesRepository: jest.Mocked<Pick<CategoriesRepository, 'save'>>;

  beforeEach(() => {
    categoriesRepository = { save: jest.fn() };
    useCase = new CreateCategoryUseCase(
      categoriesRepository as unknown as CategoriesRepository,
    );
  });

  it('should call repository save with the provided category', async () => {
    const request = createCategoryRequestBuilder();
    categoriesRepository.save.mockResolvedValue(undefined as never);

    await useCase.execute(request);

    expect(categoriesRepository.save).toHaveBeenCalledWith(request);
    expect(categoriesRepository.save).toHaveBeenCalledTimes(1);
  });

  it('should propagate errors from the repository', async () => {
    categoriesRepository.save.mockRejectedValue(new Error('DB error'));

    await expect(
      useCase.execute(createCategoryRequestBuilder()),
    ).rejects.toThrow('DB error');
  });
});
