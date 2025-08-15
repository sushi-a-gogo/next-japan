import { TitleCasePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EventOpportunity } from '@app/models/event/event-opportunity.model';
import { getRegistrationContext } from '@app/models/event/event-registration.model';
import { AuthMockService } from '@app/services/auth-mock.service';
import { EventRegistrationService } from '@app/services/event-registration.service';
import { EventSelectionService } from '@app/services/event-selection.service';

@Component({
  selector: 'app-opportunity-selector',
  imports: [TitleCasePipe, MatRippleModule, MatTooltipModule],
  templateUrl: './opportunity-selector.component.html',
  styleUrl: './opportunity-selector.component.scss'
})
export class OpportunitySelectorComponent {
  private auth = inject(AuthMockService);
  private registrationService = inject(EventRegistrationService);
  private selectionService = inject(EventSelectionService);

  opportunity = input.required<EventOpportunity>();
  isAuthenticated = this.auth.isAuthenticated;

  context = computed(() => getRegistrationContext(this.opportunity(), this.registrationService.userEventRegistrations()));

  selectOpportunity() {
    this.selectionService.selectOpportunity(this.opportunity());
  }
}
