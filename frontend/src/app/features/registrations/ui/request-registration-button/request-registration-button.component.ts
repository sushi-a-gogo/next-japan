import { TitleCasePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { AuthService } from '@app/core/auth/auth.service';
import { getRegistrationContext } from '@app/features/registrations/models/event-registration.model';
import { RegistrationRequestTicket } from '@app/features/registrations/models/registration-request-ticket.model';
import { RegistrationSelectionService } from '@app/features/registrations/services/registration-selection.service';
import { RegistrationService } from '@app/features/registrations/services/registration.service';
import { ButtonComponent } from '@app/shared/ui/button/button.component';

@Component({
  selector: 'app-request-registration-button',
  imports: [TitleCasePipe, ButtonComponent],
  templateUrl: './request-registration-button.component.html',
  styleUrl: './request-registration-button.component.scss'
})
export class RequestRegistrationButtonComponent {
  private auth = inject(AuthService);
  private registrationService = inject(RegistrationService);
  private selectionService = inject(RegistrationSelectionService);

  ticket = input.required<RegistrationRequestTicket>();
  isAuthenticated = this.auth.isAuthenticated;

  context = computed(() => getRegistrationContext(this.ticket().opportunity, this.registrationService.userEventRegistrations()));

  requestRegistration() {
    this.selectionService.selectRegistrationRequest(this.ticket());
  }

  viewRegistration() {
    this.selectionService.selectRegistration(this.context()?.registration!);
  }
}
