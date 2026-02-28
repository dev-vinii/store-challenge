import { SearchTotalHits } from '@elastic/elasticsearch/lib/api/types';
import { Test, TestingModule } from '@nestjs/testing';
import { PaginatedResponse } from 'src/presentation/common/factories/pagination.factory';
import { SearchProductsRequest } from '../../dto/request/search-products.request';
import { FindAllProductsUseCase } from '../../use-cases/find-all-products.use-case';
import { SearchProductsUseCase } from '../../use-cases/search-products.use-case';
import { ProductGetController } from './product.get.controller';

describe('ProductGetController', () => {
  let controller: ProductGetController;
  const findAllExecuteFn = jest.fn();
  const searchExecuteFn = jest.fn();

  const paginatedResult = PaginatedResponse.create([], 10, null, null, false);
  const searchResult = {
    data: [],
    meta: {
      total: { value: 0, relation: 'eq' } as SearchTotalHits,
      limit: 10,
      searchAfter: null,
    },
  };

  beforeEach(async () => {
    findAllExecuteFn.mockReset();
    searchExecuteFn.mockReset();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductGetController],
      providers: [
        {
          provide: FindAllProductsUseCase,
          useValue: { execute: findAllExecuteFn },
        },
        {
          provide: SearchProductsUseCase,
          useValue: { execute: searchExecuteFn },
        },
      ],
    }).compile();

    controller = module.get(ProductGetController);
  });

  describe('findAll (GET /products)', () => {
    it('should delegate to FindAllProductsUseCase', async () => {
      findAllExecuteFn.mockResolvedValue(paginatedResult);

      await controller.create({ limit: 10, cursor: '' });

      expect(findAllExecuteFn).toHaveBeenCalledWith({
        limit: 10,
        cursor: '',
      });
    });

    it('should return the paginated response from the use case', async () => {
      findAllExecuteFn.mockResolvedValue(paginatedResult);

      const result = await controller.create({ limit: 10, cursor: '' });

      expect(result).toBe(paginatedResult);
    });

    it('should pass cursor to the use case', async () => {
      findAllExecuteFn.mockResolvedValue(paginatedResult);

      await controller.create({ limit: 5, cursor: 'abc' });

      expect(findAllExecuteFn).toHaveBeenCalledWith({
        limit: 5,
        cursor: 'abc',
      });
    });
  });

  describe('search (GET /products/search)', () => {
    it('should delegate to SearchProductsUseCase', async () => {
      searchExecuteFn.mockResolvedValue(searchResult);
      const query: SearchProductsRequest = { limit: 10 };

      await controller.search(query);

      expect(searchExecuteFn).toHaveBeenCalledWith(query);
    });

    it('should return the search result from the use case', async () => {
      searchExecuteFn.mockResolvedValue(searchResult);

      const result = await controller.search({ limit: 10 });

      expect(result).toBe(searchResult);
    });

    it('should pass all search filters to the use case', async () => {
      searchExecuteFn.mockResolvedValue(searchResult);
      const query: SearchProductsRequest = {
        q: 'nike',
        category: 'shoes',
        minPrice: 100,
        limit: 5,
      };

      await controller.search(query);

      expect(searchExecuteFn).toHaveBeenCalledWith(query);
    });
  });
});
