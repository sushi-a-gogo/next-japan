import { TitleCasePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { AuthService } from '@app/core/auth/auth.service';
import { EventRegistrationService } from '@app/features/events/services/event-registration.service';
import { EventSelectionService } from '@app/features/events/services/event-selection.service';
import { ButtonComponent } from '@app/shared/components/button/button.component';
import { EventOpportunity } from '@features/events/models/event-opportunity.model';
import { getRegistrationContext } from '@features/events/models/event-registration.model';

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
  isAuthenticated = computed(() => this.auth.isAuthenticated());

  context = computed(() => getRegistrationContext(this.opportunity(), this.registrationService.userEventRegistrations()));

  selectOpportunity() {
    this.selectionService.selectOpportunity(this.opportunity());
  }
}
