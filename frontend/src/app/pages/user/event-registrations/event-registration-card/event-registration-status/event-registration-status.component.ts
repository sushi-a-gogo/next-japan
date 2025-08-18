import { Component, computed, HostBinding, input, OnChanges, SimpleChanges } from '@angular/core';
import { RegistrationStatus } from '@app/models/event/event-registration.model';

@Component({
  selector: 'app-event-registration-status',
  imports: [],
  templateUrl: './event-registration-status.component.html',
  styleUrl: './event-registration-status.component.scss'
})
export class EventRegistrationStatusComponent implements OnChanges {
  status = input<RegistrationStatus>();

  label = computed(() => {
    switch (this.status()) {
      case RegistrationStatus.Registered:
        return "You're registered!";
      case RegistrationStatus.Requested:
        return "We've received your registration request! We'll notify you once your spot is confirmed.";
      default:
        return undefined;
    }
  })
  @HostBinding('class.requested') isRequested = false;
  @HostBinding('class.registered') isRegistered = false;
  @HostBinding('class.busy') isBusy = false;

  ngOnChanges(changes: SimpleChanges): void {
    const changed = changes['status'];
    if (changed) {
      this.isBusy = !changed.firstChange;
      setTimeout(() => {
        this.isRequested = RegistrationStatus.Requested === this.status();
        this.isRegistered = RegistrationStatus.Registered === this.status();
        this.isBusy = false;
      }, 25)
    }
  }
}

