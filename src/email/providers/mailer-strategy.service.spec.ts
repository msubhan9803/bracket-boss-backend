import { Test, TestingModule } from '@nestjs/testing';
import { MailerStrategyService } from './mailer-strategy.service';

describe('MailerStrategyService', () => {
  let service: MailerStrategyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailerStrategyService],
    }).compile();

    service = module.get<MailerStrategyService>(MailerStrategyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
