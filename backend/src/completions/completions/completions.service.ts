import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PromptLoaderService } from 'utils/prompt-loader.service';

@Injectable()
export class CompletionsService {
  private readonly endpoint = 'https://api.groq.com/openai/v1/chat/completions';
  private readonly apiKey = process.env.GROQ_API_KEY;

  constructor(
    private readonly http: HttpService,
    private readonly promptLoader: PromptLoaderService,
  ) {}

  async forwardPlan(messages: { role: string; content: string }[]) {
    const system = this.promptLoader.load('planning');

    const headers = {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };

    const full = [{ role: 'system', content: system }, ...messages];

    const body = {
      model: 'deepseek-r1-distill-llama-70b',
      messages: full,
      max_tokens: 1000,
      temperature: 0.3,
    };

    const { data } = await firstValueFrom(
      this.http.post(this.endpoint, body, { headers }),
    );
    return data;
  }

  async forwardChat(body: any) {
    const system = this.promptLoader.load('chat');
    body.model = 'deepseek-r1-distill-llama-70b';
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
