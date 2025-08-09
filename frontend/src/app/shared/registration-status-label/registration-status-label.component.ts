import { TitleCasePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RegistrationStatus } from '@app/models/event/event-registration.model';

@Component({
  selector: 'app-registration-status-label',
  imports: [TitleCasePipe],
  templateUrl: './registration-status-label.component.html',
  styleUrl: './registration-status-label.component.scss'
})
export class RegistrationStatusLabelComponent {
  status = input.required<RegistrationStatus>();
  label = computed(() => {
    switch (this.status()) {
      case RegistrationStatus.Cancelled:
        return "Your registration has been cancelled.";
      case RegistrationStatus.Registered:
        return "You're registered!";
      case RegistrationStatus.Requested:
        return "Registration Pending";
      default:
        return undefined;
    }
  });
}
