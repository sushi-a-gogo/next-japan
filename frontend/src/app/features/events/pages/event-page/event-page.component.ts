import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, input, ViewChild } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ErrorService } from '@app/core/services/error.service';
import { ImageService } from '@app/core/services/image.service';
import { MetaService } from '@app/core/services/meta.service';
import { EventPageService } from '@app/features/events/pages/event-page/event-page.service';
import { PageLoadSpinnerComponent } from "@app/shared/ui/page-load-spinner/page-load-spinner.component";
import { switchMap } from 'rxjs';
import { EventCoordinatorsComponent } from './components/event-coordinators/event-coordinators.component';
import { EventHeroComponent } from "./components/event-hero/event-hero.component";
import { EventMapComponent } from "./components/event-map/event-map.component";
import { EventOpportunitiesComponent } from "./components/event-opportunities/event-opportunities.component";

@Component({
  selector: 'app-event-page',
  imports: [EventCoordinatorsComponent,
    EventOpportunitiesComponent, EventHeroComponent, PageLoadSpinnerComponent, EventMapComponent],
  templateUrl: './event-page.component.html',
  styleUrl: './event-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.fade-in-animate]': 'true' }
})
export class EventPageComponent {
  eventId = input.required<string>(); //route param input
  @ViewChild('opportunities') opportunities?: ElementRef;

  private router = inject(Router);
  private title = inject(Title);
  private meta = inject(MetaService);

  private eventPageService = inject(EventPageService);
  private errorService = inject(ErrorService);
  private imageService = inject(ImageService);

  private eventIdTrigger = computed(() => this.eventId());

  private eventData$ = toObservable(this.eventIdTrigger).pipe(
    switchMap((id) => this.eventPageService.loadEventData$(id))
  );

  private eventData = toSignal(this.eventData$, {
    initialValue: null
  });

  ogImage = computed(() => {
    const event = this.eventData()?.event;
    if (!event) return null;
    return this.imageService.resizeImage(event.image, 384, 256);
  });

  private errorEffect = effect(() => {
    if (this.eventData()?.error) {
      this.errorService.sendError(
        new Error('The requested event was not found.')
      );
      this.router.navigate(['/not-found']);
    }
  });

  private eventEffect = effect(() => {
    const data = this.eventData();
    if (!data?.event) {
      return;
    }

    const event = data.event;
    const eventTitle = event?.eventTitle || 'Event Not Found';
    const description = event?.description || 'Event Not Found';

    this.title.setTitle(eventTitle);
    this.meta.updateTags(eventTitle, description);

    const resizedImage = this.imageService.resizeImage(event.image, 384, 256);
    this.meta.updateTag({ property: 'og:image', content: resizedImage.src });
    this.meta.updateTag({ property: 'og:image:width', content: '384' });
    this.meta.updateTag({ property: 'og:image:height', content: '256' });
  });

  private metaEffect = effect(() => {
    const image = this.ogImage();
    if (image) {
      this.meta.updateTag({ property: 'og:image', content: image.src });
    }
  });

  event = computed(() => this.eventData()?.event ?? null);
  location = computed(() => this.eventData()?.location ?? null);
  eventOpportunities = computed(() => this.eventData()?.opportunities ?? []);
  tickets = computed(() => this.eventData()?.tickets || []);
  focusChild: string | null = null;
  loaded = computed(() => !!this.eventData());

  scrollToOpportunities() {
    this.opportunities?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  }
}
