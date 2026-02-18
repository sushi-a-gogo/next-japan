import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '@app/core/auth/auth.service';
import { EventLocationCard } from '@app/features/events/ui/event-location-card/event-location-card.component';
import { EventOpportunityCardComponent } from '@app/features/events/ui/event-opportunity-card/event-opportunity-card.component';
import { RegistrationService } from '@app/features/registrations/services/registration.service';
import { NotificationService } from '@app/features/user/services/notification.service';
import { ButtonComponent } from '@app/shared/components/button/button.component';
import { ModalComponent } from '@app/shared/components/modal/modal.component';
import { switchMap } from 'rxjs';
import { RegistrationSelectionService } from '../../services/registration-selection.service';

@Component({
  selector: 'app-manage-registration-dialog',
  imports: [MatButtonModule, ModalComponent, ButtonComponent, EventOpportunityCardComponent, EventLocationCard],
  templateUrl: './manage-registration-dialog.component.html',
  styleUrl: './manage-registration-dialog.component.scss'
})
export class ManageRegistrationDialogComponent {
  private registrationService = inject(RegistrationService);
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);
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
