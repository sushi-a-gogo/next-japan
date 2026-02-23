import { Component, computed, DestroyRef, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { DialogService } from '@app/core/services/dialog.service';
import { RegistrationService } from '@app/features/registrations/services/registration.service';
import { RegistrationCardComponent } from "@app/features/registrations/ui/registration-card/registration-card.component";
import { NotificationService } from '@app/features/user/services/notification.service';
import { ButtonComponent } from "@app/shared/ui/button/button.component";
import { EventRegistration } from '../../models/event-registration.model';

@Component({
  selector: 'app-cancel-registration-dialog',
  imports: [MatButtonModule, RegistrationCardComponent, ButtonComponent],
  templateUrl: './cancel-registration-dialog.component.html',
  styleUrl: './cancel-registration-dialog.component.scss',
})
export class CancelRegistrationDialogComponent {
  private dialogService = inject(DialogService);
  private registrationService = inject(RegistrationService);
  private notificationService = inject(NotificationService);
  private destroyRef = inject(DestroyRef);

  data = input<EventRegistration>();
  eventToCancel = computed(() => this.data());

  cancelEvent() {
    const cancelledEvent = this.eventToCancel();
    this.registrationService.cancelRegistration$(cancelledEvent!).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.notificationService.refreshUserNotifications();
      this.dialogService.closeDialog();
    });
  }

  closeDialog() {
    this.dialogService.closeDialog();
  }
}
