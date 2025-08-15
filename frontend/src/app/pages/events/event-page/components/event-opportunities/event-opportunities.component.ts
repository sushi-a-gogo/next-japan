import { Component, computed, inject } from '@angular/core';
import { EventService } from '@app/pages/events/event-page/event.service';
import { EventRegistrationService } from '@app/services/event-registration.service';
import { EventOpportunityComponent } from "./event-opportunity/event-opportunity.component";

@Component({
  selector: 'app-event-opportunities',
  imports: [EventOpportunityComponent],
  templateUrl: './event-opportunities.component.html',
  styleUrl: './event-opportunities.component.scss'
})
export class EventOpportunitiesComponent {
  private eventService = inject(EventService);
  private eventRegistrationService = inject(EventRegistrationService);

  opportunities = computed(() => {
    //const eventRegistrations = this.initialized ? [] : this.eventRegistrationService.userEventRegistrations();
    const opportunities = this.eventService.eventData().opportunities
    //   .filter((opp) => {
    //   const context = getRegistrationContext(opp, eventRegistrations);
    //   return !context;
    // });
    opportunities.sort((a, b) => new Date(a.startDate) < new Date(b.startDate) ? -1 : 1);
    return opportunities.slice(0, 4);
  });
}
