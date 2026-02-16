import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { ErrorService } from '@core/services/error.service';
import { EventData } from '@events/models/event-data.model';
import { EventInformation } from '@events/models/event-information.model';
import { catchError, map, Observable } from 'rxjs';

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
