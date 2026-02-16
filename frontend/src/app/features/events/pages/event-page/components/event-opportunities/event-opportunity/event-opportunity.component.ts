import { Component, input } from '@angular/core';
import { EventOpportunity } from '@app/features/events/models/event-opportunity.model';
import { EventOpportunityCardComponent } from "@app/features/events/ui/event-opportunity-card/event-opportunity-card.component";
import { EventOpportunitySelectorComponent } from "@app/features/events/ui/event-opportunity-selector/event-opportunity-selector.component";
import { ButtonComponent } from '@app/shared/components/button/button.component';

@Component({
  selector: 'app-event-opportunity',
  imports: [ButtonComponent, EventOpportunitySelectorComponent, EventOpportunityCardComponent],
  templateUrl: './event-opportunity.component.html',
  styleUrl: './event-opportunity.component.scss'
})
export class EventOpportunityComponent {
  opportunity = input.required<EventOpportunity>();
}
