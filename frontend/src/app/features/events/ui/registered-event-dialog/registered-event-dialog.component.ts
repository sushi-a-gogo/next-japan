import { Component, DestroyRef, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '@app/core/auth/auth.service';
import { EventRegistration } from '@app/features/events/models/event-registration.model';
import { EventRegistrationService } from '@app/features/events/services/event-registration.service';
import { EventLocationCard } from '@app/features/events/ui/event-location-card/event-location-card.component';
import { EventOpportunityCardComponent } from '@app/features/events/ui/event-opportunity-card/event-opportunity-card.component';
import { NotificationService } from '@app/features/user/services/notification.service';
import { ButtonComponent } from '@app/shared/components/button/button.component';
import { ModalComponent } from '@app/shared/components/modal/modal.component';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-registered-event-dialog',
  imports: [MatButtonModule, ModalComponent, ButtonComponent, EventOpportunityCardComponent, EventLocationCard],
  templateUrl: './registered-event-dialog.component.html',
  styleUrl: './registered-event-dialog.component.scss'
})
export class RegisteredEventDialogComponent {
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
