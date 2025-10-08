import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ApiResponse } from '@app/models/api-response.model';
import { EventData } from '@app/models/event/event-data.model';
import { EventInformation } from '@app/models/event/event-information.model';
import { debug, RxJsLoggingLevel } from '@app/operators/debug';
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

  private apiEventsUrl = `${environment.apiUrl}/api/search`;

  constructor() { }

  searchEvents$(query: string): Observable<EventData[]> {
    return this.http.get<ApiResponse<EventInformation[]>>(`${this.apiEventsUrl}?q=${encodeURIComponent(query)}`).pipe(
      debug(RxJsLoggingLevel.DEBUG, 'searchEvents'),
      map(resp => resp.data.slice(0, 5)), // Limit to 5 suggestions
      catchError((e) => this.errorService.handleError(e, 'Error searching events.'))
    );
  }

  clearSearchMode() {
    this.searchModeSignal.set(false);
  }

  toggleSearchMode() {
    this.searchModeSignal.update((prev) => !prev);
  }
}
