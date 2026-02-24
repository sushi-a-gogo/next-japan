import { DatePipe } from '@angular/common';
import { Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@app/core/auth/auth.service';
import { DialogService } from '@app/core/services/dialog.service';
import { RegistrationService } from '@app/features/registrations/services/registration.service';
import { ButtonComponent } from '@app/shared/ui/button/button.component';
import { EventRegistration } from '../../models/event-registration.model';
import { ManageRegistrationDialogComponent } from '../manage-registration-dialog/manage-registration-dialog.component';

@Component({
  selector: 'app-registration-status-card',
  imports: [DatePipe, RouterLink, ButtonComponent],
  templateUrl: './registration-status-card.component.html',
  styleUrl: './registration-status-card.component.scss',
})
export class RegistrationStatusCardComponent {
  private auth = inject(AuthService);
  private dialogService = inject(DialogService);
  private registrationService = inject(RegistrationService);

  eventId = input<string>();
  startRegistration = output();

  loaded = computed(() => this.auth.loginStatus() !== 'pending' && !this.registrationService.pendingRefreshSignal());

  eventRegistration = computed(() => {
    const regs = this.registrationService.userEventRegistrations()
      .filter(r => r.opportunity.eventId === this.eventId());
    ;
    return regs.length ? regs[0] : null;
  });

  viewRegistration() {
    this.dialogService.open<EventRegistration>({
      component: ManageRegistrationDialogComponent,
      data: this.eventRegistration()!,
      size: 'sm'
    });
  }
}
