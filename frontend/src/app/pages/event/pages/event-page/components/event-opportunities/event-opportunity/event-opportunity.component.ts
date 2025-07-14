import { Component, input } from '@angular/core';
import { EventOpportunity } from '@app/pages/event/models/event-opportunity.model';
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
  opportunity = input.required<EventOpportunity>();
}
