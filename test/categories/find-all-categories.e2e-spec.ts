import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { makeCategory } from '../helpers/category.helper';
import { createTestApp } from '../helpers/app.helper';

interface CategoryResponse {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

describe('GET /api/categories', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();

    await Promise.all(
      Array.from({ length: 3 }).map(() =>
        request(app.getHttpServer() as App)
          .post('/api/categories')
          .send(makeCategory()),
      ),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return 200 with an array of categories', async () => {
    const res = await request(app.getHttpServer() as App)
      .get('/api/categories')
      .expect(200);
    const body = res.body as CategoryResponse[];

    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThanOrEqual(3);
  });

  it('should return correct category fields', async () => {
    const res = await request(app.getHttpServer() as App)
      .get('/api/categories')
      .expect(200);
    const body = res.body as CategoryResponse[];

    const category = body[0];
    expect(category).toHaveProperty('id');
    expect(category).toHaveProperty('name');
    expect(category).toHaveProperty('createdAt');
  });

  it('should include a newly created category in the list', async () => {
    const newCategory = makeCategory({ name: 'UniqueTestCategory' });

    await request(app.getHttpServer() as App)
      .post('/api/categories')
      .send(newCategory)
      .expect(201);

    const res = await request(app.getHttpServer() as App)
      .get('/api/categories')
      .expect(200);
    const body = res.body as CategoryResponse[];

    const found = body.find((c) => c.name === 'UniqueTestCategory');
    expect(found).toBeDefined();
  });
});
