import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { EventService } from '@app/event/event.service';
import { DisplayCountPipe } from "@app/pipes/display-count.pipe";
import { environment } from '@environments/environment';

@Component({
  selector: 'app-event-banner',
  imports: [DatePipe, MatIconModule, DisplayCountPipe],
  templateUrl: './event-banner.component.html',
  styleUrl: './event-banner.component.scss'
})
export class EventBannerComponent {
  private eventService = inject(EventService);

  event = this.eventService.event;
  eventLocations = this.eventService.eventLocations;

  backgroundImage = computed(() => this.event()?.imageId ?
    `url('${environment.apiUri}/${this.event()!.imageId}')` : `url('assets/images/event-banner-default.png')`
  );

  //'event-banner-default.png';
  multiDayEvent = computed(() => {
    const minDate = this.event()?.minDate;
    const maxDate = this.event()?.maxDate;
    return minDate && maxDate ?
      new Date(minDate!).toDateString() !== new Date(maxDate!).toDateString() : false;
  });
}
