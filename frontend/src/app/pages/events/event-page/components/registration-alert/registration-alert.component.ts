import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventRegistration } from '@app/models/event/event-registration.model';
import { ButtonComponent } from '@app/shared/button/button.component';

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
