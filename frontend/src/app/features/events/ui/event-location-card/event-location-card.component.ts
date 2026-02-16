import { Component, HostBinding, input } from '@angular/core';
import { EventLocation } from '@app/features/events/models/event-location.model';

@Component({
  selector: 'app-event-location-card',
  imports: [],
  templateUrl: './event-location-card.component.html',
  styleUrl: './event-location-card.component.scss',
  styles: [`
  .centered {
    align-items: center;
  }
  `]
})
export class EventLocationCard {
  location = input.required<EventLocation>()
  showDirections = input<boolean>(false);
  showIcon = input<boolean>(true);
  notes = input<string | undefined>();
  place?: string;

  @HostBinding('class.centered') alignCenter = false; // Class 'is-active' added when isActive is true


  ngOnInit(): void {
    this.alignCenter = !this.notes();
    this.setPlace();
  }

  private setPlace() {
    const items = [
      ...(this.location().addressLine1 || '').split(' '),
      ...(this.location().city || '').split(' '),
      ...(this.location().state || '').split(' '),
      `${this.location().zip}`,
    ];

    const path = items
      .map((item) => item?.trim())
      .filter((item) => item?.length)
      .join('+');

    this.place = `https://www.google.com/maps/place/${path}`;
  }

}
