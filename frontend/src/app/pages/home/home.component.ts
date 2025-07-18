import { NgOptimizedImage } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { PageErrorComponent } from '@app/components/page-error/page-error.component';
import { AppImageData } from '@app/models/app-image-data.model';
import { OrganizationInformation } from '@app/models/organization-information.model';
import { ErrorService } from '@app/services/error.service';
import { EventsService } from '@app/services/events.service';
import { ImageService } from '@app/services/image.service';
import { MetaService } from '@app/services/meta.service';
import { OpportunityService } from '@app/services/opportunity.service';
import { OrganizationService } from '@app/services/organization.service';
import { PageLoadSpinnerComponent } from "@app/shared/page-load-spinner/page-load-spinner.component";
import { EventData } from '@models/event/event-data.model';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { EventCarouselComponent } from "./event-carousel/event-carousel.component";
import { OrgBannerComponent } from "./org-banner/org-banner.component";

@Component({
  selector: 'app-home',
  imports: [RouterLink, NgOptimizedImage, PageErrorComponent, OrgBannerComponent, EventCarouselComponent, PageLoadSpinnerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private router = inject(Router);
  private title = inject(Title);
  private meta = inject(MetaService);
  private destroyRef = inject(DestroyRef);

  private imageService = inject(ImageService);
  private eventsService = inject(EventsService);
  private errorService = inject(ErrorService);
  private opportunityService = inject(OpportunityService);
  private organizationService = inject(OrganizationService);

  private aiImage: AppImageData = {
    id: "ai-background.png",
    cloudflareImageId: "46a4b01c-c275-4556-aec4-ec7be2e8d500",
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

  backgroundImage = computed(() => {
    if (this.org()) {
      const resizedImage = this.imageService.resizeImage(this.org()!.image, 384, 256);
      this.meta.updateTag({ property: 'og:image', content: resizedImage.src });
      return `url('${resizedImage.src}')`;
    }

    return undefined;
  });

  ngOnInit(): void {
    this.organizationService.getOrganizationInfo$().pipe(
      switchMap((org) => {
        if (!org) {
          return of([]);
        }

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
        if (!this.org()) {
          this.errorService.sendError(new Error("The requested data was not found."));
          this.router.navigate(['./not-found']);
        } else {
          this.events.set(events);
          this.loaded.set(true);
        }
      },
      error: (e) => {
        this.errorService.sendError(new Error('Error fetching requested data.'));
        this.router.navigate(['./not-found']);
      },
      complete: () => {
        this.completed.set(true);
      }
    });
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
