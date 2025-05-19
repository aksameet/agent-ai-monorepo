import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PromptLoaderService } from 'utils/prompt-loader.service';

@Injectable()
export class CompletionsService {
  private readonly endpoint = 'https://api.groq.com/openai/v1/chat/completions';
  private readonly apiKey =
    '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';
  private readonly model = 'deepseek-r1-distill-llama-70b';

  constructor(
    private readonly http: HttpService,
    private readonly promptLoader: PromptLoaderService,
  ) {}

  async forwardPlan(prompt: string) {
    const system = this.promptLoader.load('planning');
    const headers = {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };

    const body = {
      model: this.model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    };

    const { data } = await firstValueFrom(
      this.http.post(this.endpoint, body, { headers }),
    );
    return data;
  }

  async forwardChat(body: any) {
    const system = this.promptLoader.load('chat');
    body.model = this.model;
    body.messages.unshift({ role: 'system', content: system });

    const headers = {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };

    const { data } = await firstValueFrom(
      this.http.post(this.endpoint, body, { headers }),
    );
    return data;
  }
}
