import { inject, Injectable } from '@angular/core';
import { DateTimeService } from '@app/core/services/date-time.service';
import { EventOpportunityService } from '@app/features/events/services/event-opportunity.service';
import { EventsService } from '@app/features/events/services/events.service';
import { forkJoin, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventHomeService {
  private dateTime = inject(DateTimeService);
  private eventsService = inject(EventsService);
  private opportunityService = inject(EventOpportunityService);

  fetchEvents$() {
    const observables = {
      events: this.eventsService.get$(),
      opportunities: this.opportunityService.getOpportunities$(),
    };

    return forkJoin(observables).pipe(
      map((res) => {
        const events = res.events;
        const opportunities = res.opportunities.sort(this.dateTime.sortCalendarDates);
        return events.map((event) => {
          const eventOpportunities = opportunities.filter((o) => o.eventId === event.eventId);
          const nextOpportunity = eventOpportunities.length > 0 ? eventOpportunities[0] : undefined;
          const nextCalendarDate = nextOpportunity
            ? this.opportunityService.getCleanDate(nextOpportunity)
            : undefined

          return {
            ...event,
            nextCalendarDate
          };
        });
      })
    );
  }
}
