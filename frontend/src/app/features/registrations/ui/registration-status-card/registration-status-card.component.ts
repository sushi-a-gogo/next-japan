import { DatePipe } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventRegistration } from '@app/features/registrations/models/event-registration.model';
import { RegistrationSelectionService } from '@app/features/registrations/services/registration-selection.service';
import { ButtonComponent } from '@app/shared/components/button/button.component';

@Component({
  selector: 'app-registration-status-card',
  imports: [DatePipe, RouterLink, ButtonComponent],
  templateUrl: './registration-status-card.component.html',
  styleUrl: './registration-status-card.component.scss'
})
export class RegistrationStatusCardComponent {
  private selectionService = inject(RegistrationSelectionService);

  eventRegistration = input<EventRegistration | null>(null);

  viewRegistration() {
    this.selectionService.selectRegistration(this.eventRegistration()!);
  }
  startRegistration = output();
}
