import { Component, input } from '@angular/core';
import { EventOpportunity } from '@app/pages/event/models/event-opportunity.model';
import { AddressStripComponent } from "../address-strip/address-strip.component";
import { EventBreadcrumbComponent } from "../event-breadcrumb/event-breadcrumb.component";
import { OpportunityLabelComponent } from "../opportunity-label/opportunity-label.component";

@Component({
  selector: 'app-opportunity-card',
  imports: [EventBreadcrumbComponent, AddressStripComponent, OpportunityLabelComponent],
  templateUrl: './opportunity-card.component.html',
  styleUrl: './opportunity-card.component.scss'
})
export class OpportunityCardComponent {
  opportunity = input.required<EventOpportunity>();
  showDirections = input<boolean>(false);
  showNotes = input<boolean>(false);
}
