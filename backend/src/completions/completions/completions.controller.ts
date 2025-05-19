import { Body, Controller, Post } from '@nestjs/common';
import { CompletionsService } from './completions.service';

@Controller('v1')
export class CompletionsController {
  constructor(private readonly svc: CompletionsService) {}

  /* ---------- zwykły chat ---------- */
  @Post('chat/completions')
  chat(@Body() body: any) {
    console.log('▶️ [Controller] chat body:', body);
    return this.svc.forwardChat(body);
  }

  /* ---------- generowanie planu ---------- */
  @Post('plan')
  plan(@Body() body: { prompt: string }) {
    console.log('▶️ [Controller] plan prompt:', body.prompt);
    return this.svc.forwardPlan(body.prompt);
  }
}
