import { Test, type TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';

describe(`AppController`, () => {
  // let userController: AppController;

  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // userController = moduleRef.get<AppController>(AppController);
  });

  afterAll(async () => {
    await moduleRef.close();
  });
  it(`Should ...`, () => {
    expect(true).toBeTruthy();
  });
});
