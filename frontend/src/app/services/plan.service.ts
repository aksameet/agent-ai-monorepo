import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Action {
  type: string;
  args: Record<string, any>;
}

export interface PlanResult {
  results: Array<{ action: string; result: any }>;
}

@Injectable({ providedIn: 'root' })
export class PlanService {
  private url = 'http://localhost:3000/execute';

  constructor(private http: HttpClient) {}

  executePlan(actions: Action[]): Observable<PlanResult> {
    return this.http.post<PlanResult>(this.url, { actions });
  }
}
