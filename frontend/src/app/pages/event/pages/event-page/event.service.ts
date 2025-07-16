import { inject, Injectable, signal } from '@angular/core';
import { MapLocation } from '@app/models/map-location.model';
import { EventsService } from '@app/services/events.service';
import { LocationService } from '@app/services/location.service';
import { OpportunityService } from '@app/services/opportunity.service';
import { forkJoin, Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { EventInformation } from '../../models/event-information.model';
import { EventOpportunity } from '../../models/event-opportunity.model';

@Injectable()
export class EventService {
  private eventSignal = signal<EventInformation | null>(null);
  event = this.eventSignal.asReadonly();

  private eventLocationsSignal = signal<MapLocation[]>([]);
  eventLocations = this.eventLocationsSignal.asReadonly();

  private eventOpportunitiesSignal = signal<EventOpportunity[]>([]);
  eventOpportunities = this.eventOpportunitiesSignal.asReadonly();

  private eventsService = inject(EventsService);
  private locationService = inject(LocationService);
  private opportunityService = inject(OpportunityService);

  get$(eventId: string): Observable<EventInformation | null> {
    let event: EventInformation | null = null;
    const observables = {
      locations: this.getEventLocations$(eventId),
      opportunities: this.getEventOpportunities$(eventId),
    };

    return this.getEvent$(eventId).pipe(
      switchMap((ev) => {
        event = ev;
        return event ? forkJoin(observables) : of(null);
      }),
      switchMap(() => of(event))
    );
  }

  private getEvent$(eventId: string): Observable<EventInformation | null> {
    this.eventSignal.set(null);
    if (!eventId) {
      return of(null);
    }

    return this.eventsService.getEvent$(eventId).pipe(
      tap((event) => this.eventSignal.set(event))
    )
  }

  private getEventLocations$(eventId: string): Observable<MapLocation[]> {
    this.eventLocationsSignal.set([]);
    return this.locationService.getEventLocations$(eventId).pipe(
      tap((locations) => this.eventLocationsSignal.set(locations))
    );
  }

  private getEventOpportunities$(eventId: string): Observable<EventOpportunity[]> {
    this.eventOpportunitiesSignal.set([]);
    return this.opportunityService.getEventOpportunities$(eventId).pipe(
      tap((opportunities) => this.eventOpportunitiesSignal.set(opportunities))
    );
  }
}
