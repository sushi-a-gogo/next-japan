import { Component, input } from '@angular/core';
import { OpportunitySelectorComponent } from "@app/features/events/ui/opportunity-selector/opportunity-selector.component";
import { OpportunityTimestampComponent } from "@app/features/events/ui/opportunity-timestamp/opportunity-timestamp.component";
import { ButtonComponent } from '@app/shared/components/button/button.component';
import { EventOpportunity } from '@features/events/models/event-opportunity.model';

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
