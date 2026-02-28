import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { createTestApp } from '../helpers/app.helper';
import { createProductRequestBuilder as makeProduct } from '../../src/presentation/features/products/testing/create-product-request.builder';

interface ProductResponse {
  data: Array<Record<string, unknown>>;
  meta: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextCursor: string | null;
    limit: number;
  };
}

describe('GET /api/products', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();

    await Promise.all(
      Array.from({ length: 5 }).map(() =>
        request(app.getHttpServer() as App)
          .post('/api/products')
          .send(makeProduct()),
      ),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return 200 with paginated structure', async () => {
    const res = await request(app.getHttpServer() as App)
      .get('/api/products')
      .expect(200);
    const body = res.body as ProductResponse;

    expect(body).toHaveProperty('data');
    expect(body).toHaveProperty('meta');
    expect(Array.isArray(body.data)).toBe(true);
  });

  it('should return correct meta fields', async () => {
    const res = await request(app.getHttpServer() as App)
      .get('/api/products')
      .expect(200);
    const body = res.body as ProductResponse;

    expect(body.meta).toHaveProperty('hasNextPage');
    expect(body.meta).toHaveProperty('hasPreviousPage');
    expect(body.meta).toHaveProperty('nextCursor');
    expect(body.meta).toHaveProperty('limit');
  });

  it('should return correct product fields', async () => {
    const res = await request(app.getHttpServer() as App)
      .get('/api/products')
      .expect(200);
    const body = res.body as ProductResponse;

    const product = body.data[0];
    expect(product).toHaveProperty('id');
    expect(product).toHaveProperty('name');
    expect(product).toHaveProperty('description');
    expect(product).toHaveProperty('price');
  });

  it('should respect the limit param', async () => {
    const res = await request(app.getHttpServer() as App)
      .get('/api/products?limit=2')
      .expect(200);
    const body = res.body as ProductResponse;

    expect(body.data.length).toBeLessThanOrEqual(2);
    expect(body.meta.limit).toBe(2);
  });

  it('should return 400 when limit exceeds 100', async () => {
    await request(app.getHttpServer() as App)
      .get('/api/products?limit=101')
      .expect(400);
  });

  it('should return 400 when limit is zero', async () => {
    await request(app.getHttpServer() as App)
      .get('/api/products?limit=0')
      .expect(400);
  });

  it('should indicate hasPreviousPage false on first page', async () => {
    const res = await request(app.getHttpServer() as App)
      .get('/api/products?limit=2')
      .expect(200);
    const body = res.body as ProductResponse;

    expect(body.meta.hasPreviousPage).toBe(false);
  });

  it('should paginate correctly using cursor', async () => {
    const first = await request(app.getHttpServer() as App)
      .get('/api/products?limit=2')
      .expect(200);
    const firstBody = first.body as ProductResponse;

    const cursor = firstBody.meta.nextCursor;

    if (cursor) {
      const second = await request(app.getHttpServer() as App)
        .get(`/api/products?limit=2&cursor=${cursor}`)
        .expect(200);
      const secondBody = second.body as ProductResponse;

      expect(secondBody.meta.hasPreviousPage).toBe(true);
      expect(secondBody.data.length).toBeGreaterThanOrEqual(0);
    }
  });

  it('should return hasNextPage true when there are more items', async () => {
    const res = await request(app.getHttpServer() as App)
      .get('/api/products?limit=1')
      .expect(200);
    const body = res.body as ProductResponse;

    expect(body.meta.hasNextPage).toBe(true);
  });
});
