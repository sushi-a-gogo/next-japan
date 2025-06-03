import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { EventLocation } from '@app/event/models/event-location.model';
import { EventOpportunity } from '@app/event/models/event-opportunity.model';
import { ApiResult } from '@app/models/api-result.model';
import { UtilService } from '@app/services/util.service';
import { Observable, of } from 'rxjs';
import { delay, switchMap, tap } from 'rxjs/operators';
import { DUMMY_EVENTS } from 'src/data/dummy-events';
import { DUMMY_OPPORTUNITIES } from 'src/data/dummy-opps';
import { EventInformation } from './models/event-information.model';

@Injectable()
export class EventService {
  private http = inject(HttpClient);

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

    const event = DUMMY_EVENTS.find((e) => e.eventId === eventId) || null;
    return of(true).pipe(
      switchMap(() => this.getEventDateRange$(eventId)),
      switchMap((res: ApiResult) => {
        if (event) {
          event.eventPreviewUrl = `/event/${event.eventId}`;
          event.minDate = res.retVal?.minDate;
          event.maxDate = res.retVal?.maxDate;
        }

        this.eventSignal.set(event);

        return of(event);
      })
    );
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

  private validateEventDate(dateValue?: string) {
    return dateValue && dateValue !== '0001-01-01T00:00:00' ? dateValue : undefined;
  }

  getEventDateRange$(eventId: number): Observable<ApiResult> {
    const event = DUMMY_EVENTS.find((e) => e.eventId === eventId);
    if (!event) {
      return of({ hasError: true, retVal: null });
    }

    const opportunities = DUMMY_OPPORTUNITIES.filter((opp) => opp.eventId === eventId).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    if (!opportunities.length) {
      return of({ hasError: true, retVal: null });
    }

    const res: ApiResult = {
      hasError: false,
      retVal: {
        minDate: opportunities[0].startDate,
        maxDate: opportunities[opportunities.length - 1].startDate,
      },
    };

    return of(res).pipe(delay(100));
  }

}
