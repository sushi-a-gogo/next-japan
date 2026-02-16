import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '@app/core/auth/auth.service';
import { EventRegistrationService } from '@app/features/events/services/event-registration.service';
import { AddressStripComponent } from "@app/features/events/ui/address-strip/address-strip.component";
import { OpportunityTimestampComponent } from '@app/features/events/ui/opportunity-timestamp/opportunity-timestamp.component';
import { NotificationService } from '@app/features/user/services/notification.service';
import { ConfirmModalComponent } from '@app/shared/components/modal/confirm-modal/confirm-modal.component';
import { EventRegistration } from '@features/events/models/event-registration.model';
import { interval, switchMap } from 'rxjs';
import { EventRegistrationCardComponent } from './event-registration-card/event-registration-card.component';

@Component({
  selector: 'app-event-registrations',
  imports: [EventRegistrationCardComponent, ConfirmModalComponent, OpportunityTimestampComponent, AddressStripComponent],
  templateUrl: './event-registrations.component.html',
  styleUrl: './event-registrations.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class EventRegistrationsComponent implements OnInit {
  private registrationService = inject(EventRegistrationService);
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);

  loaded = signal(false);
  eventToCancel = signal<EventRegistration | null>(null);

  events = computed(() => {
    const registrations = this.registrationService.userEventRegistrations();
    return [...registrations].sort(this.sortByDate);
  });

  note = computed(() => {
    const count = this.events().length;
    if (count === 0) {
      return undefined;
    }
    if (count === 1) {
      return `You have ${count} event registration.`;
    }
    return `You have ${count} event registrations.`;
  });

  private userId = this.authService.user()?.userId || '';

  ngOnInit(): void {
    // Start polling every 60 seconds
    interval(60_000)
      .pipe(
        switchMap(() => this.registrationService.getUserEventRegistrations$(this.userId!, false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  confirmCancel(event: EventRegistration) {
    this.eventToCancel.set(event);
  }

  cancelEvent(cancellationConfirmed: boolean) {
    if (cancellationConfirmed) {
      const cancelledEvent = this.eventToCancel();
      this.eventToCancel.set(null);
      this.registrationService.cancelRegistration$(cancelledEvent!).pipe(
        switchMap(() => this.notificationService.getUserNotifications$(this.userId)),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe();
    } else {
      this.eventToCancel.set(null);
    }
  }

  private sortByDate(a: EventRegistration, b: EventRegistration) {
    return new Date(a.opportunity.startDate).getTime() - new Date(b.opportunity.startDate).getTime();
  }
}
