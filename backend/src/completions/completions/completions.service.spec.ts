import { Test, TestingModule } from '@nestjs/testing';
import { CompletionsService } from './completions.service';

describe('CompletionsService', () => {
  let service: CompletionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompletionsService],
    }).compile();

    service = module.get<CompletionsService>(CompletionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
