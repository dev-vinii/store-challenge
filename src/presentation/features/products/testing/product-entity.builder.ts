import { faker } from '@faker-js/faker';
import { ProductEntity } from 'src/infra/db/common/entities/postgres/product.entity';

const TAGS = ['gaming', 'electronics', 'sale', 'new', 'featured', 'popular'];

export function productEntityBuilder(): ProductEntity {
  return Object.assign(new ProductEntity(), {
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    category: faker.commerce.department(),
    price: faker.number.int({ min: 100, max: 100000 }),
    stock: faker.number.int({ min: 0, max: 500 }),
    tags: faker.helpers.arrayElements(TAGS),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  });
}
