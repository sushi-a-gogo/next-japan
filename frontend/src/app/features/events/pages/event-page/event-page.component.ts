import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, ElementRef, inject, input, OnChanges, OnInit, signal, SimpleChanges, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { NavigationStart, Router } from '@angular/router';
import { ErrorService } from '@app/core/services/error.service';
import { ImageService } from '@app/core/services/image.service';
import { MetaService } from '@app/core/services/meta.service';
import { EventPageService } from '@app/features/events/pages/event-page/event-page.service';
import { PageLoadSpinnerComponent } from "@app/shared/ui/page-load-spinner/page-load-spinner.component";
import { filter } from 'rxjs';
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
export class EventPageComponent implements OnInit, OnChanges {
  private router = inject(Router);
  private title = inject(Title);
  private meta = inject(MetaService);
  private destroyRef = inject(DestroyRef);

  private eventPageService = inject(EventPageService);
  private errorService = inject(ErrorService);
  private imageService = inject(ImageService);

  eventId = input.required<string>();
  event = computed(() => this.eventPageService.eventData().event);
  location = computed(() => this.eventPageService.eventData().location);
  eventOpportunities = computed(() => this.eventPageService.eventData().opportunities);
  tickets = computed(() => this.eventPageService.eventData().tickets || []);
  focusChild: string | null = null;
  loaded = signal<boolean>(false);

  @ViewChild('opportunities') opportunities?: ElementRef;

  private errorEffect = effect(() => {
    const data = this.eventPageService.eventData();
    if (data?.error) {
      this.errorService.sendError(
        new Error('The requested event was not found.')
      );
      this.router.navigate(['/not-found']);
    }
  });

  private eventEffect = effect(() => {
    const data = this.eventPageService.eventData();
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
    this.loaded.set(true);
  });

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.eventPageService.setEventId(null);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const changed = changes['eventId'];
    if (!changed) return;

    const id = this.eventId();
    this.eventPageService.setEventId(id);
  }

  scrollToOpportunities() {
    this.opportunities?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  }
}
