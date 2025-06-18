import { Component, inject, input, output } from '@angular/core';
import { EventOpportunity } from '@app/event/models/event-opportunity.model';
import { SelectionService } from '@app/services/selection.service';
import { OpportunityLabelComponent } from "../../../../shared/opportunity-label/opportunity-label.component";

@Component({
  selector: 'app-registration-card',
  imports: [OpportunityLabelComponent],
  templateUrl: './registration-card.component.html',
  styleUrl: './registration-card.component.scss'
})
export class RegistrationCardComponent {
  private selectionService = inject(SelectionService);

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
