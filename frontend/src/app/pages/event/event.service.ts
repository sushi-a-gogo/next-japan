import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { debug, RxJsLoggingLevel } from '@app/operators/debug';
import { EventOpportunity } from '@app/pages/event/models/event-opportunity.model';
import { ErrorService } from '@app/services/error.service';
import { UtilService } from '@app/services/util.service';
import { environment } from '@environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { EventData } from './models/event-data.model';
import { EventInformation } from './models/event-information.model';

@Injectable()
export class EventService {
  private http = inject(HttpClient);
  private cache = new Map<number, Observable<EventInformation | null>>();
  private cacheTime = 0;


  private eventSignal = signal<EventInformation | null>(null);
  event = this.eventSignal.asReadonly();

  private eventOpportunitiesSignal = signal<EventOpportunity[]>([]);
  eventOpportunities = this.eventOpportunitiesSignal.asReadonly();

  private errorService = inject(ErrorService);
  private util = inject(UtilService);
  private apiUrl = `${environment.apiUrl}/api/event`;

  searchEvents$(query: string): Observable<EventData[]> {
    return this.http.get<EventInformation[]>(`${this.apiUrl}/search?q=${encodeURIComponent(query)}`).pipe(
      debug(RxJsLoggingLevel.DEBUG, 'searchEvents'),
      map(events => events.slice(0, 5)) // Limit to 5 suggestions
    );
  }

  searchFullEvents(query: string): Observable<EventInformation[]> {
    return this.http.get<EventInformation[]>(`${this.apiUrl}/search?v=1&q=${encodeURIComponent(query)}`).pipe(
      debug(RxJsLoggingLevel.DEBUG, 'searchFullEvents'),
      map(events => events.slice(0, 10)) // Limit to 10 suggestions
    );
  }

  getEvent$(eventId: number): Observable<EventInformation | null> {
    this.eventSignal.set(null);
    if (!eventId) {
      return of(null);
    }

    if (this.existsInCache(eventId)) {
      return this.cache.get(eventId)!.pipe(
        tap((event) => this.eventSignal.set(event))
      );
    }

    const obs$ = this.getEventById$(eventId).pipe(
      switchMap((resp) => {
        const event: EventInformation = resp?.event;
        if (event) {
          event.locations.forEach((loc) => (loc.displayAddress = this.util.getEventDisplayAddress(loc)));
        }

        this.eventSignal.set(event);
        return of(event);
      }),
      shareReplay(1)
    );

    this.cache.set(eventId, obs$);
    return obs$;
  }

  getEventOpportunities$(eventId: number): Observable<EventOpportunity[]> {
    return this.getOpportunities$(eventId).pipe(
      map((resp) => {
        this.eventOpportunitiesSignal.set(resp.eventOpportunities);
        return resp.eventOpportunities;
      }));
  }

  private getEventById$(id: number) {
    return this.http.get<{ event: EventInformation }>(`${this.apiUrl}/${id}`).pipe(
      debug(RxJsLoggingLevel.DEBUG, 'getEvent'),
      catchError((e) => this.errorService.handleError(e, 'Error fetching event.'))
    );
  }

  private getOpportunities$(eventId: number) {
    return this.http.get<{ eventOpportunities: EventOpportunity[] }>(`${this.apiUrl}/${eventId}/opportunities`).pipe(
      debug(RxJsLoggingLevel.DEBUG, 'getOpportunities'),
      catchError((e) => this.errorService.handleError(e, 'Error fetching opportunities.'))
    );
  }

  private existsInCache(eventId: number) {
    const ageOfCacheInMilliseconds = new Date().getTime() - this.cacheTime;
    if (ageOfCacheInMilliseconds > 1000 * 60) {
      this.cache.clear();
      this.cacheTime = new Date().getTime();
    }

    return this.cache.has(eventId);
  }
}
