import { Component, inject, OnInit, signal } from '@angular/core';
import { EventOpportunity } from '@app/features/events/models/event-opportunity.model';
import { getRegistrationContext } from '@app/features/events/models/event-registration.model';
import { EventService } from '@app/features/events/pages/event-page/event.service';
import { EventRegistrationService } from '@app/features/events/services/event-registration.service';
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
    this.opportunities.set(availableOpportunities.slice(0, 6));
  }
}
