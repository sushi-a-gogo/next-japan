import { computed, inject, Injectable, signal } from '@angular/core';
import { EventLocation } from '@app/features/events/models/event-location.model';
import { EventLocationService } from '@app/features/events/services/event-location.service';
import { EventOpportunityService } from '@app/features/events/services/event-opportunity.service';
import { EventsService } from '@app/features/events/services/events.service';
import { EventInformation } from '@features/events/models/event-information.model';
import { EventOpportunity } from '@features/events/models/event-opportunity.model';
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
      location: this.eventLocation(),
      opportunities: this.eventOpportunities()
    };
  });

  private eventSignal = signal<EventInformation | null>(null);
  private event = this.eventSignal.asReadonly();

  private eventLocationSignal = signal<EventLocation | null>(null);
  private eventLocation = this.eventLocationSignal.asReadonly();

  private eventOpportunitiesSignal = signal<EventOpportunity[]>([]);
  private eventOpportunities = this.eventOpportunitiesSignal.asReadonly();

  private eventsService = inject(EventsService);
  private locationService = inject(EventLocationService);
  private opportunityService = inject(EventOpportunityService);

  loadEvent$(eventId: string) {
    this.eventSignal.set(null);
    this.eventLocationSignal.set(null);
    this.eventOpportunitiesSignal.set([]);

    const observables = {
      event: this.getEventById$(eventId),
      location: this.getEventLocation$(eventId),
      opportunities: this.getEventOpportunities$(eventId)
    };

    return forkJoin(observables).pipe(
      tap((res) => {

        this.eventSignal.set(res.event);
        this.eventLocationSignal.set(res.location);
        this.eventOpportunitiesSignal.set(res.opportunities?.sort((a, b) => {
          const t1 = new Date(a.startDate).getTime();
          const t2 = new Date(b.startDate).getTime();
          return t1 - t2;
        }));
      })
    );
  }

  private getEventById$(eventId: string) {
    return this.eventsService.getEvent$(eventId);
  }

  private getEventLocation$(eventId: string): Observable<EventLocation | null> {
    return this.locationService.getEventLocation$(eventId);
  }

  private getEventOpportunities$(eventId: string): Observable<EventOpportunity[]> {
    return this.opportunityService.getEventOpportunities$(eventId);
  }
}
