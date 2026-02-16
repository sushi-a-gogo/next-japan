import { inject, Injectable } from '@angular/core';
import { HttpClientCache } from '@app/core/cache/http-client-cache';
import { ApiResponse } from '@app/core/models/api-response.model';
import { AiEvent } from '@app/features/ai/models/ai-event.model';
import { ApiService } from '@core/services/api.service';
import { ErrorService } from '@core/services/error.service';
import { EventData } from '@features/events/models/event-data.model';
import { EventInformation } from '@features/events/models/event-information.model';
import { catchError, map, Observable, of, shareReplay, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private apiService = inject(ApiService);
  private eventsCache = new HttpClientCache<EventData[]>(5, 1);
  private eventCache = new HttpClientCache<EventInformation | null>();
  private errorService = inject(ErrorService);
  private eventsUrl = 'api/events';

  get$(): Observable<EventData[]> {
    const key = 'events';
    if (this.eventsCache.existsInCache(key)) {
      const cached = this.eventsCache.get(key);
      if (cached) {
        return cached;
      }
    }

    const obs$ = this.fetchEvents$().pipe(
      shareReplay(1)
    );
    this.eventsCache.set(key, obs$);

    return obs$;
  }

  getEvent$(eventId: string): Observable<EventInformation | null> {
    const key = `event:${eventId}`;
    if (this.eventCache.existsInCache(key)) {
      const cached = this.eventCache.get(key);
      if (cached) {
        return cached;
      }
    }

    const obs$ = this.fetchEvent$(eventId).pipe(
      switchMap((event) => {
        return of(event);
      }),
      shareReplay(1)
    );

    this.eventCache.set(key, obs$);
    return obs$;
  }

  saveEvent$(event: AiEvent): Observable<ApiResponse<EventData>> {
    return this.apiService.post<EventData>(`${this.eventsUrl}`, event).pipe(
      tap(() => this.eventsCache.clear()),
      catchError((e) => this.errorService.handleError(e, 'Error saving event', true))
    );
  }

  private fetchEvent$(eventId: string): Observable<EventInformation | null> {
    return this.apiService.get<EventInformation>(`${this.eventsUrl}/${eventId}`).pipe(
      map((resp) => resp.data),
      catchError((e) => this.errorService.handleError(e, 'Error getting event', true))
    );
  }

  private fetchEvents$(): Observable<EventData[]> {
    return this.apiService.get<EventData[]>(`${this.eventsUrl}`).pipe(
      map((res) => res.data || []),
      catchError((e) => this.errorService.handleError(e, 'Error getting events', true))
    );
  }
}
