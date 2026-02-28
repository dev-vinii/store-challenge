import { faker } from '@faker-js/faker';

export function createSaleRequestBuilder(overrides = {}) {
  return {
    productId: faker.string.uuid(),
    quantity: faker.number.int({ min: 1, max: 20 }),
    ...overrides,
  };
}
