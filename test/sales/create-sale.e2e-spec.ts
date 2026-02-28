import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { createSaleRequestBuilder } from '../../src/presentation/features/sales/testing/create-sale-request.builder';
import { createTestApp } from '../helpers/app.helper';
import { createProductRequestBuilder as makeProduct } from '../../src/presentation/features/products/testing/create-product-request.builder';

describe('POST /api/sales', () => {
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
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a sale and return 201', async () => {
    await request(app.getHttpServer() as App)
      .post('/api/sales')
      .send(createSaleRequestBuilder({ productId }))
      .expect(201);
  });

  it('should return 400 when productId is missing', async () => {
    await request(app.getHttpServer() as App)
      .post('/api/sales')
      .send(createSaleRequestBuilder({ productId: undefined }))
      .expect(400);
  });

  it('should return 400 when productId is not a valid UUID', async () => {
    await request(app.getHttpServer() as App)
      .post('/api/sales')
      .send(createSaleRequestBuilder({ productId: 'invalid' }))
      .expect(400);
  });

  it('should return 400 when quantity is missing', async () => {
    await request(app.getHttpServer() as App)
      .post('/api/sales')
      .send(createSaleRequestBuilder({ productId, quantity: undefined }))
      .expect(400);
  });

  it('should return 400 when quantity is zero', async () => {
    await request(app.getHttpServer() as App)
      .post('/api/sales')
      .send(createSaleRequestBuilder({ productId, quantity: 0 }))
      .expect(400);
  });

  it('should return 400 when quantity is negative', async () => {
    await request(app.getHttpServer() as App)
      .post('/api/sales')
      .send(createSaleRequestBuilder({ productId, quantity: -1 }))
      .expect(400);
  });

  it('should return 400 when quantity is a float', async () => {
    await request(app.getHttpServer() as App)
      .post('/api/sales')
      .send(createSaleRequestBuilder({ productId, quantity: 1.5 }))
      .expect(400);
  });

  it('should return 404 when product does not exist', async () => {
    await request(app.getHttpServer() as App)
      .post('/api/sales')
      .send(createSaleRequestBuilder())
      .expect(404);
  });
});
