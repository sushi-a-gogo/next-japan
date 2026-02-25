import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DialogService } from '@app/core/services/dialog.service';
import { EventRegistration } from '@app/features/registrations/models/event-registration.model';
import { RegistrationService } from '@app/features/registrations/services/registration.service';
import { RegistrationCancelDialogComponent } from '@app/features/registrations/ui/registration-cancel-dialog/registration-cancel-dialog.component';
import { interval } from 'rxjs';
import { EventRegistrationCardComponent } from './event-registration-card/event-registration-card.component';

@Component({
  selector: 'app-event-registrations',
  imports: [EventRegistrationCardComponent],
  templateUrl: './event-registrations.component.html',
  styleUrl: './event-registrations.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class EventRegistrationsComponent implements OnInit {
  private dialogService = inject(DialogService);
  private registrationService = inject(RegistrationService);
  private destroyRef = inject(DestroyRef);

  loaded = signal(false);

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
    // Poll every 60 seconds
    interval(60_000)
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.registrationService.refreshUserRegistrations());
  }

  confirmCancel(event: EventRegistration) {
    this.dialogService.open<EventRegistration>({
      component: RegistrationCancelDialogComponent,
      data: event,
      size: 'sm'
    }).afterClosed.subscribe(result => {
      if (result) {
        // handle success
      }
    });
  }

  private sortByDate(a: EventRegistration, b: EventRegistration) {
    return new Date(a.opportunity.startDate).getTime() - new Date(b.opportunity.startDate).getTime();
  }
}
