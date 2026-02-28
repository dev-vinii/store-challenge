import { faker } from '@faker-js/faker';

export function makeCategory(overrides = {}) {
  return {
    name: faker.commerce.department(),
    ...overrides,
  };
}
