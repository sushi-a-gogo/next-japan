import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { EventRegistration } from '@app/models/event/event-registration.model';
import { AuthMockService } from '@app/services/auth-mock.service';
import { EventRegistrationService } from '@app/services/event-registration.service';
import { MetaService } from '@app/services/meta.service';
import { AddressStripComponent } from "@app/shared/address-strip/address-strip.component";
import { ConfirmModalComponent } from '@app/shared/modal/confirm-modal/confirm-modal.component';
import { OpportunityTimestampComponent } from '@app/shared/opportunity-timestamp/opportunity-timestamp.component';
import { PageLoadSpinnerComponent } from '@app/shared/page-load-spinner/page-load-spinner.component';
import { interval, switchMap } from 'rxjs';
import { EventRegistrationCardComponent } from './event-registration-card/event-registration-card.component';

@Component({
  selector: 'app-event-registrations',
  imports: [PageLoadSpinnerComponent, EventRegistrationCardComponent, ConfirmModalComponent, OpportunityTimestampComponent, AddressStripComponent],
  templateUrl: './event-registrations.component.html',
  styleUrl: './event-registrations.component.scss'
})
export class EventRegistrationsComponent implements OnInit {
  private title = inject(Title);
  private meta = inject(MetaService);
  private registrationService = inject(EventRegistrationService);
  private authService = inject(AuthMockService);
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

  ngOnInit(): void {
    this.title.setTitle("Your Event Registrations");
    const description = "View and manage your registered events on Next Japan. See upcoming opportunities, event details, and cancel registrations if needed.";
    this.meta.updateTags(this.title.getTitle(), description);

    const userId = this.authService.user()?.userId;
    if (userId) {

      this.registrationService.getUserEventRegistrations$(userId!).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(() => {
        this.loaded.set(true);
      })

      // Start polling every 60 seconds
      interval(60_000)
        .pipe(
          switchMap(() => this.registrationService.getUserEventRegistrations$(userId!, false)),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe();
    }
  }

  confirmCancel(event: EventRegistration) {
    this.eventToCancel.set(event);
  }

  cancelEvent(cancellationConfirmed: boolean) {
    if (cancellationConfirmed) {
      const cancelledEvent = this.eventToCancel();
      this.eventToCancel.set(null);
      this.registrationService.cancelRegistration$(cancelledEvent!).pipe(
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
