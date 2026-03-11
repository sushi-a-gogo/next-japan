import { inject, Injectable } from '@angular/core';
import { EventInformation } from '@app/features/events/models/event-information.model';
import { EventLocation } from '@app/features/events/models/event-location.model';
import { EventOpportunity } from '@app/features/events/models/event-opportunity.model';
import { EventLocationService } from '@app/features/events/services/event-location.service';
import { EventOpportunityService } from '@app/features/events/services/event-opportunity.service';
import { EventsService } from '@app/features/events/services/events.service';
import { RegistrationRequestTicket } from '@app/features/registrations/models/registration-request-ticket.model';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { EventPageData } from './event-page-data.model';

@Injectable({
  providedIn: 'root'
})
export class EventPageService {
  private eventsService = inject(EventsService);
  private locationService = inject(EventLocationService);
  private opportunityService = inject(EventOpportunityService);

  loadEventData$(eventId: string | null): Observable<EventPageData> {
    if (!eventId) {
      const noData: EventPageData = {
        event: null,
        location: null,
        opportunities: [],
        tickets: [],
        error: null
      };
      return of(noData);
    }

    return forkJoin({
      event: this.getEventById$(eventId),
      location: this.getEventLocation$(eventId),
      opportunities: this.getEventOpportunities$(eventId)
    }).pipe(
      map((res) => this.mapEventData(res)),
      catchError((err) => {
        const errorData: EventPageData = {
          event: null,
          location: null,
          opportunities: [],
          tickets: [],
          error: err
        };
        return of(errorData); // or of(null structure)
      }));
  }

  private mapEventData(res: { event: EventInformation | null, location: EventLocation | null, opportunities: EventOpportunity[] }) {
    const opportunities = [...(res.opportunities ?? [])].sort(this.sortByDate);
    const tickets: RegistrationRequestTicket[] = res.event && res.location ? opportunities.map((opportunity) => ({
      eventTitle: res.event!.eventTitle || 'Event Title Missing!',
      location: res.location! || 'Location Name Missing!',
      opportunity
    })) : [];

    const data: EventPageData = {
      event: res.event,
      location: res.location,
      opportunities,
      tickets,
      error: null
    };

    return data;
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
