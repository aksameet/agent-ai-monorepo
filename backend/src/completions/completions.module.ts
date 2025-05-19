import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PromptLoaderService } from 'utils/prompt-loader.service';
import { CompletionsController } from './completions/completions.controller';
import { CompletionsService } from './completions/completions.service';

@Module({
  imports: [HttpModule],
  controllers: [CompletionsController],
  providers: [CompletionsService, PromptLoaderService],
})
export class CompletionsModule {}
