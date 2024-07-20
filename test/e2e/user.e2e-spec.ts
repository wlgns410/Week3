import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Controller (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/POST users - create user', async () => {
    const createUserDto = { name: 'Test User' };

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .expect(201);

    expect(response.body).toEqual({});
  });

  it('/PATCH users/:id/balance - charge balance', async () => {
    const createUserDto = { name: 'Test User' };

    // Create a new user first
    const createUserResponse = await request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .expect(201);

    // Assuming the user ID is returned in the response or known
    const userId = 3; // replace with the actual user ID if necessary

    const chargeBalanceDto = { amount: 1000 };

    const chargeResponse = await request(app.getHttpServer())
      .patch(`/users/${userId}/balance`)
      .send(chargeBalanceDto)
      .expect(200);

    expect(chargeResponse.body).toEqual({});
  });

  it('/GET users/:id/balance - get user balance', async () => {
    const userId = 3; // replace with the actual user ID if necessary

    const response = await request(app.getHttpServer())
      .get(`/users/${userId}/balance`)
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(typeof response.body.data).toBe('number');
  });
});
