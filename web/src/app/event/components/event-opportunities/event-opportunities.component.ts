import { Component, inject } from '@angular/core';
import { EventService } from '@app/event/event.service';
import { EventOpportunityComponent } from "./event-opportunity/event-opportunity.component";

@Component({
  selector: 'app-event-opportunities',
  imports: [EventOpportunityComponent],
  templateUrl: './event-opportunities.component.html',
  styleUrl: './event-opportunities.component.scss'
})
export class EventOpportunitiesComponent {
  private eventService = inject(EventService);
  opportunities = this.eventService.eventOpportunities;
}
