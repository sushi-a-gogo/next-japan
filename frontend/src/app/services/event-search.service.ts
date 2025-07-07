import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { debug, RxJsLoggingLevel } from '@app/operators/debug';
import { EventData } from '@app/pages/event/models/event-data.model';
import { EventInformation } from '@app/pages/event/models/event-information.model';
import { environment } from '@environments/environment';
import { catchError, forkJoin, map, Observable } from 'rxjs';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class EventSearchService {
  private http = inject(HttpClient);
  private errorService = inject(ErrorService);

  private searchModeSignal = signal(false);
  searchMode = this.searchModeSignal.asReadonly();

  private apiEventUrl = `${environment.apiUrl}/api/event/search`;
  private apiEventsUrl = `${environment.apiUrl}/api/events/search`;

  constructor() { }

  searchAllEvents$(query: string): Observable<EventData[]> {
    const observables = {
      events: this.searchEvents$(query),
      savedEvents: this.searchDbEvents$(query)
    }
    return forkJoin(observables).pipe(
      map((res) => [...res.events, ...res.savedEvents])
    );
  }

  searchEvents$(query: string): Observable<EventData[]> {
    return this.http.get<EventInformation[]>(`${this.apiEventUrl}?q=${encodeURIComponent(query)}`).pipe(
      debug(RxJsLoggingLevel.DEBUG, 'searchEvents'),
      map(events => events.slice(0, 5)), // Limit to 5 suggestions
      catchError((e) => this.errorService.handleError(e, 'Error searching events.'))
    );
  }

  searchDbEvents$(query: string): Observable<EventData[]> {
    return this.http.get<EventInformation[]>(`${this.apiEventsUrl}?q=${encodeURIComponent(query)}`).pipe(
      debug(RxJsLoggingLevel.DEBUG, 'searchEvents'),
      map(events => events.slice(0, 5)), // Limit to 5 suggestions
      catchError((e) => this.errorService.handleError(e, 'Error searching events.'))
    );
  }

  toggleSearchMode() {
    this.searchModeSignal.update((prev) => !prev);
  }
}
