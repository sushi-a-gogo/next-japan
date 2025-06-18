import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AiEvent } from '@app/event/models/ai-event.model';
import { debug, RxJsLoggingLevel } from '@app/operators/debug';
import { environment } from '@environments/environment';
import { catchError, Observable } from 'rxjs';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class OpenAiService {
  private uri = `${environment.apiUri}/api/ai`;
  private errorService = inject(ErrorService);

  constructor(private http: HttpClient) { }

  generateContent(params: any, text: string): Observable<AiEvent> {
    return this.http.post<AiEvent>(`${this.uri}/generate-content`, {
      promptParams: params,
      customText: text,
    }).pipe(
      debug(RxJsLoggingLevel.DEBUG, "openAI:generateContent"),
      catchError((e) => this.errorService.handleError(e, 'Error fetching result from Open AI', true))
    );
  }
}
