import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { EventLocation } from '@app/event/models/event-location.model';
import { EventOpportunity } from '@app/event/models/event-opportunity.model';
import { ApiResult } from '@app/models/api-result.model';
import { debug, RxJsLoggingLevel } from '@app/operators/debug';
import { UtilService } from '@app/services/util.service';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, shareReplay, switchMap, tap } from 'rxjs/operators';
import { DUMMY_EVENTS } from 'src/data/dummy-events';
import { DUMMY_OPPORTUNITIES } from 'src/data/dummy-opps';
import { EventInformation } from './models/event-information.model';

@Injectable()
export class EventService {
  private http = inject(HttpClient);
  private cache = new Map<number, Observable<EventInformation | null>>();
  private cacheTime = 0;


  private eventSignal = signal<EventInformation | null>(null);
  event = this.eventSignal.asReadonly();

  private eventLocationsSignal = signal<EventLocation[]>([]);
  eventLocations = this.eventLocationsSignal.asReadonly();

  private eventOpportunitiesSignal = signal<EventOpportunity[]>([]);
  eventOpportunities = this.eventOpportunitiesSignal.asReadonly();

  private util = inject(UtilService);

  constructor() { }

  getEvent$(eventId: number): Observable<EventInformation | null> {
    if (!eventId) {
      return of(null);
    }

    if (this.existsInCache(eventId)) {
      return this.cache.get(eventId)!.pipe(
        tap((event) => this.eventSignal.set(event))
      );
    }

    const obs$ = this.getEventById$(eventId).pipe(
      switchMap((resp) => this.getEventDateRange$(resp.event)),
      switchMap((res: ApiResult) => {
        const event = res.retVal?.event;
        if (event) {
          event.eventPreviewUrl = `/event/${event.eventId}`;
          event.minDate = res.retVal?.minDate;
          event.maxDate = res.retVal?.maxDate;
        }

        this.eventSignal.set(event);
        return of(event);
      }),
      shareReplay(1)
    );

    this.cache.set(eventId, obs$);
    return obs$;
  }

  getEventLocations$(eventId: number): Observable<ApiResult> {
    const res: ApiResult = {
      hasError: false,
      retVal: {
        locations: DUMMY_EVENTS.find((e) => e.eventId === eventId)?.locations || [],
        upcomingOpportunities: DUMMY_OPPORTUNITIES.filter((opp) => opp.eventId === eventId).slice(0, 3),
      },
    };

    return of(res).pipe(
      tap(() => {
        const locations = res.retVal.locations as EventLocation[];
        locations.forEach((loc) => (loc.displayAddress = this.util.getEventDisplayAddress(loc)));
        this.eventLocationsSignal.set(locations);
        this.eventOpportunitiesSignal.set(res.retVal.upcomingOpportunities);
      })
    );
  }

  getEventOpportunities$(eventLocation: EventLocation): Observable<ApiResult> {
    const res: ApiResult = {
      hasError: false,
      retVal: DUMMY_OPPORTUNITIES.filter((opp) => opp.locationId === eventLocation.locationId),
    };
    return of(res).pipe(delay(100));
  }

  getEventDateRange$(event: EventInformation): Observable<ApiResult> {
    const opportunities = DUMMY_OPPORTUNITIES.filter((opp) => opp.eventId === event.eventId).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    if (!opportunities.length) {
      return of({ hasError: true, retVal: null });
    }

    const res: ApiResult = {
      hasError: false,
      retVal: {
        event,
        minDate: opportunities[0].startDate,
        maxDate: opportunities[opportunities.length - 1].startDate,
      },
    };

    return of(res).pipe(delay(100));
  }


  getEventById$(id: number) {
    return this.http.get<{ event: EventInformation }>(`http://localhost:3000/event/${id}`).pipe(
      debug(RxJsLoggingLevel.DEBUG, 'getEvent'),
      catchError((e) => {
        return throwError(() => new Error('Error fetching event.'));
      }),
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
