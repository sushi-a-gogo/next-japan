import { Component, computed, DestroyRef, inject, input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import { PageErrorComponent } from '@app/components/page-error/page-error.component';
import { EventService } from '@app/event/event.service';
import { FooterComponent } from '@app/footer/footer.component';
import { AuthMockService } from '@app/services/auth-mock.service';
import { ImageService } from '@app/services/image.service';
import { catchError, forkJoin, of } from 'rxjs';
import { LoadingSpinnerComponent } from "../shared/loading-spinner/loading-spinner.component";
import { EventHeaderComponent } from "./components/event-header/event-header.component";
import { EventNavbarComponent } from "./components/event-navbar/event-navbar.component";
import { EventOpportunitiesComponent } from "./components/event-opportunities/event-opportunities.component";
import { EventOverviewComponent } from "./components/event-overview/event-overview.component";

@Component({
  selector: 'app-event-page',
  imports: [EventHeaderComponent, EventNavbarComponent, PageErrorComponent, EventOverviewComponent, EventOpportunitiesComponent, LoadingSpinnerComponent, FooterComponent],
  templateUrl: './event-page.component.html',
  styleUrl: './event-page.component.scss'
})
export class EventPageComponent implements OnChanges {
  private title = inject(Title);
  private meta = inject(Meta);

  private auth = inject(AuthMockService);
  private eventService = inject(EventService);
  private imageService = inject(ImageService);

  private destroyRef = inject(DestroyRef);
  private event = this.eventService.event;

  eventId = input.required<string>();

  isAuthenticated = this.auth.isAuthenticated;

  focusChild: string | null = null;
  loaded = signal<boolean>(false);
  hasError = signal<boolean>(false);

  backgroundImage = computed(() => {
    if (this.event()) {
      const resizedImage = this.imageService.resizeImage(this.event()!.image, 384, 256);
      return `url('${resizedImage.src}')`;
    }
    return undefined;
  });

  ngOnChanges(changes: SimpleChanges): void {
    const id = Number(this.eventId());
    this.loaded.set(false);
    forkJoin([this.eventService.getEvent$(id), this.eventService.getEventOpportunities$(id)])
      .pipe(catchError((e) => {
        this.hasError.set(true)
        return of([null]);
      }), takeUntilDestroyed(this.destroyRef)).subscribe(([event]) => {
        const eventTitle = event?.eventTitle || 'Event Not Found';
        const description = event?.description || 'Event Not Found';
        const image = event ? this.imageService.resizeImage(event?.image, 384, 256) : null;

        this.title.setTitle(eventTitle);

        // Set meta tags
        this.meta.updateTag({ name: 'description', content: description });

        // Open Graph meta tags
        this.meta.updateTag({ property: 'og:title', content: eventTitle });
        this.meta.updateTag({ property: 'og:description', content: description });
        if (image) {
          this.meta.updateTag({ property: 'og:image', content: image.src });
        }
        this.meta.updateTag({ property: 'og:url', content: window.location.href });

        this.hasError.set(!event);
        this.loaded.set(true);
      })
  }

  setFocusChild(child: string) {
    this.focusChild = child;
    setTimeout(() => {
      this.focusChild = null;
    }, 250);
  }

}
