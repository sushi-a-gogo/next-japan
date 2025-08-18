import { Component, inject, OnInit, signal } from '@angular/core';
import { EventOpportunity } from '@app/models/event/event-opportunity.model';
import { getRegistrationContext } from '@app/models/event/event-registration.model';
import { EventService } from '@app/pages/events/event-page/event.service';
import { EventRegistrationService } from '@app/services/event-registration.service';
import { EventOpportunityComponent } from "./event-opportunity/event-opportunity.component";

@Component({
  selector: 'app-event-opportunities',
  imports: [EventOpportunityComponent],
  templateUrl: './event-opportunities.component.html',
  styleUrl: './event-opportunities.component.scss'
})
export class EventOpportunitiesComponent implements OnInit {
  private eventService = inject(EventService);
  private eventRegistrationService = inject(EventRegistrationService);

  opportunities = signal<EventOpportunity[]>([]);

  ngOnInit(): void {
    const eventRegistrations = this.eventRegistrationService.userEventRegistrations();
    const availableOpportunities = this.eventService.eventData().opportunities
      .filter((opp) => {
        const context = getRegistrationContext(opp, eventRegistrations);
        return !context;
      });
    availableOpportunities.sort((a, b) => new Date(a.startDate) < new Date(b.startDate) ? -1 : 1);
    this.opportunities.set(availableOpportunities.slice(0, 3));
  }
}
