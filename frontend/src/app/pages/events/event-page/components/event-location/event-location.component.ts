import { DatePipe } from '@angular/common';
import { Component, computed, inject, output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { EventService } from '@app/pages/events/event-page/event.service';
import { ButtonComponent } from "@app/shared/button/button.component";
import { OpportunityDateComponent } from '@app/shared/opportunity-date/opportunity-date.component';

@Component({
  selector: 'app-event-location',
  imports: [DatePipe, ButtonComponent, OpportunityDateComponent],
  templateUrl: './event-location.component.html',
  styleUrl: './event-location.component.scss'
})
export class EventLocationComponent {
  private sanitizer = inject(DomSanitizer);
  private eventService = inject(EventService);

  onGetTickets = output();

  event = computed(() => this.eventService.eventData().event);
  location = computed(() => this.eventService.eventData().location);
  nextOpportunity = computed(() => this.eventService.eventData().opportunities.length ? this.eventService.eventData().opportunities[0] : null);
  mapsUrl = computed(() => {
    const unsafeUrl = this.location()?.mapsUrl;
    return unsafeUrl ? this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl) : null;
  });

}
