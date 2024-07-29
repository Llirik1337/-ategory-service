import { Test } from '@nestjs/testing';
import { JwtService } from './jwt.service';
import { JwtModule } from './jwt.module';

describe(JwtService.name, () => {
  let service: JwtService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [JwtModule.registry()],
    }).compile();

    service = module.get(JwtService);
  });

  it(`should generate a signed token`, () => {
    const token = service.sign({ sub: `123` });
    expect(token).toBeDefined();
  });

  it(`should verify a signed token`, () => {
    const token = service.sign({ sub: `123` });
    const decoded = service.verify(token);

    expect(decoded).toEqual(expect.objectContaining({ sub: `123` }));
  });
});
