import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { createSaleRequestBuilder } from '../../src/presentation/features/sales/testing/create-sale-request.builder';
import { createTestApp } from '../helpers/app.helper';
import { createProductRequestBuilder as makeProduct } from '../../src/presentation/features/products/testing/create-product-request.builder';

interface SaleResponse {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: string;
}

interface PaginatedSalesResponse {
  data: SaleResponse[];
  meta: {
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextCursor: string | null;
  };
}

describe('GET /api/sales', () => {
  let app: INestApplication;
  let productId: string;

  beforeAll(async () => {
    app = await createTestApp();

    await request(app.getHttpServer() as App)
      .post('/api/products')
      .send(makeProduct())
      .expect(201);

    const productsRes = await request(app.getHttpServer() as App)
      .get('/api/products')
      .expect(200);

    const products = productsRes.body as {
      data: Array<{ id: string }>;
    };
    productId = products.data[0].id;

    await Promise.all(
      Array.from({ length: 3 }).map(() =>
        request(app.getHttpServer() as App)
          .post('/api/sales')
          .send(createSaleRequestBuilder({ productId })),
      ),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return 200 with paginated sales', async () => {
    const res = await request(app.getHttpServer() as App)
      .get('/api/sales')
      .expect(200);
    const body = res.body as PaginatedSalesResponse;

    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThanOrEqual(3);
    expect(body.meta).toHaveProperty('hasNextPage');
    expect(body.meta).toHaveProperty('limit');
  });

  it('should return correct sale fields', async () => {
    const res = await request(app.getHttpServer() as App)
      .get('/api/sales')
      .expect(200);
    const body = res.body as PaginatedSalesResponse;

    const sale = body.data[0];
    expect(sale).toHaveProperty('id');
    expect(sale).toHaveProperty('productId');
    expect(sale).toHaveProperty('quantity');
    expect(sale).toHaveProperty('unitPrice');
    expect(sale).toHaveProperty('totalPrice');
    expect(sale).toHaveProperty('createdAt');
  });

  it('should respect limit parameter', async () => {
    const res = await request(app.getHttpServer() as App)
      .get('/api/sales?limit=1')
      .expect(200);
    const body = res.body as PaginatedSalesResponse;

    expect(body.data).toHaveLength(1);
    expect(body.meta.hasNextPage).toBe(true);
  });
});
