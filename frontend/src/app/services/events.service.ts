import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HttpClientCache } from '@app/cache/http-client-cache';
import { AiEvent } from '@app/models/event/ai-event.model';
import { EventData } from '@app/models/event/event-data.model';
import { EventInformation } from '@app/models/event/event-information.model';
import { debug, RxJsLoggingLevel } from '@app/operators/debug';
import { environment } from '@environments/environment';
import { catchError, map, Observable, of, shareReplay, switchMap, tap } from 'rxjs';
import { ErrorService } from './error.service';

const CACHE_DURATION_MS = 1000 * 60 * 5; // 5 minutes in milliseconds

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private http = inject(HttpClient);
  private eventsCache = new HttpClientCache<EventData[]>(5, 1);
  private eventCache = new HttpClientCache<EventInformation>();
  private errorService = inject(ErrorService);
  private eventsUrl = `${environment.apiUrl}/api/events`;

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

  getEvent$(eventId: string): Observable<EventInformation> {
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

  saveEvent$(event: AiEvent) {
    return this.http.post<AiEvent>(`${this.eventsUrl}/save`, event).pipe(
      debug(RxJsLoggingLevel.DEBUG, "saveEvent"),
      tap(() => this.eventsCache.clear()),
      catchError((e) => this.errorService.handleError(e, 'Error saving event', true))
    );
  }

  private fetchEvent$(eventId: string): Observable<EventInformation> {
    return this.http.get<{ event: EventInformation }>(`${this.eventsUrl}/${eventId}`).pipe(
      map((resp) => resp.event as EventInformation),
      debug(RxJsLoggingLevel.DEBUG, "getEvent"),
      catchError((e) => this.errorService.handleError(e, 'Error getting event', true))
    );
  }

  private fetchEvents$(): Observable<EventData[]> {
    return this.http.get<{ events: EventData[] }>(`${this.eventsUrl}`).pipe(
      map((resp) => resp.events),
      debug(RxJsLoggingLevel.DEBUG, "getEvents"),
      catchError((e) => this.errorService.handleError(e, 'Error getting events', true))
    );
  }
}
