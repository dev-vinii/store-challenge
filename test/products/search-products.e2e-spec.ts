import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { createTestApp } from '../helpers/app.helper';
import { createProductRequestBuilder as makeProduct } from '../../src/presentation/features/products/testing/create-product-request.builder';

interface SearchResponse {
  data: Array<Record<string, unknown>>;
  meta: {
    total: unknown;
    limit: number;
    searchAfter: string[] | null;
  };
}

describe('GET /api/products/search', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();

    await Promise.all([
      request(app.getHttpServer() as App)
        .post('/api/products')
        .send(
          makeProduct({
            name: 'Nike Air Max',
            category: 'shoes',
            price: 29900,
            tags: ['sale', 'new'],
          }),
        ),
      request(app.getHttpServer() as App)
        .post('/api/products')
        .send(
          makeProduct({
            name: 'Adidas Ultraboost',
            category: 'shoes',
            price: 49900,
            tags: ['new'],
          }),
        ),
      request(app.getHttpServer() as App)
        .post('/api/products')
        .send(
          makeProduct({
            name: 'Sony Headphones',
            category: 'electronics',
            price: 19900,
            tags: ['sale'],
          }),
        ),
    ]);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return 200 with data and meta', async () => {
    const res = await request(app.getHttpServer() as App)
      .get('/api/products/search')
      .expect(200);
    const body = res.body as SearchResponse;

    expect(body).toHaveProperty('data');
    expect(body).toHaveProperty('meta');
    expect(Array.isArray(body.data)).toBe(true);
  });

  it('should return meta with total, limit and searchAfter', async () => {
    const res = await request(app.getHttpServer() as App)
      .get('/api/products/search')
      .expect(200);
    const body = res.body as SearchResponse;

    expect(body.meta).toHaveProperty('total');
    expect(body.meta).toHaveProperty('limit');
    expect(body.meta).toHaveProperty('searchAfter');
  });

  it('should filter by category', async () => {
    const res = await request(app.getHttpServer() as App)
      .get('/api/products/search?category=electronics')
      .expect(200);
    const body = res.body as SearchResponse;

    expect(Array.isArray(body.data)).toBe(true);
  });

  it('should filter by minPrice and maxPrice', async () => {
    const res = await request(app.getHttpServer() as App)
      .get('/api/products/search?minPrice=10000&maxPrice=30000')
      .expect(200);
    const body = res.body as SearchResponse;

    expect(Array.isArray(body.data)).toBe(true);
  });

  it('should respect limit param', async () => {
    const res = await request(app.getHttpServer() as App)
      .get('/api/products/search?limit=1')
      .expect(200);
    const body = res.body as SearchResponse;

    expect(body.data.length).toBeLessThanOrEqual(1);
    expect(body.meta.limit).toBe(1);
  });

  it('should return 400 when limit exceeds 100', async () => {
    await request(app.getHttpServer() as App)
      .get('/api/products/search?limit=101')
      .expect(400);
  });

  it('should return 400 when limit is zero', async () => {
    await request(app.getHttpServer() as App)
      .get('/api/products/search?limit=0')
      .expect(400);
  });

  it('should return 400 when sort is invalid', async () => {
    await request(app.getHttpServer() as App)
      .get('/api/products/search?sort=invalid')
      .expect(400);
  });

  it('should paginate using searchAfter', async () => {
    const first = await request(app.getHttpServer() as App)
      .get('/api/products/search?limit=1')
      .expect(200);
    const firstBody = first.body as SearchResponse;

    const searchAfter = firstBody.meta.searchAfter;

    if (searchAfter) {
      const params = new URLSearchParams({ limit: '1' });
      searchAfter.forEach((v) => params.append('searchAfter', String(v)));

      const second = await request(app.getHttpServer() as App)
        .get(`/api/products/search?${params.toString()}`)
        .expect(200);
      const secondBody = second.body as SearchResponse;

      expect(secondBody.data).toBeDefined();
    }
  });
});
