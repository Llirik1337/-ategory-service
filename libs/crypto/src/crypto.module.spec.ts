import { Test } from '@nestjs/testing';
import { CryptoService } from './crypto.service';
import { CryptoModule } from './crypto.module';
// import * as bcrypt from 'bcrypt';

describe(CryptoService.name, () => {
  let service: CryptoService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CryptoModule.registry()],
    }).compile();

    service = module.get(CryptoService);
  });

  it(`should hash password twice and should equal`, async () => {
    const password = `PASSWORD`;

    const hashOne = await service.getHash(password);
    const hashTwo = await service.getHash(password);

    expect(hashOne).toStrictEqual(hashTwo);
  });

  it(`should hash password and compare`, async () => {
    const password = `PASSWORD`;

    const hash = await service.getHash(password);

    expect(await service.compareHash(password, hash)).toStrictEqual(true);
  });
});
