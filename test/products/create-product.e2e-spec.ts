import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from '../helpers/app.helper';
import { makeProduct } from '../helpers/product.helper';

describe('POST /api/products', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a product and return 201', async () => {
    await request(app.getHttpServer())
      .post('/api/products')
      .send(makeProduct())
      .expect(201);
  });

  it('should return 400 when name is missing', async () => {
    await request(app.getHttpServer())
      .post('/api/products')
      .send(makeProduct({ name: undefined }))
      .expect(400);
  });

  it('should return 400 when name is empty string', async () => {
    await request(app.getHttpServer())
      .post('/api/products')
      .send(makeProduct({ name: '' }))
      .expect(400);
  });

  it('should return 400 when description is missing', async () => {
    await request(app.getHttpServer())
      .post('/api/products')
      .send(makeProduct({ description: undefined }))
      .expect(400);
  });

  it('should return 400 when category is missing', async () => {
    await request(app.getHttpServer())
      .post('/api/products')
      .send(makeProduct({ category: undefined }))
      .expect(400);
  });

  it('should return 400 when price is missing', async () => {
    await request(app.getHttpServer())
      .post('/api/products')
      .send(makeProduct({ price: undefined }))
      .expect(400);
  });

  it('should return 400 when price is zero', async () => {
    await request(app.getHttpServer())
      .post('/api/products')
      .send(makeProduct({ price: 0 }))
      .expect(400);
  });

  it('should return 400 when price is negative', async () => {
    await request(app.getHttpServer())
      .post('/api/products')
      .send(makeProduct({ price: -100 }))
      .expect(400);
  });

  it('should return 400 when stock is missing', async () => {
    await request(app.getHttpServer())
      .post('/api/products')
      .send(makeProduct({ stock: undefined }))
      .expect(400);
  });

  it('should return 400 when stock is zero', async () => {
    await request(app.getHttpServer())
      .post('/api/products')
      .send(makeProduct({ stock: 0 }))
      .expect(400);
  });

  it('should return 400 when stock is negative', async () => {
    await request(app.getHttpServer())
      .post('/api/products')
      .send(makeProduct({ stock: -1 }))
      .expect(400);
  });

  it('should return 400 when stock is a float', async () => {
    await request(app.getHttpServer())
      .post('/api/products')
      .send(makeProduct({ stock: 1.5 }))
      .expect(400);
  });

  it('should return 400 when tags is not an array', async () => {
    await request(app.getHttpServer())
      .post('/api/products')
      .send(makeProduct({ tags: 'not-an-array' }))
      .expect(400);
  });

  it('should create a product with empty tags array', async () => {
    await request(app.getHttpServer())
      .post('/api/products')
      .send(makeProduct({ tags: [] }))
      .expect(201);
  });
});
