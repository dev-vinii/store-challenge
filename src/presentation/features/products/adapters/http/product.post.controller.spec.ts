import { Test, TestingModule } from '@nestjs/testing';
import { createProductRequestBuilder } from '../../testing/create-product-request.builder';
import { CreateProductUseCase } from '../../use-cases/create-product.use-case';
import { ProductPostController } from './product.post.controller';

describe('ProductPostController', () => {
  let controller: ProductPostController;
  const createExecuteFn = jest.fn();

  beforeEach(async () => {
    createExecuteFn.mockReset();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductPostController],
      providers: [
        {
          provide: CreateProductUseCase,
          useValue: { execute: createExecuteFn },
        },
      ],
    }).compile();

    controller = module.get(ProductPostController);
  });

  describe('create (POST /products)', () => {
    const product = createProductRequestBuilder();

    it('should delegate to CreateProductUseCase', async () => {
      createExecuteFn.mockResolvedValue(undefined);

      await controller.create(product);

      expect(createExecuteFn).toHaveBeenCalledWith(product);
    });

    it('should return the result from the use case', async () => {
      createExecuteFn.mockResolvedValue(undefined);

      const result = await controller.create(product);

      expect(result).toBeUndefined();
    });

    it('should propagate errors from the use case', async () => {
      createExecuteFn.mockRejectedValue(new Error('DB error'));

      await expect(controller.create(product)).rejects.toThrow('DB error');
    });
  });
});
