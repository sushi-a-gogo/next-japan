import { computed, inject, Injectable, signal } from '@angular/core';
import { MapLocation } from '@app/models/map-location.model';
import { EventsService } from '@app/services/events.service';
import { LocationService } from '@app/services/location.service';
import { OpportunityService } from '@app/services/opportunity.service';
import { forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EventInformation } from '../../models/event-information.model';
import { EventOpportunity } from '../../models/event-opportunity.model';

/**
 * Service to manage event page data.
 * I wanted to explore using signals for data management in place of RXJS observables
 * This service is a wrapper over different event services, injecting their results
 * into signals that are referenced by the event page components.
 */
@Injectable()
export class EventService {
  eventData = computed(() => ({
    event: this.event(),
    locations: this.eventLocations(),
    opportunities: this.eventOpportunities()
  }));

  private eventSignal = signal<EventInformation | null>(null);
  event = this.eventSignal.asReadonly();

  private eventLocationsSignal = signal<MapLocation[]>([]);
  eventLocations = this.eventLocationsSignal.asReadonly();

  private eventOpportunitiesSignal = signal<EventOpportunity[]>([]);
  eventOpportunities = this.eventOpportunitiesSignal.asReadonly();

  private eventsService = inject(EventsService);
  private locationService = inject(LocationService);
  private opportunityService = inject(OpportunityService);

  loadEvent$(eventId: string) {
    this.eventSignal.set(null);
    this.eventLocationsSignal.set([]);
    this.eventOpportunitiesSignal.set([]);

    const observables = {
      event: this.getEventById$(eventId),
      locations: this.getEventLocations$(eventId),
      opportunities: this.getEventOpportunities$(eventId),
    };

    return forkJoin(observables);
  }

  private getEventById$(eventId: string) {
    return this.eventsService.getEvent$(eventId).pipe(
      tap((event) => this.eventSignal.set(event))
    )
  }

  private getEventLocations$(eventId: string): Observable<MapLocation[]> {
    return this.locationService.getEventLocations$(eventId).pipe(
      tap((locations) => this.eventLocationsSignal.set(locations))
    );
  }

  private getEventOpportunities$(eventId: string): Observable<EventOpportunity[]> {
    return this.opportunityService.getEventOpportunities$(eventId).pipe(
      tap((opportunities) => this.eventOpportunitiesSignal.set(opportunities))
    );
  }
}
