import { Component, computed, input } from '@angular/core';
import { RegistrationStatus } from '@features/events/models/event-registration.model';

@Component({
  selector: 'app-event-registration-status',
  imports: [],
  templateUrl: './event-registration-status.component.html',
  styleUrl: './event-registration-status.component.scss'
})
export class EventRegistrationStatusComponent {
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
}

