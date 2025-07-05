import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { debug, RxJsLoggingLevel } from '@app/operators/debug';
import { AiEvent } from '@app/pages/event/models/ai-event.model';
import { environment } from '@environments/environment';
import { catchError } from 'rxjs';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private http = inject(HttpClient);
  private errorService = inject(ErrorService);
  private eventsUrl = `${environment.apiUrl}/api/events`;

  constructor() { }

  saveEvent$(event: AiEvent) {
    return this.http.post<AiEvent>(`${this.eventsUrl}/save`, event).pipe(
      debug(RxJsLoggingLevel.DEBUG, "saveEvent"),
      catchError((e) => this.errorService.handleError(e, 'Error saving event', true))
    );
  }
}
