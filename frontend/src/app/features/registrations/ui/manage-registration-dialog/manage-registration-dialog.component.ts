import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { RegistrationSelectionService } from '@app/features/registrations/services/registration-selection.service';
import { RegistrationService } from '@app/features/registrations/services/registration.service';
import { RegistrationCardComponent } from "@app/features/registrations/ui/registration-card/registration-card.component";
import { NotificationService } from '@app/features/user/services/notification.service';
import { ButtonComponent } from '@app/shared/ui/button/button.component';
import { ModalComponent } from '@app/shared/ui/modal/modal.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-manage-registration-dialog',
  imports: [MatButtonModule, ModalComponent, ButtonComponent, RegistrationCardComponent],
  templateUrl: './manage-registration-dialog.component.html',
  styleUrl: './manage-registration-dialog.component.scss'
})
export class ManageRegistrationDialogComponent {
  private registrationService = inject(RegistrationService);
  private notificationService = inject(NotificationService);
  private destroyRef = inject(DestroyRef);
  private selectionService = inject(RegistrationSelectionService);

  eventRegistration = this.selectionService.selectedRegistration;
  confirmCancel = signal<boolean>(false);
  cancelled = signal<boolean>(false);
  busy = signal<boolean>(false);

  closeDialog() {
    this.confirmCancel.set(false);
    this.selectionService.clearSelectedRegistration();
  }

  cancelEvent() {
    this.busy.set(true);
    const cancelledEvent = this.eventRegistration()!;
    this.registrationService.cancelRegistration$(cancelledEvent!).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.notificationService.refreshUserNotifications())
    ).subscribe({
      next: () => {
        this.cancelled.set(true);
      },
      error: () => this.busy.set(false)
    });
  }

}
