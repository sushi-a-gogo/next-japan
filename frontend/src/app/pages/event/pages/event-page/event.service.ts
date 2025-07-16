import { inject, Injectable, signal } from '@angular/core';
import { MapLocation } from '@app/models/map-location.model';
import { EventsService } from '@app/services/events.service';
import { LocationService } from '@app/services/location.service';
import { OpportunityService } from '@app/services/opportunity.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
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

  getEvent$(eventId: string): Observable<EventInformation | null> {
    return this.eventsService.getEvent$(eventId).pipe(
      tap((event) => this.eventSignal.set(event))
    );
  }

  getEventLocations$(eventId: string): Observable<MapLocation[]> {
    return this.locationService.getEventLocations$(eventId).pipe(
      tap((locations) => this.eventLocationsSignal.set(locations))
    );
  }

  getEventOpportunities$(eventId: string): Observable<EventOpportunity[]> {
    return this.opportunityService.getEventOpportunities$(eventId).pipe(
      tap((opportunities) => this.eventOpportunitiesSignal.set(opportunities))
    );
  }
}
