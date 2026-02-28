import { Test, TestingModule } from '@nestjs/testing';
import { PaginatedResponse } from 'src/presentation/common/factories/pagination.factory';
import { FindAllSalesUseCase } from '../../use-cases/find-all-sales.use-case';
import { SaleGetController } from './sale.get.controller';

describe('SaleGetController', () => {
  let controller: SaleGetController;
  const findAllExecuteFn = jest.fn();

  const paginatedResult = PaginatedResponse.create([], 10, null, null, false);

  beforeEach(async () => {
    findAllExecuteFn.mockReset();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SaleGetController],
      providers: [
        {
          provide: FindAllSalesUseCase,
          useValue: { execute: findAllExecuteFn },
        },
      ],
    }).compile();

    controller = module.get(SaleGetController);
  });

  describe('findAll (GET /sales)', () => {
    it('should delegate to FindAllSalesUseCase', async () => {
      findAllExecuteFn.mockResolvedValue(paginatedResult);

      await controller.findAll({ limit: 10, cursor: '' });

      expect(findAllExecuteFn).toHaveBeenCalledWith({
        limit: 10,
        cursor: '',
      });
    });

    it('should return the paginated response from the use case', async () => {
      findAllExecuteFn.mockResolvedValue(paginatedResult);

      const result = await controller.findAll({ limit: 10, cursor: '' });

      expect(result).toBe(paginatedResult);
    });

    it('should pass cursor to the use case', async () => {
      findAllExecuteFn.mockResolvedValue(paginatedResult);

      await controller.findAll({ limit: 5, cursor: 'abc' });

      expect(findAllExecuteFn).toHaveBeenCalledWith({
        limit: 5,
        cursor: 'abc',
      });
    });
  });
});
