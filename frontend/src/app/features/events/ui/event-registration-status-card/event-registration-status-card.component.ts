import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventRegistration } from '@app/features/events/models/event-registration.model';
import { ButtonComponent } from '@app/shared/components/button/button.component';

@Component({
  selector: 'app-event-registration-status-card',
  imports: [DatePipe, RouterLink, ButtonComponent],
  templateUrl: './event-registration-status-card.component.html',
  styleUrl: './event-registration-status-card.component.scss'
})
export class EventRegistrationStatusCardComponent {
  eventRegistration = input<EventRegistration | null>(null);
  viewRegistration = output();
  startRegistration = output();
}
