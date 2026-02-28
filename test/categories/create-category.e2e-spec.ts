import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { createTestApp } from '../helpers/app.helper';
import { makeCategory } from '../helpers/category.helper';

describe('POST /api/categories', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a category and return 201', async () => {
    await request(app.getHttpServer() as App)
      .post('/api/categories')
      .send(makeCategory())
      .expect(201);
  });

  it('should return 400 when name is missing', async () => {
    await request(app.getHttpServer() as App)
      .post('/api/categories')
      .send(makeCategory({ name: undefined }))
      .expect(400);
  });

  it('should return 400 when name is empty string', async () => {
    await request(app.getHttpServer() as App)
      .post('/api/categories')
      .send(makeCategory({ name: '' }))
      .expect(400);
  });

  it('should return 400 when name is shorter than 3 characters', async () => {
    await request(app.getHttpServer() as App)
      .post('/api/categories')
      .send(makeCategory({ name: 'ab' }))
      .expect(400);
  });

  it('should return 400 when name is not a string', async () => {
    await request(app.getHttpServer() as App)
      .post('/api/categories')
      .send(makeCategory({ name: 123 }))
      .expect(400);
  });
});
