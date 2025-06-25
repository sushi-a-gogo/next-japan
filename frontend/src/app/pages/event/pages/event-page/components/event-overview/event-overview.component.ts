import { Component, ElementRef, inject, input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { EventService } from '@app/pages/event/event.service';
import { CoordinatorOverviewComponent } from "./coordinator-overview/coordinator-overview.component";
import { LocationOverviewComponent } from "./location-overview/location-overview.component";

@Component({
  selector: 'app-event-overview',
  imports: [LocationOverviewComponent, CoordinatorOverviewComponent],
  templateUrl: './event-overview.component.html',
  styleUrl: './event-overview.component.scss'
})
export class EventOverviewComponent implements OnChanges {
  private eventService = inject(EventService);
  event = this.eventService.event;
  focusChild = input<string | null>(null);

  @ViewChild('description') description?: ElementRef;
  @ViewChild('locations') locations?: ElementRef;
  @ViewChild('coordinators') coordinators?: ElementRef;
  @ViewChild('calendar') calendar?: ElementRef;


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['focusChild']) {
      switch (changes['focusChild'].currentValue) {
        case 'description':
          this.setFocus(this.description!);
          break;
        case 'locations':
          this.setFocus(this.locations!);
          break;
        case 'coordinators':
          this.setFocus(this.coordinators!);
          break;
        case 'calendar':
          this.setFocus(this.calendar!);
          break;
        default:
          break;
      }
    }
  }

  setFocus(elm: ElementRef) {
    setTimeout(() => {
      elm.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    });
  }

}
