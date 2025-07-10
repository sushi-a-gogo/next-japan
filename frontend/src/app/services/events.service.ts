import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { debug, RxJsLoggingLevel } from '@app/operators/debug';
import { AiEvent } from '@app/pages/event/models/ai-event.model';
import { EventInformation } from '@app/pages/event/models/event-information.model';
import { environment } from '@environments/environment';
import { catchError, map, Observable, shareReplay, tap } from 'rxjs';
import { ErrorService } from './error.service';

const CACHE_DURATION_MS = 1000 * 60 * 5; // 5 minutes in milliseconds

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private http = inject(HttpClient);
  private cache = new Map<string, Observable<EventInformation[]>>();
  private cacheTimes = new Map<string, number>();
  private errorService = inject(ErrorService);
  private eventsUrl = `${environment.apiUrl}/api/events`;

  constructor() { }

  get$(): Observable<EventInformation[]> {
    if (this.existsInCache('events')) {
      const cached = this.cache.get('events');
      if (cached) {
        return cached;
      }
    }

    const obs$ = this.getEvents$().pipe(
      shareReplay(1)
    );
    this.cache.set('events', obs$);
    this.cacheTimes.set('events', new Date().getTime());

    return obs$;
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
      tap(() => this.cache.delete('events')),
      catchError((e) => this.errorService.handleError(e, 'Error saving event', true))
    );
  }

  private getEvents$(): Observable<EventInformation[]> {
    return this.http.get<EventInformation[]>(`${this.eventsUrl}`).pipe(
      debug(RxJsLoggingLevel.DEBUG, "getEvents"),
      map((res) => res.data),
      catchError((e) => this.errorService.handleError(e, 'Error getting events', true))
    );
  }

  private existsInCache(key: string) {
    const now = new Date().getTime();
    const cacheTime = this.cacheTimes.get(key) ?? 0;
    const ageOfCacheInMilliseconds = now - cacheTime;
    if (ageOfCacheInMilliseconds > CACHE_DURATION_MS) {
      this.cache.delete(key);
      this.cacheTimes.delete(key);
      return false;
    }

    return this.cache.has(key);
  }
}
