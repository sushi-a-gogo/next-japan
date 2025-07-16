import { Component, inject } from '@angular/core';
import { EventService } from '@app/pages/event/pages/event-page/event.service';
import { LocationExpansionPanelComponent } from "./location-expansion-panel/location-expansion-panel.component";

@Component({
  selector: 'app-location-overview',
  imports: [LocationExpansionPanelComponent],
  templateUrl: './location-overview.component.html',
  styleUrl: './location-overview.component.scss'
})
export class LocationOverviewComponent {
  private eventService = inject(EventService);
  locations = this.eventService.eventLocations;
}
