import { faker } from '@faker-js/faker';

export const makeProduct = (overrides = {}) => ({
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  category: faker.commerce.department(),
  price: faker.number.int({ min: 100, max: 100000 }),
  stock: faker.number.int({ min: 1, max: 100 }),
  tags: faker.helpers.arrayElements(['sale', 'new', 'featured', 'limited'], 2),
  ...overrides,
});
