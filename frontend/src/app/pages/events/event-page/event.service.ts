import { computed, inject, Injectable, signal } from '@angular/core';
import { EventInformation } from '@app/models/event/event-information.model';
import { EventOpportunity } from '@app/models/event/event-opportunity.model';
import { MapLocation } from '@app/models/map-location.model';
import { EventsService } from '@app/services/events.service';
import { LocationService } from '@app/services/location.service';
import { OpportunityService } from '@app/services/opportunity.service';
import { forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Service to manage event page data.
 * I wanted to explore using signals for data management in place of RXJS observables
 * This service is a wrapper over different event services, injecting their results
 * into signals that are referenced by the event page components.
 */
@Injectable()
export class EventService {
  eventData = computed(() => {
    return {
      event: this.event(),
      locations: this.eventLocations(),
      opportunities: this.eventOpportunities()
    };
  });

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

    return forkJoin(observables).pipe(
      tap((res) => {
        this.eventSignal.set(res.event);
        this.eventLocationsSignal.set(res.locations);
        this.eventOpportunitiesSignal.set(res.opportunities);
      })
    );
  }

  private getEventById$(eventId: string) {
    return this.eventsService.getEvent$(eventId);
  }

  private getEventLocations$(eventId: string): Observable<MapLocation[]> {
    return this.locationService.getEventLocations$(eventId);
  }

  private getEventOpportunities$(eventId: string): Observable<EventOpportunity[]> {
    return this.opportunityService.getEventOpportunities$(eventId);
  }
}
