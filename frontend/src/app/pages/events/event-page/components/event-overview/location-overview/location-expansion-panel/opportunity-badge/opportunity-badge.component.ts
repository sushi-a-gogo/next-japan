import { Component, input } from '@angular/core';
import { RegistrationContext, RegistrationStatus } from '@app/models/event/event-registration.model';

@Component({
  selector: 'app-opportunity-badge',
  imports: [],
  templateUrl: './opportunity-badge.component.html',
  styleUrl: './opportunity-badge.component.scss'
})
export class OpportunityBadgeComponent {
  status = RegistrationStatus;
  context = input.required<RegistrationContext>();
}
