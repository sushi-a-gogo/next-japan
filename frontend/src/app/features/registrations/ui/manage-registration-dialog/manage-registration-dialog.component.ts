import { Component, computed, DestroyRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { DialogService } from '@app/core/services/dialog.service';
import { RegistrationService } from '@app/features/registrations/services/registration.service';
import { RegistrationCardComponent } from "@app/features/registrations/ui/registration-card/registration-card.component";
import { NotificationService } from '@app/features/user/services/notification.service';
import { ButtonComponent } from '@app/shared/ui/button/button.component';
import { finalize } from 'rxjs';
import { EventRegistration } from '../../models/event-registration.model';

@Component({
  selector: 'app-manage-registration-dialog',
  imports: [MatButtonModule, ButtonComponent, RegistrationCardComponent],
  templateUrl: './manage-registration-dialog.component.html',
  styleUrl: './manage-registration-dialog.component.scss'
})
export class ManageRegistrationDialogComponent {
  private dialogService = inject(DialogService);
  private registrationService = inject(RegistrationService);
  private notificationService = inject(NotificationService);
  private destroyRef = inject(DestroyRef);

  data = input<EventRegistration>();
  eventRegistration = computed(() => this.data());
  confirmCancel = signal<boolean>(false);
  cancelled = signal<boolean>(false);
  busy = signal<boolean>(false);

  closeDialog() {
    this.dialogService.closeDialog();
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
