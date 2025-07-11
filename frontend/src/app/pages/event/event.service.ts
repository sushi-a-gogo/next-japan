import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { MapLocation } from '@app/models/map-location.model';
import { debug, RxJsLoggingLevel } from '@app/operators/debug';
import { EventOpportunity } from '@app/pages/event/models/event-opportunity.model';
import { ErrorService } from '@app/services/error.service';
import { EventsService } from '@app/services/events.service';
import { UtilService } from '@app/services/util.service';
import { environment } from '@environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { EventInformation } from './models/event-information.model';

@Injectable()
export class EventService {
  private http = inject(HttpClient);
  private cache = new Map<string, Observable<EventInformation | null>>();
  private cacheTime = 0;

  private eventSignal = signal<EventInformation | null>(null);
  event = this.eventSignal.asReadonly();

  private eventLocationsSignal = signal<MapLocation[]>([]);
  eventLocations = this.eventLocationsSignal.asReadonly();

  private eventOpportunitiesSignal = signal<EventOpportunity[]>([]);
  eventOpportunities = this.eventOpportunitiesSignal.asReadonly();

  private savedEventService = inject(EventsService);
  private errorService = inject(ErrorService);
  private util = inject(UtilService);
  private apiUrl = `${environment.apiUrl}/api/event`;

  getEvent$(eventId: string): Observable<EventInformation | null> {
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
      switchMap((event) => {
        this.eventSignal.set(event);
        return of(event);
      }),
      shareReplay(1)
    );

    this.cache.set(eventId, obs$);
    return obs$;
  }

  getEventLocations$(eventId: string): Observable<MapLocation[]> {
    return this.getLocations$(eventId).pipe(
      map((resp) => {
        const eventLocations: MapLocation[] = resp.eventLocations;
        eventLocations.forEach((loc: MapLocation) => (loc.displayAddress = this.util.getEventDisplayAddress(loc)));
        this.eventLocationsSignal.set(eventLocations);
        return eventLocations;
      }));
  }

  getEventOpportunities$(eventId: string): Observable<EventOpportunity[]> {
    return this.getOpportunities$(eventId).pipe(
      map((resp) => {
        this.eventOpportunitiesSignal.set(resp.eventOpportunities);
        return resp.eventOpportunities;
      }));
  }

  private getEventById$(id: string) {
    const isMockEvent = id?.startsWith("next-");
    if (!isMockEvent) {
      return this.savedEventService.getEvent$(id);
    }

    return this.http.get<EventInformation>(`${this.apiUrl}/${id}`).pipe(
      debug(RxJsLoggingLevel.DEBUG, 'getEvent'),
      map((resp) => resp.event as EventInformation),
      catchError((e) => this.errorService.handleError(e, 'Error fetching event.'))
    );
  }

  private getLocations$(eventId: string) {
    return this.http.get<{ eventLocations: MapLocation[] }>(`${this.apiUrl}/${eventId}/locations`).pipe(
      debug(RxJsLoggingLevel.DEBUG, 'getLocations'),
      catchError((e) => this.errorService.handleError(e, 'Error fetching locations.'))
    );
  }

  private getOpportunities$(eventId: string) {
    return this.http.get<{ eventOpportunities: EventOpportunity[] }>(`${this.apiUrl}/${eventId}/opportunities`).pipe(
      debug(RxJsLoggingLevel.DEBUG, 'getOpportunities'),
      catchError((e) => this.errorService.handleError(e, 'Error fetching opportunities.'))
    );
  }

  private existsInCache(eventId: string) {
    const ageOfCacheInMilliseconds = new Date().getTime() - this.cacheTime;
    if (ageOfCacheInMilliseconds > 1000 * 60) {
      this.cache.clear();
      this.cacheTime = new Date().getTime();
    }

    return this.cache.has(eventId);
  }
}
