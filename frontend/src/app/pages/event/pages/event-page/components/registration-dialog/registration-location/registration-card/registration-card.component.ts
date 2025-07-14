import { Component, inject, input, output } from '@angular/core';
import { EventOpportunity } from '@app/pages/event/models/event-opportunity.model';
import { EventSelectionService } from '@app/services/event-selection.service';
import { OpportunityTimestampComponent } from "@app/shared/opportunity-timestamp/opportunity-timestamp.component";

@Component({
  selector: 'app-registration-card',
  imports: [OpportunityTimestampComponent],
  templateUrl: './registration-card.component.html',
  styleUrl: './registration-card.component.scss'
})
export class RegistrationCardComponent {
  private selectionService = inject(EventSelectionService);

  opportunity = input.required<EventOpportunity>();
  allowRemoval = input<boolean>(false);
  remove = output();
  removed = false;

  removeSelection() {
    this.selectionService.selectOpportunity(this.opportunity(), false);
    this.removed = true;
    this.remove.emit();
  }


}
