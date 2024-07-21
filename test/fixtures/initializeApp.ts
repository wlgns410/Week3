import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';

export let app: INestApplication;

export const initializeApp = async (moduleRef: TestingModule) => {
  app = moduleRef.createNestApplication();
  await app.init();
};

export const closeApp = async (moduleRef: TestingModule) => {
  app = moduleRef.createNestApplication();
  await app.close();
};
