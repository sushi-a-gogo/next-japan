import { Component, input } from '@angular/core';
import { EventOpportunity } from '@app/models/event/event-opportunity.model';
import { ButtonComponent } from '@app/shared/button/button.component';
import { OpportunitySelectorComponent } from "@app/shared/opportunity-selector/opportunity-selector.component";
import { OpportunityTimestampComponent } from "@app/shared/opportunity-timestamp/opportunity-timestamp.component";

@Component({
  selector: 'app-event-opportunity',
  imports: [ButtonComponent, OpportunitySelectorComponent, OpportunityTimestampComponent],
  templateUrl: './event-opportunity.component.html',
  styleUrl: './event-opportunity.component.scss'
})
export class EventOpportunityComponent {
  //private eventService = inject(EventService);
  opportunity = input.required<EventOpportunity>();
  //location = computed(() => this.eventService.eventData().locations.find((l) => l.locationId === this.opportunity().locationId));
}
