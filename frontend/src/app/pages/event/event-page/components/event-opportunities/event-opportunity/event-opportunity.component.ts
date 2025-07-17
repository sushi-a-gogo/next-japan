import { Component, computed, inject, input } from '@angular/core';
import { EventOpportunity } from '@app/models/event/event-opportunity.model';
import { EventService } from '@app/pages/event/event-page/event.service';
import { AddressStripComponent } from "@app/shared/address-strip/address-strip.component";
import { OpportunitySelectorComponent } from "@app/shared/opportunity-selector/opportunity-selector.component";
import { OpportunityTimestampComponent } from "@app/shared/opportunity-timestamp/opportunity-timestamp.component";

@Component({
  selector: 'app-event-opportunity',
  imports: [OpportunitySelectorComponent, AddressStripComponent, OpportunityTimestampComponent],
  templateUrl: './event-opportunity.component.html',
  styleUrl: './event-opportunity.component.scss'
})
export class EventOpportunityComponent {
  private eventService = inject(EventService);
  opportunity = input.required<EventOpportunity>();
  location = computed(() => this.eventService.eventData().locations
    .find((l) => l.locationId === this.opportunity().locationId));
}
