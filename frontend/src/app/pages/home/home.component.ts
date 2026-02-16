import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { LayoutComponent } from "@app/core/layout/layout.component";
import { AppImageData } from '@app/core/models/app-image-data.model';
import { EventOpportunityService } from '@app/features/events/services/event-opportunity.service';
import { EventsService } from '@app/features/events/services/events.service';
import { EventCarouselComponent } from "@app/features/events/ui/event-carousel/event-carousel.component";
import { FadeInOnScrollDirective } from '@app/shared/directives/fade-in-on-scroll.directive';
import { CanonicalService } from '@core/services/canonical.service';
import { DateTimeService } from '@core/services/date-time.service';
import { ImageService } from '@core/services/image.service';
import { MetaService } from '@core/services/meta.service';
import { EventData } from '@features/events/models/event-data.model';
import { forkJoin, map } from 'rxjs';
import organization from 'src/lib/organization-data';
import { AboutSiteBannerComponent } from "./about-site-banner/about-site-banner.component";
import { AiBannerComponent } from "./ai-banner/ai-banner.component";
import { HeroComponent } from "./hero/hero.component";

@Component({
  selector: 'app-home',
  imports: [NgOptimizedImage, FadeInOnScrollDirective, HeroComponent, EventCarouselComponent, LayoutComponent, AiBannerComponent, AboutSiteBannerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  private title = inject(Title);
  private meta = inject(MetaService);
  events = signal<EventData[]>([]);
  eventsLoaded = signal(false);

  private route = inject(ActivatedRoute);
  private canonicalService = inject(CanonicalService);
  private eventsService = inject(EventsService);
  private opportunityService = inject(EventOpportunityService);
  private imageService = inject(ImageService);
  private dateTime = inject(DateTimeService);
  private destroyRef = inject(DestroyRef);

  private aiImage: AppImageData = {
    id: "ai-background.png",
    cloudflareImageId: "46a4b01c-c275-4556-aec4-ec7be2e8d500",
    width: 1792,
    height: 1024
  };

  heroImage = computed(() => {
    const resizedImage = this.imageService.resizeImage(organization.image, 384, 256);
    this.meta.updateTag({ property: 'og:image', content: resizedImage.src });
    return resizedImage.src;
  });

  aiBackgroundImage = computed(() => {
    return this.imageService.resizeImage(this.aiImage, this.aiImage.width, this.aiImage.height);
  });

  org = organization;

  ngOnInit(): void {
    this.canonicalService.setCanonicalURL(this.route.snapshot.data['canonicalPath'] || '/');
    this.title.setTitle(`${organization.title}`);

    // Set meta tags
    this.meta.updateTags(this.title.getTitle(), organization.description);
    const resizedImage = this.imageService.resizeImage(organization.image, 384, 256);
    this.meta.updateTag({ property: 'og:image', content: resizedImage.src });

    this.fetchEvents$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (events) => {
        this.events.set(events)
        this.eventsLoaded.set(true);
      },
      error: () => {
        this.eventsLoaded.set(true);
      },
    })
  }

  private fetchEvents$() {
    const observables = {
      events: this.eventsService.get$(),
      opportunities: this.opportunityService.getOpportunities$(),
    };

    return forkJoin(observables).pipe(
      map((res) => {
        const events = res.events;
        events.forEach((event) => {
          const eventOpportunities = res.opportunities
            .filter((o) => o.eventId === event.eventId)
            .sort(this.dateTime.sortCalendarDates);
          event.nextOpportunityDate = eventOpportunities.length > 0 ? eventOpportunities[0] : undefined;
        });
        return events;
      })
    );
  }

}
