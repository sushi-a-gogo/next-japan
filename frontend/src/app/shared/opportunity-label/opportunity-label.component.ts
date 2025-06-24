import { Component, input } from '@angular/core';
import { EventOpportunity } from '@app/pages/event/models/event-opportunity.model';
import { DateLabelComponent } from "../date-label/date-label.component";

@Component({
  selector: 'app-opportunity-label',
  imports: [DateLabelComponent],
  templateUrl: './opportunity-label.component.html',
  styleUrl: './opportunity-label.component.scss'
})
export class OpportunityLabelComponent {
  opportunity = input.required<EventOpportunity>();
  iconColor = input<string>();

}
