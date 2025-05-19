import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LlmService, PlanDto } from './services/llm.service';
import { PlanService, PlanResult } from './services/plan.service';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-100 p-6 flex flex-col">
      <h1 class="text-2xl font-bold text-center mb-6">
        🧠 AI Agent — Plan & Execute
      </h1>

      <!-- Mode switch -->
      <div class="flex justify-center mb-4 space-x-4">
        <button
          (click)="mode = 'chat'"
          [ngClass]="
            mode === 'chat'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600'
          "
          class="px-3 py-1 transition"
        >
          Chat
        </button>
        <button
          (click)="mode = 'plan'"
          [ngClass]="
            mode === 'plan'
              ? 'border-b-2 border-green-600 text-green-600'
              : 'text-gray-600'
          "
          class="px-3 py-1 transition"
        >
          Plan
        </button>
      </div>

      <!-- Prompt input -->
      <form (ngSubmit)="onSubmit()" class="flex space-x-2 mb-4">
        <input
          [(ngModel)]="inputText"
          name="prompt"
          placeholder="Napisz wiadomość..."
          class="flex-1 p-2 border rounded"
        />
        <button
          type="submit"
          class="px-4 py-2 text-white rounded"
          [ngClass]="
            mode === 'chat'
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-green-600 hover:bg-green-700'
          "
        >
          {{ mode === 'chat' ? 'Wyślij' : 'Stwórz plan' }}
        </button>
      </form>

      <!-- Content -->
      <div class="flex-1 overflow-auto mb-4">
        <ng-container *ngIf="mode === 'chat'">
          <div
            *ngFor="let msg of messages"
            class="flex mb-2"
            [ngClass]="msg.role === 'user' ? 'justify-end' : 'justify-start'"
          >
            <div
              class="max-w-[70%] px-4 py-2 shadow"
              [ngClass]="
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg'
                  : 'bg-white text-gray-800 border border-gray-300 rounded-tr-lg rounded-tl-lg rounded-br-lg'
              "
            >
              <div class="text-xs font-bold mb-1">
                {{ msg.role === 'user' ? 'Ty' : 'AI' }}
              </div>
              <div class="whitespace-pre-wrap">{{ msg.content }}</div>
            </div>
          </div>
        </ng-container>

        <ng-container *ngIf="mode === 'plan'">
          <div
            *ngIf="clarificationRequest"
            class="bg-yellow-100 border border-yellow-300 text-yellow-800 p-4 rounded mb-4 whitespace-pre-wrap"
          >
            {{ clarificationRequest }}
          </div>

          <pre
            *ngIf="plan"
            class="bg-white border p-4 rounded mb-4 whitespace-pre-wrap"
            >{{ plan | json }}</pre
          >

          <button
            *ngIf="plan && !clarificationRequest"
            (click)="runPlan()"
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Wykonaj plan
          </button>

          <pre
            *ngIf="execution"
            class="bg-white border p-4 rounded whitespace-pre-wrap mt-4"
          >
Wynik: {{ execution | json }}</pre
          >
        </ng-container>
      </div>

      <div *ngIf="loading" class="flex justify-center">
        <div class="loader"></div>
      </div>
    </div>
  `,
  styles: [
    `
      .loader {
        border: 4px solid rgba(0, 0, 0, 0.1);
        border-top-color: #3b82f6;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class AppComponent {
  mode: 'chat' | 'plan' = 'chat';
  inputText = '';
  loading = false;

  messages: Message[] = [];
  planMessages: Message[] = [];
  plan: PlanDto | null = null;
  execution: PlanResult | null = null;
  clarificationRequest: string | null = null;

  constructor(private llm: LlmService, private planSvc: PlanService) {}

  onSubmit() {
    if (!this.inputText.trim()) return;
    this.mode === 'chat' ? this.sendMessage() : this.generatePlan();
  }

  sendMessage() {
    const text = this.inputText.trim();
    this.messages.push({ role: 'user', content: text });
    this.inputText = '';
    this.loading = true;

    this.llm.queryLLM(text).subscribe({
      next: (res) => {
        this.messages.push({ role: 'assistant', content: res });
        this.loading = false;
      },
      error: () => {
        this.messages.push({ role: 'assistant', content: 'Błąd API' });
        this.loading = false;
      },
    });
  }

  generatePlan() {
    const text = this.inputText.trim();
    this.inputText = '';
    this.plan = null;
    this.execution = null;
    this.clarificationRequest = null;
    this.loading = true;

    this.planMessages.push({ role: 'user', content: text });

    this.llm.getPlan(this.planMessages).subscribe({
      next: (p) => {
        if (p.clarificationRequest) {
          this.clarificationRequest = p.clarificationRequest;
          this.planMessages.push({
            role: 'assistant',
            content: p.clarificationRequest,
          });
        } else {
          this.plan = p;
          this.planMessages.push({
            role: 'assistant',
            content: JSON.stringify(p, null, 2),
          });
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert('Błąd generowania planu');
      },
    });
  }

  runPlan() {
    if (!this.plan) return;
    this.loading = true;
    this.execution = null;

    if (!this.plan?.actions) {
      alert('Plan actions are undefined');
      this.loading = false;
      return;
    }
    this.planSvc.executePlan(this.plan.actions).subscribe({
      next: (res: any) => {
        if (res.clarificationRequest) {
          this.clarificationRequest = res.clarificationRequest;
          this.execution = null;
        } else {
          this.execution = res;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert('Błąd wykonania planu');
      },
    });
  }
}
