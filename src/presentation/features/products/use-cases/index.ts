import { CreateProductUseCase } from './create-product.use-case';
import { FindAllProductsUseCase } from './find-all-products.use-case';

export { CreateProductUseCase, FindAllProductsUseCase };

export const ProductsUseCases = [CreateProductUseCase, FindAllProductsUseCase];
