import { Component, computed, input } from '@angular/core';
import { EventData } from '@app/event/models/event-data.model';

@Component({
  selector: 'app-dream-banner',
  imports: [],
  templateUrl: './dream-banner.component.html',
  styleUrl: './dream-banner.component.scss'
})
export class DreamBannerComponent {
  dreamEvent = input.required<EventData>()
  imageUrl = input<string | null>(null);

  backgroundImage = computed(() => this.imageUrl() ?
    `url('${this.imageUrl()}')` : `url('assets/images/orgs/tokyo.jpg')`
  );

}
