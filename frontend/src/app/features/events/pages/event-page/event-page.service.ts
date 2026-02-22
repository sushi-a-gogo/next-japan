import { inject, Injectable, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { EventLocation } from '@app/features/events/models/event-location.model';
import { EventOpportunity } from '@app/features/events/models/event-opportunity.model';
import { EventLocationService } from '@app/features/events/services/event-location.service';
import { EventOpportunityService } from '@app/features/events/services/event-opportunity.service';
import { EventsService } from '@app/features/events/services/events.service';
import { RegistrationRequestTicket } from '@app/features/registrations/models/registration-request-ticket.model';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable()
export class EventPageService {
  private eventId = signal<string | null>(null);

  private eventData$ = toObservable(this.eventId).pipe(
    switchMap((id) => {
      if (!id) {
        // No ID → emit reset immediately
        return of({
          event: null,
          location: null,
          opportunities: [],
          tickets: [],
          error: null
        });
      }

      return forkJoin({
        event: this.getEventById$(id),
        location: this.getEventLocation$(id),
        opportunities: this.getEventOpportunities$(id)
      })
    }),
    map((res) => {
      const tickets: RegistrationRequestTicket[] = res.event && res.location ? res.opportunities.map((opportunity) => ({
        eventTitle: res.event!.eventTitle || 'Event Title Missing!',
        location: res.location! || 'Location Name Missing!',
        opportunity
      })) : [];

      const data = {
        event: res.event,
        location: res.location,
        opportunities: res.opportunities?.sort(this.sortByDate),
        tickets,
        error: null
      };

      return data;
    }),
    catchError((err) => {
      const data = {
        event: null,
        location: null,
        opportunities: null,
        tickets: null,
        error: err
      };
      return of(data); // or of(null structure)
    })
  );

  readonly eventData = toSignal(this.eventData$, {
    initialValue: {
      event: null,
      location: null,
      opportunities: [],
      tickets: [],
      error: null
    }
  });

  private eventsService = inject(EventsService);
  private locationService = inject(EventLocationService);
  private opportunityService = inject(EventOpportunityService);

  setEventId(id: string | null) {
    this.eventId.set(id);
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

  private sortByDate = (a: EventOpportunity, b: EventOpportunity) => {
    const t1 = new Date(a.startDate).getTime();
    const t2 = new Date(b.startDate).getTime();
    return t1 - t2;
  };
}
