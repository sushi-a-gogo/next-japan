import { Component, DestroyRef, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { EventRegistration } from '@app/models/event/event-registration.model';
import { AuthService } from '@app/services/auth.service';
import { EventRegistrationService } from '@app/services/event-registration.service';
import { NotificationService } from '@app/services/notification.service';
import { AddressStripComponent } from '@app/shared/address-strip/address-strip.component';
import { ButtonComponent } from '@app/shared/button/button.component';
import { ModalComponent } from '@app/shared/modal/modal.component';
import { OpportunityTimestampComponent } from '@app/shared/opportunity-timestamp/opportunity-timestamp.component';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-view-registration-dialog',
  imports: [MatButtonModule, ModalComponent, ButtonComponent, OpportunityTimestampComponent, AddressStripComponent],
  templateUrl: './view-registration-dialog.component.html',
  styleUrl: './view-registration-dialog.component.scss'
})
export class ViewRegistrationDialogComponent {
  private registrationService = inject(EventRegistrationService);
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);

  eventRegistration = input<EventRegistration | null>(null);
  close = output<boolean>();
  confirmCancel = signal<boolean>(false);
  cancelled = signal<boolean>(false);
  busy = signal<boolean>(false);

  closeDialog() {
    this.confirmCancel.set(false);
    this.close.emit(true);
  }

  cancelEvent() {
    this.busy.set(true);
    const cancelledEvent = this.eventRegistration()!;
    this.registrationService.cancelRegistration$(cancelledEvent!).pipe(
      switchMap(() => this.notificationService.getUserNotifications$(this.authService.user()!.userId)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.cancelled.set(true);
      },
      error: () => this.busy.set(false)
    });
  }

}
