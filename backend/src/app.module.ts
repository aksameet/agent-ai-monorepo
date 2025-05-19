import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CompletionsModule } from './completions/completions.module';
import { PlanModule } from './plan/plan.module';
import { PromptLoaderService } from 'utils/prompt-loader.service';

@Module({
  imports: [HttpModule, CompletionsModule, PlanModule],
  providers: [PromptLoaderService],
})
export class AppModule {}
