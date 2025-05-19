import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface PlanDto {
  actions?: any[];
  clarificationRequest?: string;
}

@Injectable({ providedIn: 'root' })
export class LlmService {
  private chatUrl = 'http://localhost:3000/v1/chat/completions';
  private planUrl = 'http://localhost:3000/v1/plan';

  constructor(private http: HttpClient) {}

  /** Zapytanie do modelu (chat mode) */
  queryLLM(prompt: string): Observable<string> {
    const body = {
      model: 'deepseek-r1-distill-llama-70b', // używamy Groq
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 500,
      temperature: 0.7,
    };

    return this.http
      .post<any>(this.chatUrl, body)
      .pipe(map((r) => r.choices[0].message.content.trim()));
  }

  /** Generowanie planu JSON */
  getPlan(prompt: string): Observable<PlanDto> {
    return this.http
      .post<any>(this.planUrl, { prompt })
      .pipe(map((r) => this.parseJson(r.choices[0].message.content)));
  }

  /** Bezpieczne parsowanie JSON z modelu */
  private parseJson(raw: string): PlanDto {
    const cleaned = raw.replace(/```[\s\S]*?```/g, (match) => {
      return match.replace(/```[a-zA-Z]*\n?/, '').replace(/```$/, '');
    });

    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON detected in LLM response');

    try {
      const parsed = JSON.parse(jsonMatch[0].trim());
      if (parsed.actions || parsed.clarificationRequest) {
        return parsed as PlanDto;
      }
      throw new Error('No valid structure in response');
    } catch (e) {
      console.error('[LlmService] JSON parse error:', e);
      throw e;
    }
  }
}
