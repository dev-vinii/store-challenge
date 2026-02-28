import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { createCategoryRequestBuilder } from '../../testing/create-category-request.builder';
import { FindAllCategoriesResponse } from '../../dto/response/find-all-categories.response';
import { CreateCategoryUseCase } from '../../use-cases/create-category.use-case';
import { FindAllCategoryUseCase } from '../../use-cases/find-all-category.use-case';
import { CategoryGetController } from './category.get.controller';
import { CategoryPostController } from './category.post.controller';

describe('CategoryPostController', () => {
  let controller: CategoryPostController;
  const createExecuteFn = jest.fn();

  beforeEach(async () => {
    createExecuteFn.mockReset();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryPostController],
      providers: [
        {
          provide: CreateCategoryUseCase,
          useValue: { execute: createExecuteFn },
        },
      ],
    }).compile();

    controller = module.get(CategoryPostController);
  });

  describe('create (POST /categories)', () => {
    it('should delegate to CreateCategoryUseCase', async () => {
      const request = createCategoryRequestBuilder();

      await controller.create(request);

      expect(createExecuteFn).toHaveBeenCalledWith(request);
    });

    it('should return void', async () => {
      const result = await controller.create(createCategoryRequestBuilder());

      expect(result).toBeUndefined();
    });
  });
});

describe('CategoryGetController', () => {
  let controller: CategoryGetController;
  const findAllExecuteFn = jest.fn();

  const categories: FindAllCategoriesResponse[] = [
    {
      id: faker.string.uuid(),
      name: faker.commerce.department(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
    },
    {
      id: faker.string.uuid(),
      name: faker.commerce.department(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
    },
  ];

  beforeEach(async () => {
    findAllExecuteFn.mockReset();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryGetController],
      providers: [
        {
          provide: FindAllCategoryUseCase,
          useValue: { execute: findAllExecuteFn },
        },
      ],
    }).compile();

    controller = module.get(CategoryGetController);
  });

  describe('findAll (GET /categories)', () => {
    it('should delegate to FindAllCategoryUseCase with no arguments', async () => {
      findAllExecuteFn.mockResolvedValue(categories);

      await controller.findAll();

      expect(findAllExecuteFn).toHaveBeenCalledTimes(1);
      expect(findAllExecuteFn).toHaveBeenCalledWith();
    });

    it('should return the list of categories from the use case', async () => {
      findAllExecuteFn.mockResolvedValue(categories);

      const result = await controller.findAll();

      expect(result).toBe(categories);
    });

    it('should return empty array when no categories exist', async () => {
      findAllExecuteFn.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });
});
