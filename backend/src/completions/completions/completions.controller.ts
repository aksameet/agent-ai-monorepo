import { Controller, Post, Body } from '@nestjs/common';
import { CompletionsService } from './completions.service';

@Controller('v1')
export class CompletionsController {
  constructor(private readonly completions: CompletionsService) {}

  @Post('chat/completions')
  async chat(@Body() body: any) {
    console.log('▶️ [Controller] chat body:', body);
    return this.completions.forwardChat(body);
  }

  @Post('plan')
  async plan(@Body() body: { messages: { role: string; content: string }[] }) {
    console.log('▶️ [Controller] plan messages:', body.messages);
    return this.completions.forwardPlan(body.messages);
  }
}
