import { Component, input } from '@angular/core';
import { EventOpportunity } from '@app/event/models/event-opportunity.model';
import { OpportunityCardComponent } from "@app/shared/opportunity-card/opportunity-card.component";
import { OpportunitySelectorComponent } from "@app/shared/opportunity-selector/opportunity-selector.component";

@Component({
  selector: 'app-event-opportunity',
  imports: [OpportunityCardComponent, OpportunitySelectorComponent],
  templateUrl: './event-opportunity.component.html',
  styleUrl: './event-opportunity.component.scss'
})
export class EventOpportunityComponent {
  opportunity = input.required<EventOpportunity>();
}
