import { TitleCasePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { AuthService } from '@app/core/auth/auth.service';
import { DialogService } from '@app/core/services/dialog.service';
import { EventRegistration, getRegistrationContext } from '@app/features/registrations/models/event-registration.model';
import { RegistrationRequestTicket } from '@app/features/registrations/models/registration-request-ticket.model';
import { RegistrationService } from '@app/features/registrations/services/registration.service';
import { ButtonComponent } from '@app/shared/ui/button/button.component';
import { ManageRegistrationDialogComponent } from '../manage-registration-dialog/manage-registration-dialog.component';
import { RequestRegistrationDialogComponent } from '../request-registration-dialog/request-registration-dialog.component';

@Component({
  selector: 'app-request-registration-button',
  imports: [TitleCasePipe, ButtonComponent],
  templateUrl: './request-registration-button.component.html',
  styleUrl: './request-registration-button.component.scss'
})
export class RequestRegistrationButtonComponent {
  private auth = inject(AuthService);
  private registrationService = inject(RegistrationService);
  private dialogService = inject(DialogService);

  ticket = input.required<RegistrationRequestTicket>();
  isAuthenticated = this.auth.isAuthenticated;

  context = computed(() => getRegistrationContext(this.ticket().opportunity, this.registrationService.userEventRegistrations()));

  requestRegistration() {
    this.dialogService.open<RegistrationRequestTicket>({
      component: RequestRegistrationDialogComponent,
      data: this.ticket(),
    }).afterClosed.subscribe(result => {
      if (result) {
        // handle success
      }
    });
  }

  viewRegistration() {
    this.dialogService.open<EventRegistration>({
      component: ManageRegistrationDialogComponent,
      data: this.context()!.registration!,
    }).afterClosed.subscribe(result => {
      if (result) {
        // handle success
      }
    });
  }
}
