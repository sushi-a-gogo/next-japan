import { Component, computed, DestroyRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { DialogService } from '@app/core/services/dialog.service';
import { RegistrationService } from '@app/features/registrations/services/registration.service';
import { RegistrationCardComponent } from "@app/features/registrations/ui/registration-card/registration-card.component";
import { NotificationService } from '@app/features/user/services/notification.service';
import { ButtonComponent } from "@app/shared/ui/button/button.component";
import { EventRegistration } from '../../models/event-registration.model';

@Component({
  selector: 'app-registration-cancel-dialog',
  imports: [MatButtonModule, RegistrationCardComponent, ButtonComponent],
  templateUrl: './registration-cancel-dialog.component.html',
  styleUrl: './registration-cancel-dialog.component.scss',
})
export class RegistrationCancelDialogComponent {
  private dialogService = inject(DialogService);
  private registrationService = inject(RegistrationService);
  private notificationService = inject(NotificationService);
  private destroyRef = inject(DestroyRef);

  data = input<EventRegistration>();
  eventToCancel = computed(() => this.data());
  eventCanceled = signal(false);

  cancelEvent() {
    const cancelledEvent = this.eventToCancel();
    this.registrationService.cancelRegistration$(cancelledEvent!).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.notificationService.refreshUserNotifications();
      this.eventCanceled.set(true);
    });
  }

  closeDialog() {
    this.dialogService.closeDialog();
  }
}
