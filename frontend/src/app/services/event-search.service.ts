import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { debug, RxJsLoggingLevel } from '@app/operators/debug';
import { EventData } from '@app/pages/event/models/event-data.model';
import { EventInformation } from '@app/pages/event/models/event-information.model';
import { environment } from '@environments/environment';
import { catchError, map, Observable } from 'rxjs';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class EventSearchService {
  private http = inject(HttpClient);
  private errorService = inject(ErrorService);

  private searchModeSignal = signal(false);
  searchMode = this.searchModeSignal.asReadonly();

  private apiUrl = `${environment.apiUrl}/api/event/search`;

  constructor() { }

  searchEvents$(query: string): Observable<EventData[]> {
    return this.http.get<EventInformation[]>(`${this.apiUrl}?q=${encodeURIComponent(query)}`).pipe(
      debug(RxJsLoggingLevel.DEBUG, 'searchEvents'),
      map(events => events.slice(0, 5)), // Limit to 5 suggestions
      catchError((e) => this.errorService.handleError(e, 'Error searching event.'))
    );
  }

  searchFullEvents(query: string): Observable<EventInformation[]> {
    return this.http.get<EventInformation[]>(`${this.apiUrl}?v=1&q=${encodeURIComponent(query)}`).pipe(
      debug(RxJsLoggingLevel.DEBUG, 'searchFullEvents'),
      map(events => events.slice(0, 10)), // Limit to 10 suggestions
      catchError((e) => this.errorService.handleError(e, 'Error searching event.'))
    );
  }

  toggleSearchMode() {
    this.searchModeSignal.update((prev) => !prev);
  }
}
