import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from '../helpers/app.helper';
import { makeProduct } from '../helpers/product.helper';

describe('GET /api/products', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();

    await Promise.all(
      Array.from({ length: 5 }).map(() =>
        request(app.getHttpServer()).post('/api/products').send(makeProduct()),
      ),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return 200 with paginated structure', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/products')
      .expect(200);

    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('meta');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should return correct meta fields', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/products')
      .expect(200);

    expect(res.body.meta).toHaveProperty('hasNextPage');
    expect(res.body.meta).toHaveProperty('hasPreviousPage');
    expect(res.body.meta).toHaveProperty('nextCursor');
    expect(res.body.meta).toHaveProperty('limit');
  });

  it('should return correct product fields', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/products')
      .expect(200);

    const product = res.body.data[0];
    expect(product).toHaveProperty('id');
    expect(product).toHaveProperty('name');
    expect(product).toHaveProperty('description');
    expect(product).toHaveProperty('price');
  });

  it('should respect the limit param', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/products?limit=2')
      .expect(200);

    expect(res.body.data.length).toBeLessThanOrEqual(2);
    expect(res.body.meta.limit).toBe(2);
  });

  it('should return 400 when limit exceeds 100', async () => {
    await request(app.getHttpServer())
      .get('/api/products?limit=101')
      .expect(400);
  });

  it('should return 400 when limit is zero', async () => {
    await request(app.getHttpServer()).get('/api/products?limit=0').expect(400);
  });

  it('should indicate hasPreviousPage false on first page', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/products?limit=2')
      .expect(200);

    expect(res.body.meta.hasPreviousPage).toBe(false);
  });

  it('should paginate correctly using cursor', async () => {
    const first = await request(app.getHttpServer())
      .get('/api/products?limit=2')
      .expect(200);

    const cursor = first.body.meta.nextCursor;

    if (cursor) {
      const second = await request(app.getHttpServer())
        .get(`/api/products?limit=2&cursor=${cursor}`)
        .expect(200);

      expect(second.body.meta.hasPreviousPage).toBe(true);
      expect(second.body.data.length).toBeGreaterThanOrEqual(0);
    }
  });

  it('should return hasNextPage true when there are more items', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/products?limit=1')
      .expect(200);

    expect(res.body.meta.hasNextPage).toBe(true);
  });
});
