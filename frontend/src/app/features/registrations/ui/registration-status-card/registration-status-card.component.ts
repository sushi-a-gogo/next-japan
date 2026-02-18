import { DatePipe } from '@angular/common';
import { Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@app/core/auth/auth.service';
import { RegistrationSelectionService } from '@app/features/registrations/services/registration-selection.service';
import { RegistrationService } from '@app/features/registrations/services/registration.service';
import { ButtonComponent } from '@app/shared/components/button/button.component';

@Component({
  selector: 'app-registration-status-card',
  imports: [DatePipe, RouterLink, ButtonComponent],
  templateUrl: './registration-status-card.component.html',
  styleUrl: './registration-status-card.component.scss',
})
export class RegistrationStatusCardComponent {
  private auth = inject(AuthService);
  private selectionService = inject(RegistrationSelectionService);
  private registrationService = inject(RegistrationService);

  eventId = input<string>();
  startRegistration = output();
  loaded = computed(() =>
    this.registrationService.hasCheckedUserEventRegistrations()
  );

  eventRegistration = computed(() => {
    if (!this.registrationService.hasCheckedUserEventRegistrations()) return null;

    const regs = this.registrationService.userEventRegistrations()
      .filter(r => r.opportunity.eventId === this.eventId());

    return regs.length ? regs[0] : null;
  });

  viewRegistration() {
    this.selectionService.selectRegistration(this.eventRegistration()!);
  }
}
