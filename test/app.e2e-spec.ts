import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { createTestApp } from './helpers/app.helper';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/ping should return pong!', async () => {
    await request(app.getHttpServer() as App)
      .get('/api/ping')
      .expect(200)
      .expect('pong!');
  });
});
