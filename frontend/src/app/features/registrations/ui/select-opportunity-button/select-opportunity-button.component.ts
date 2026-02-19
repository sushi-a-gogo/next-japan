import { TitleCasePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { AuthService } from '@app/core/auth/auth.service';
import { EventOpportunity } from '@app/features/events/models/event-opportunity.model';
import { getRegistrationContext } from '@app/features/registrations/models/event-registration.model';
import { RegistrationSelectionService } from '@app/features/registrations/services/registration-selection.service';
import { RegistrationService } from '@app/features/registrations/services/registration.service';
import { ButtonComponent } from '@app/shared/ui/button/button.component';

@Component({
  selector: 'app-select-opportunity-button',
  imports: [TitleCasePipe, ButtonComponent],
  templateUrl: './select-opportunity-button.component.html',
  styleUrl: './select-opportunity-button.component.scss'
})
export class SelectOpportunityButtonComponent {
  private auth = inject(AuthService);
  private registrationService = inject(RegistrationService);
  private selectionService = inject(RegistrationSelectionService);

  opportunity = input.required<EventOpportunity>();
  isAuthenticated = this.auth.isAuthenticated;

  context = computed(() => getRegistrationContext(this.opportunity(), this.registrationService.userEventRegistrations()));

  selectOpportunity() {
    console.log(this.context());
    this.selectionService.selectOpportunity(this.opportunity());
  }

  viewOpportunity() {
    this.selectionService.selectRegistration(this.context()?.registration!);
  }
}
