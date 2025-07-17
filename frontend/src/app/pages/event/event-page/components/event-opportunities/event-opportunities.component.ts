import { Component, computed, inject } from '@angular/core';
import { EventService } from '@app/pages/event/event-page/event.service';
import { EventOpportunityComponent } from "./event-opportunity/event-opportunity.component";

@Component({
  selector: 'app-event-opportunities',
  imports: [EventOpportunityComponent],
  templateUrl: './event-opportunities.component.html',
  styleUrl: './event-opportunities.component.scss'
})
export class EventOpportunitiesComponent {
  private eventService = inject(EventService);
  opportunities = computed(() => this.eventService.eventData().opportunities
    .sort((a, b) => new Date(a.startDate) < new Date(b.startDate) ? -1 : 1).slice(0, 3));
}
