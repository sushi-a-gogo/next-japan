import { Component, computed, inject } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { EventService } from '@app/pages/events/event-page/event.service';
import { LocationExpansionPanelComponent } from "./location-expansion-panel/location-expansion-panel.component";

@Component({
  selector: 'app-location-overview',
  imports: [MatExpansionModule, LocationExpansionPanelComponent],
  templateUrl: './location-overview.component.html',
  styleUrl: './location-overview.component.scss'
})
export class LocationOverviewComponent {
  private eventService = inject(EventService);
  locations = computed(() => this.eventService.eventData().locations.sort((a, b) => a.locationName.localeCompare(b.locationName)));
}
