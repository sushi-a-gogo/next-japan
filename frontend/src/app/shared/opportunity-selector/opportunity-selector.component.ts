import { TitleCasePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { EventOpportunity } from '@app/models/event/event-opportunity.model';
import { getRegistrationContext } from '@app/models/event/event-registration.model';
import { AuthService } from '@app/services/auth.service';
import { EventRegistrationService } from '@app/services/event-registration.service';
import { EventSelectionService } from '@app/services/event-selection.service';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-opportunity-selector',
  imports: [TitleCasePipe, ButtonComponent],
  templateUrl: './opportunity-selector.component.html',
  styleUrl: './opportunity-selector.component.scss'
})
export class OpportunitySelectorComponent {
  private auth = inject(AuthService);
  private registrationService = inject(EventRegistrationService);
  private selectionService = inject(EventSelectionService);

  opportunity = input.required<EventOpportunity>();
  isAuthenticated = computed(() => {
    return this.auth.isAuthenticated;
  });

  context = computed(() => getRegistrationContext(this.opportunity(), this.registrationService.userEventRegistrations()));

  selectOpportunity() {
    this.selectionService.selectOpportunity(this.opportunity());
  }
}
