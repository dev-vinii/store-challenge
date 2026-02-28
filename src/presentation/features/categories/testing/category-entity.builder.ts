import { faker } from '@faker-js/faker';
import { CategoryEntity } from 'src/infra/db/common/entities/postgres/category.entity';

export function categoryEntityBuilder(): CategoryEntity {
  return Object.assign(new CategoryEntity(), {
    id: faker.string.uuid(),
    name: faker.commerce.department(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    deletedAt: null,
  });
}
