import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { debug, RxJsLoggingLevel } from '@app/operators/debug';
import { AiEvent } from '@app/pages/event/models/ai-event.model';
import { EventInformation } from '@app/pages/event/models/event-information.model';
import { environment } from '@environments/environment';
import { catchError, map, Observable } from 'rxjs';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private http = inject(HttpClient);
  private errorService = inject(ErrorService);
  private eventsUrl = `${environment.apiUrl}/api/events`;

  constructor() { }

  get$() {
    return this.http.get<EventInformation[]>(`${this.eventsUrl}`).pipe(
      debug(RxJsLoggingLevel.DEBUG, "getEvents"),
      catchError((e) => this.errorService.handleError(e, 'Error getting events', true))
    );
  }

  getEvent$(eventId: string): Observable<EventInformation> {
    return this.http.get<EventInformation>(`${this.eventsUrl}/${eventId}`).pipe(
      debug(RxJsLoggingLevel.DEBUG, "getEvent"),
      map((resp) => resp.data as EventInformation),
      catchError((e) => this.errorService.handleError(e, 'Error getting event', true))
    );
  }

  saveEvent$(event: AiEvent) {
    return this.http.post<AiEvent>(`${this.eventsUrl}/save`, event).pipe(
      debug(RxJsLoggingLevel.DEBUG, "saveEvent"),
      catchError((e) => this.errorService.handleError(e, 'Error saving event', true))
    );
  }
}
