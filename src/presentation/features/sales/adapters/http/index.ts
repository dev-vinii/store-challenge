import { SaleGetController } from './sale.get.controller';
import { SalePostController } from './sale.post.controller';

export { SaleGetController, SalePostController };

export const SaleControllers = [
  SalePostController,
  SaleGetController,
] as const;
