import { NgOptimizedImage } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { PageErrorComponent } from '@app/components/page-error/page-error.component';
import { AppImageData } from '@app/models/app-image-data.model';
import { EventsService } from '@app/services/events.service';
import { ImageService } from '@app/services/image.service';
import { MetaService } from '@app/services/meta.service';
import { OrganizationService } from '@app/services/organization.service';
import { PageLoadSpinnerComponent } from "@app/shared/page-load-spinner/page-load-spinner.component";
import { forkJoin, of } from 'rxjs';
import { EventData } from '../event/models/event-data.model';
import { EventOpportunity } from '../event/models/event-opportunity.model';
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
    cloudflareImageId: "a93ea8ab-b8cd-4d31-6832-163c8d097200",
    width: 1792,
    height: 1024
  };

  aiBackgroundImage = computed(() => {
    return this.imageService.resizeImage(this.aiImage, this.aiImage.width, this.aiImage.height);
  });


  org = this.organizationService.organizationInformation;
  events = signal<EventData[]>([]);

  loaded = signal<boolean>(false);
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
    const observables = this.getObservables();
    forkJoin(observables).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (res) => {
        this.title.setTitle(`${res.org.name}`);
        // Set meta tags
        this.meta.updateTags(this.title.getTitle(), res.org.infoDescription);

        this.events.set([...res.events, ...res.savedEvents.data]);
        this.configureEvents(res.opportunities);
      },
      error: () => {
        this.loaded.set(true);
        this.hasError.set(true);
      },
      complete: () => {
        this.loaded.set(true);
      }
    });
  }

  private getObservables() {
    const org$ = this.org() ? of(this.org()!) : this.organizationService.getOrganizationInfo$();

    return {
      org: org$,
      events: this.organizationService.getEvents$(),
      savedEvents: this.eventsService.get$(),
      opportunities: this.organizationService.getNextOpportunities$(),
    };
  }


  private configureEvents(opportunities: EventOpportunity[]) {
    this.events().forEach((event) => {
      const eventOpportunities = opportunities
        .filter((o) => o.eventId === event.eventId)
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

      event.nextOpportunityDate = eventOpportunities.length > 0 ? eventOpportunities[0] : undefined;
    });
  }


}
