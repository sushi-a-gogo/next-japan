import { inject, Injectable, signal } from '@angular/core';
import { EventData } from '@app/models/event/event-data.model';
import { EventInformation } from '@app/models/event/event-information.model';
import { catchError, map, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class EventSearchService {
  private apiService = inject(ApiService);
  private errorService = inject(ErrorService);

  private searchModeSignal = signal(false);
  searchMode = this.searchModeSignal.asReadonly();

  private apiUrl = 'api/search';

  searchEvents$(query: string): Observable<EventData[]> {
    return this.apiService.get<EventInformation[]>(`${this.apiUrl}?q=${encodeURIComponent(query)}`).pipe(
      map((res) => res.success && res.data ? res.data.slice(0, 5) : []), // Limit to 5 suggestions
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
