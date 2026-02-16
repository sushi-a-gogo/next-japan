import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '@app/shared/components/button/button.component';
import { EventRegistration } from '@features/events/models/event-registration.model';

@Component({
  selector: 'app-registration-alert',
  imports: [DatePipe, RouterLink, ButtonComponent],
  templateUrl: './registration-alert.component.html',
  styleUrl: './registration-alert.component.scss'
})
export class RegistrationAlertComponent {
  eventRegistration = input<EventRegistration | null>(null);
  viewRegistration = output();
  startRegistration = output();
}
