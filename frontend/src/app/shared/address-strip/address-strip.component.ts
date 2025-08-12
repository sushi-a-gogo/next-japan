import { Component, HostBinding, input } from '@angular/core';
import { MapLocation } from '@app/models/map-location.model';

@Component({
  selector: 'app-address-strip',
  imports: [],
  templateUrl: './address-strip.component.html',
  styleUrl: './address-strip.component.scss',
  styles: [`
  .centered {
    align-items: center;
  }
  `]
})
export class AddressStripComponent {
  location = input.required<MapLocation>()
  showAddress = input<boolean>(true);
  showDirections = input<boolean>(false);
  showIcon = input<boolean>(true);
  notes = input<string | undefined>();
  address!: string;
  city!: string;
  place?: string;

  @HostBinding('class.centered') alignCenter = false; // Class 'is-active' added when isActive is true


  ngOnInit(): void {
    this.alignCenter = !this.notes();
    this.address = `${this.location().addressLine1}, ${this.location().city}`;
    this.city = `${this.location().state} ${this.location().zip}`;
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
