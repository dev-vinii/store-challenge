import { faker } from '@faker-js/faker';
import { SaleEntity } from 'src/infra/db/common/entities/postgres/sale.entity';

export function saleEntityBuilder(): SaleEntity {
  const quantity = faker.number.int({ min: 1, max: 20 });
  const unitPrice = faker.number.int({ min: 100, max: 100000 });

  return Object.assign(new SaleEntity(), {
    id: faker.string.uuid(),
    productId: faker.string.uuid(),
    quantity,
    unitPrice,
    totalPrice: unitPrice * quantity,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  });
}
