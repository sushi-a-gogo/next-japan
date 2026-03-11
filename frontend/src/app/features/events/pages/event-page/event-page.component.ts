import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, input, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ImageService } from '@app/core/services/image.service';
import { MetaService } from '@app/core/services/meta.service';
import { PageLoadSpinnerComponent } from "@app/shared/ui/page-load-spinner/page-load-spinner.component";
import { EventCoordinatorsComponent } from './components/event-coordinators/event-coordinators.component';
import { EventHeroComponent } from "./components/event-hero/event-hero.component";
import { EventMapComponent } from "./components/event-map/event-map.component";
import { EventOpportunitiesComponent } from "./components/event-opportunities/event-opportunities.component";
import { EventPageState } from './event-page-state.service';

@Component({
  selector: 'app-event-page',
  imports: [
    EventCoordinatorsComponent,
    EventOpportunitiesComponent,
    EventHeroComponent,
    PageLoadSpinnerComponent,
    EventMapComponent
  ],
  templateUrl: './event-page.component.html',
  styleUrl: './event-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.fade-in-animate]': 'true' },
  providers: [EventPageState],
})
export class EventPageComponent {
  eventId = input.required<string>(); //route param input
  @ViewChild('opportunities') opportunities?: ElementRef;

  private title = inject(Title);
  private meta = inject(MetaService);

  private eventPageState = inject(EventPageState);
  private imageService = inject(ImageService);

  constructor() {
    effect(() => {
      this.eventPageState.eventId.set(this.eventId());
    });
  }

  private eventEffect = effect(() => {
    const event = this.eventPageState.event();
    if (!event) {
      return;
    }

    const eventTitle = event?.eventTitle || 'Event Not Found';
    const description = event?.description || 'Event Not Found';

    this.title.setTitle(eventTitle);
    this.meta.updateTags(eventTitle, description);

    this.meta.updateTag({ property: 'og:image', content: this.imageService.cloudflareImageUrl(event.image, 384, 256) });
    this.meta.updateTag({ property: 'og:image:width', content: '384' });
    this.meta.updateTag({ property: 'og:image:height', content: '256' });
  });

  event = computed(() => this.eventPageState.event() ?? null);
  location = computed(() => this.eventPageState.location() ?? null);
  eventOpportunities = computed(() => this.eventPageState.opportunities() ?? []);
  tickets = computed(() => this.eventPageState.tickets() || []);
  focusChild: string | null = null;
  loaded = this.eventPageState.loaded;

  scrollToOpportunities() {
    this.opportunities?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  }
}
