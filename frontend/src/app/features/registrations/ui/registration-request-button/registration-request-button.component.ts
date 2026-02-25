import { TitleCasePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { AuthService } from '@app/core/auth/auth.service';
import { DialogService } from '@app/core/services/dialog.service';
import { EventRegistration, getRegistrationContext } from '@app/features/registrations/models/event-registration.model';
import { RegistrationRequestTicket } from '@app/features/registrations/models/registration-request-ticket.model';
import { RegistrationService } from '@app/features/registrations/services/registration.service';
import { ButtonComponent } from '@app/shared/ui/button/button.component';
import { RegistrationManageDialogComponent } from '../registration-manage-dialog/registration-manage-dialog.component';
import { RegistrationRequestDialogComponent } from '../registration-request-dialog/registration-request-dialog.component';

@Component({
  selector: 'app-registration-request-button',
  imports: [TitleCasePipe, ButtonComponent],
  templateUrl: './registration-request-button.component.html',
  styleUrl: './registration-request-button.component.scss'
})
export class RegistrationRequestButtonComponent {
  private auth = inject(AuthService);
  private registrationService = inject(RegistrationService);
  private dialogService = inject(DialogService);

  ticket = input.required<RegistrationRequestTicket>();
  isAuthenticated = this.auth.isAuthenticated;

  context = computed(() => getRegistrationContext(this.ticket().opportunity, this.registrationService.userEventRegistrations()));

  requestRegistration() {
    this.dialogService.open<RegistrationRequestTicket>({
      component: RegistrationRequestDialogComponent,
      data: this.ticket(),
      size: 'sm'
    }).afterClosed.subscribe(result => {
      if (result) {
        // handle success
      }
    });
  }

  viewRegistration() {
    this.dialogService.open<EventRegistration>({
      component: RegistrationManageDialogComponent,
      data: this.context()!.registration!,
      size: 'sm'
    });
  }
}
