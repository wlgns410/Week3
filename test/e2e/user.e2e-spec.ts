import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { runSeeds } from '../../src/seeds/index';

describe('Controller (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await runSeeds();
  });

  afterAll(async () => {
    await app.close();
  });

  // it('/POST users - create user', async () => {
  //   const createUserDto = { name: 'Test User' };

  //   const response = await request(app.getHttpServer())
  //     .post('/users')
  //     .send(createUserDto)
  //     .expect(201);

  //   expect(response.body).toEqual({});
  // });

  it('/PATCH users/:id/balance - charge balance concurrently', async () => {
    // Assuming the user ID is returned in the response or known
    const userId = 21; // replace with the actual user ID if necessary

    const chargeBalanceDto = { amount: 1000 };

    // Function to send a charge balance request
    const sendChargeBalanceRequest = () =>
      request(app.getHttpServer())
        .patch(`/users/${userId}/balance`)
        .send(chargeBalanceDto)
        .expect(200);

    // Create an array of 100 promises
    const concurrentRequests = Array(1000000)
      .fill(null)
      .map(sendChargeBalanceRequest);

    // Execute all requests concurrently
    const results = await Promise.allSettled(concurrentRequests);

    // Log results
    const failedRequests = results.filter(
      (result) => result.status === 'rejected',
    );
    const successfulRequests = results.filter(
      (result) => result.status === 'fulfilled',
    );

    console.log(`Total requests: ${results.length}`);
    console.log(`Successful requests: ${successfulRequests.length}`);
    console.log(`Failed requests: ${failedRequests.length}`);

    failedRequests.forEach((result, index) => {
      console.error(`Request ${index + 1} failed: ${result}`);
    });

    expect(successfulRequests.length).toBeGreaterThan(0);
  });

  // it('/GET users/:id/balance - get user balance', async () => {
  //   const userId = 3; // replace with the actual user ID if necessary

  //   const response = await request(app.getHttpServer())
  //     .get(`/users/${userId}/balance`)
  //     .expect(200);

  //   expect(response.body).toHaveProperty('data');
  //   expect(typeof response.body.data).toBe('number');
  // });
});
