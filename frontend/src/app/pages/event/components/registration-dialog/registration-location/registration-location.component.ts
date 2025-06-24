import { Component, computed, input } from '@angular/core';
import { EventLocation } from '@app/pages/event/models/event-location.model';
import { AddressStripComponent } from '@app/shared/address-strip/address-strip.component';
import { EventBreadcrumbComponent } from '@app/shared/event-breadcrumb/event-breadcrumb.component';
import { RegistrationCardComponent } from "./registration-card/registration-card.component";

@Component({
  selector: 'app-registration-location',
  imports: [EventBreadcrumbComponent, AddressStripComponent, RegistrationCardComponent],
  templateUrl: './registration-location.component.html',
  styleUrl: './registration-location.component.scss'
})
export class RegistrationLocationComponent {
  location = input.required<EventLocation>();
  locationCount = input<number>(1);

  allowRemoval = computed(() => {
    return this.locationCount() > 1 || !!this.location()?.opportunities && this.location()!.opportunities!.length > 1;
  });

  removedIds: number[] = [];

  get currentCount() {
    return this.location().opportunities!.length - this.removedIds.length;
  }

  removeSelection(id: number) {
    this.removedIds.push(id);
  }

}
