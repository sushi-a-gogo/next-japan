import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HttpClientCache } from '@app/cache/http-client-cache';
import { debug, RxJsLoggingLevel } from '@app/operators/debug';
import { AiEvent } from '@app/pages/event/models/ai-event.model';
import { EventData } from '@app/pages/event/models/event-data.model';
import { EventInformation } from '@app/pages/event/models/event-information.model';
import { environment } from '@environments/environment';
import { catchError, map, Observable, of, shareReplay, switchMap, tap } from 'rxjs';
import { ErrorService } from './error.service';

const CACHE_DURATION_MS = 1000 * 60 * 5; // 5 minutes in milliseconds

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private http = inject(HttpClient);
  private eventCache = new HttpClientCache<EventInformation>();
  private eventsCache = new HttpClientCache<EventData[]>();
  private errorService = inject(ErrorService);
  private eventsUrl = `${environment.apiUrl}/api/events`;

  get$(): Observable<EventData[]> {
    if (this.eventsCache.existsInCache('events')) {
      const cached = this.eventsCache.get('events');
      if (cached) {
        console.log("*** Events retrieved from cache.");
        return cached;
      }
    }

    const obs$ = this.fetchEvents$().pipe(
      shareReplay(1)
    );
    this.eventsCache.set('events', obs$);

    return obs$;
  }

  getEvent$(eventId: string): Observable<EventInformation> {
    if (this.eventCache.existsInCache(eventId)) {
      const cached = this.eventCache.get(eventId);
      if (cached) {
        console.log("*** Event retrieved from cache.");
        return cached;
      }
    }

    const obs$ = this.fetchEvent$(eventId).pipe(
      switchMap((event) => {
        return of(event);
      }),
      shareReplay(1)
    );

    this.eventCache.set(eventId, obs$);
    return obs$;
  }

  saveEvent$(event: AiEvent) {
    return this.http.post<AiEvent>(`${this.eventsUrl}/save`, event).pipe(
      debug(RxJsLoggingLevel.DEBUG, "saveEvent"),
      tap(() => this.eventsCache.delete('events')),
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
