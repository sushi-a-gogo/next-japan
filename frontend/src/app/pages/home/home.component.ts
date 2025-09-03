import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { AboutComponent } from "@app/components/about/about.component";
import { LayoutComponent } from "@app/components/layout/layout.component";
import { AppImageData } from '@app/models/app-image-data.model';
import { EventData } from '@app/models/event/event-data.model';
import { EventsService } from '@app/services/events.service';
import { ImageService } from '@app/services/image.service';
import { MetaService } from '@app/services/meta.service';
import { OpportunityService } from '@app/services/opportunity.service';
import { forkJoin, map } from 'rxjs';
import organization from 'src/lib/organization-data';
import { AiBannerComponent } from "./ai-banner/ai-banner.component";
import { EventCarouselComponent } from "./event-carousel/event-carousel.component";
import { HeroComponent } from "./hero/hero.component";

@Component({
  selector: 'app-home',
  imports: [NgOptimizedImage, HeroComponent, EventCarouselComponent, LayoutComponent, AiBannerComponent, AboutComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  private title = inject(Title);
  private meta = inject(MetaService);
  events = signal<EventData[]>([]);
  eventsLoaded = signal(false);

  private eventsService = inject(EventsService);
  private opportunityService = inject(OpportunityService);
  private imageService = inject(ImageService);
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
    this.title.setTitle(`${organization.name}`);
    // Set meta tags
    this.meta.updateTags(this.title.getTitle(), organization.infoDescription);
    const resizedImage = this.imageService.resizeImage(organization.image, 384, 256);
    this.meta.updateTag({ property: 'og:image', content: resizedImage.src });

    this.fetchEvents$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((events) => {
      this.events.set(events)
      this.eventsLoaded.set(true);
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
            .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
          event.nextOpportunityDate = eventOpportunities.length > 0 ? eventOpportunities[0] : undefined;
        });
        return events;
      })
    );
  }

}
