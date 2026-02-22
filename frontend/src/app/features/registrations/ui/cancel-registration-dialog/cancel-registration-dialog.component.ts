import { Component, computed, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RegistrationSelectionService } from '@app/features/registrations/services/registration-selection.service';
import { RegistrationService } from '@app/features/registrations/services/registration.service';
import { RegistrationCardComponent } from "@app/features/registrations/ui/registration-card/registration-card.component";
import { NotificationService } from '@app/features/user/services/notification.service';
import { ConfirmModalComponent } from '@app/shared/ui/modal/confirm-modal/confirm-modal.component';
import { tap } from 'rxjs';

@Component({
  selector: 'app-cancel-registration-dialog',
  imports: [ConfirmModalComponent, RegistrationCardComponent],
  templateUrl: './cancel-registration-dialog.component.html',
  styleUrl: './cancel-registration-dialog.component.scss',
})
export class CancelRegistrationDialogComponent {
  private registrationService = inject(RegistrationService);
  private notificationService = inject(NotificationService);
  private destroyRef = inject(DestroyRef);
  private selectionService = inject(RegistrationSelectionService);
  eventToCancel = computed(() => this.selectionService.cancelRegistration());


  cancelEvent(cancellationConfirmed: boolean) {
    if (cancellationConfirmed) {
      const cancelledEvent = this.eventToCancel();
      this.registrationService.cancelRegistration$(cancelledEvent!).pipe(
        tap(() => this.selectionService.clearCancelRegistration()),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(() => this.notificationService.refreshUserNotifications());
    } else {
      this.selectionService.clearCancelRegistration();
    }
  }

}
