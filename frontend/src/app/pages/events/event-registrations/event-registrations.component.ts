import { Component, computed, inject, signal } from '@angular/core';
import { EventRegistration } from '@app/models/event/event-registration.model';
import { EventRegistrationService } from '@app/services/event-registration.service';
import { UserProfileService } from '@app/services/user-profile.service';
import { ConfirmModalComponent } from '@app/shared/modal/confirm-modal/confirm-modal.component';
import { OpportunityTimestampComponent } from '@app/shared/opportunity-timestamp/opportunity-timestamp.component';
import { PageLoadSpinnerComponent } from '@app/shared/page-load-spinner/page-load-spinner.component';
import { EventRegistrationCardComponent } from './event-registration-card/event-registration-card.component';

@Component({
  selector: 'app-event-registrations',
  imports: [PageLoadSpinnerComponent, EventRegistrationCardComponent, ConfirmModalComponent, OpportunityTimestampComponent],
  templateUrl: './event-registrations.component.html',
  styleUrl: './event-registrations.component.scss'
})
export class EventRegistrationsComponent {
  private registrationService = inject(EventRegistrationService);
  private userService = inject(UserProfileService);
  private user = this.userService.userProfile;
  loaded = signal(true);
  eventToCancel = signal<EventRegistration | null>(null);

  events = computed(() =>
    this.registrationService.registrations().filter((r) => r.userId === this.user()?.userId).sort(this.sortByDate));

  confirmCancel(event: EventRegistration) {
    this.eventToCancel.set(event);
  }

  cancelEvent(cancellationConfirmed: boolean) {
    if (cancellationConfirmed) {
      const cancelledEvent = this.eventToCancel();
      this.eventToCancel.set(null);
      this.registrationService.cancelRegistration(cancelledEvent!.registrationId!);
    } else {
      this.eventToCancel.set(null);
    }
  }

  private sortByDate(a: EventRegistration, b: EventRegistration) {
    return new Date(a.opportunity.startDate).getTime() - new Date(b.opportunity.startDate).getTime();
  }
}
