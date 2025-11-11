import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AboutComponent } from "@app/components/about/about.component";
import { LayoutComponent } from "@app/components/layout/layout.component";
import { FadeInOnScrollDirective } from '@app/directives/fade-in-on-scroll.directive';
import { AppImageData } from '@app/models/app-image-data.model';
import { EventData } from '@app/models/event/event-data.model';
import { CanonicalService } from '@app/services/canonical.service';
import { DateTimeService } from '@app/services/date-time.service';
import { EventsService } from '@app/services/events.service';
import { ImageService } from '@app/services/image.service';
import { MetaService } from '@app/services/meta.service';
import { OpportunityService } from '@app/services/opportunity.service';
import { forkJoin, map } from 'rxjs';
import organization from 'src/lib/organization-data';
import { AboutSiteBannerComponent } from "./about-site-banner/about-site-banner.component";
import { AiBannerComponent } from "./ai-banner/ai-banner.component";
import { EventCarouselComponent } from "./event-carousel/event-carousel.component";
import { HeroComponent } from "./hero/hero.component";

@Component({
  selector: 'app-home',
  imports: [NgOptimizedImage, FadeInOnScrollDirective, HeroComponent, EventCarouselComponent, LayoutComponent, AiBannerComponent, AboutComponent, AboutSiteBannerComponent],
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
  private opportunityService = inject(OpportunityService);
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
        const items = events.map((e) => ({ id: e.eventId, eventTitle: e.eventTitle, locationName: "", locationId: "" }));
        console.log(items);
        const objs = events.map((e) => ({ eventTitle: e.eventTitle, locationName: "", id: "", mapsUrl: "" }));
        console.log(objs);

        events.forEach((event) => {
          const eventOpportunities = res.opportunities
            .filter((o) => o.eventId === event.eventId)
            .sort(this.dateTime.sortCalendarDates);
          event.nextOpportunityDate = eventOpportunities.length > 0 ? this.dateTime.mapToCalendarDate(eventOpportunities[0]) : undefined;
        });
        return events;
      })
    );
  }

}
