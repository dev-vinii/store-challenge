import { faker } from '@faker-js/faker';

export function createCategoryRequestBuilder(overrides = {}) {
  return {
    name: faker.commerce.department(),
    ...overrides,
  };
}
