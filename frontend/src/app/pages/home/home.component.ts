import { NgOptimizedImage } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { PageErrorComponent } from '@app/components/page-error/page-error.component';
import { AppImageData } from '@app/models/app-image-data.model';
import { OrganizationInformation } from '@app/models/organization-information.model';
import { EventsService } from '@app/services/events.service';
import { ImageService } from '@app/services/image.service';
import { MetaService } from '@app/services/meta.service';
import { OrganizationService } from '@app/services/organization.service';
import { PageLoadSpinnerComponent } from "@app/shared/page-load-spinner/page-load-spinner.component";
import { forkJoin, map, of, switchMap } from 'rxjs';
import { EventData } from '../event/models/event-data.model';
import { EventCarouselComponent } from "./event-carousel/event-carousel.component";
import { OrgBannerComponent } from "./org-banner/org-banner.component";

@Component({
  selector: 'app-home',
  imports: [RouterLink, NgOptimizedImage, PageErrorComponent, OrgBannerComponent, EventCarouselComponent, PageLoadSpinnerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private title = inject(Title);
  private meta = inject(MetaService);
  private destroyRef = inject(DestroyRef);

  private eventsService = inject(EventsService);
  private imageService = inject(ImageService);
  private organizationService = inject(OrganizationService);

  private aiImage: AppImageData = {
    id: "ai-banner.png",
    cloudflareImageId: "ea6cbb50-de47-4dff-3cce-cb05a41c1800",
    width: 1792,
    height: 1024
  };

  aiBackgroundImage = computed(() => {
    return this.imageService.resizeImage(this.aiImage, this.aiImage.width, this.aiImage.height);
  });


  org = signal<OrganizationInformation | null>(null);
  events = signal<EventData[]>([]);

  loaded = signal<boolean>(false);
  completed = signal<boolean>(false);
  hasError = signal<boolean>(false);

  backgroundImage = computed(() => {
    if (this.org()) {
      const resizedImage = this.imageService.resizeImage(this.org()!.image, 384, 256);
      this.meta.updateTag({ property: 'og:image', content: resizedImage.src });
      return `url('${resizedImage.src}')`;
    }

    return undefined;
  });

  ngOnInit(): void {
    this.fetchOrganizationData$().pipe(
      switchMap((org) => {
        this.title.setTitle(`${org.name}`);
        // Set meta tags
        this.meta.updateTags(this.title.getTitle(), org.infoDescription);
        this.org.set(org);
        this.loaded.set(true);
        return this.fetchEvents$();
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (events) => {
        this.events.set(events);
      },
      error: () => {
        this.loaded.set(true);
        this.hasError.set(true);
      },
      complete: () => {
        this.completed.set(true);
      }
    });
  }

  private fetchOrganizationData$() {
    const orgData = this.organizationService.organizationInformation();
    return orgData ? of(orgData) : this.organizationService.getOrganizationInfo$();
  }

  private fetchEvents$() {
    const observables = {
      events: this.organizationService.getEvents$(),
      savedEvents: this.eventsService.get$(),
      opportunities: this.organizationService.getNextOpportunities$(),
    };

    return forkJoin(observables).pipe(
      map((res) => {
        const events = [...res.events, ...res.savedEvents];
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
