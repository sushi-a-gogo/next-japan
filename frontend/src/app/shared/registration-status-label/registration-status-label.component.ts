import { TitleCasePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RegistrationStatus } from '@app/models/event/event-registration.model';

@Component({
  selector: 'app-registration-status-label',
  imports: [TitleCasePipe],
  templateUrl: './registration-status-label.component.html',
  styleUrl: './registration-status-label.component.scss'
})
export class RegistrationStatusLabelComponent {
  status = input.required<RegistrationStatus>();
}
