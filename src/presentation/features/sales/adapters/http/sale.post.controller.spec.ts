import { Test, TestingModule } from '@nestjs/testing';
import { createSaleRequestBuilder } from '../../testing/create-sale-request.builder';
import { CreateSaleUseCase } from '../../use-cases/create-sale.use-case';
import { SalePostController } from './sale.post.controller';

describe('SalePostController', () => {
  let controller: SalePostController;
  const createExecuteFn = jest.fn();

  beforeEach(async () => {
    createExecuteFn.mockReset();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalePostController],
      providers: [
        {
          provide: CreateSaleUseCase,
          useValue: { execute: createExecuteFn },
        },
      ],
    }).compile();

    controller = module.get(SalePostController);
  });

  describe('create (POST /sales)', () => {
    it('should delegate to CreateSaleUseCase', async () => {
      const request = createSaleRequestBuilder();
      createExecuteFn.mockResolvedValue(undefined);

      await controller.create(request);

      expect(createExecuteFn).toHaveBeenCalledWith(request);
    });

    it('should return void', async () => {
      createExecuteFn.mockResolvedValue(undefined);

      const result = await controller.create(createSaleRequestBuilder());

      expect(result).toBeUndefined();
    });

    it('should propagate errors from the use case', async () => {
      createExecuteFn.mockRejectedValue(new Error('DB error'));

      await expect(
        controller.create(createSaleRequestBuilder()),
      ).rejects.toThrow('DB error');
    });
  });
});
