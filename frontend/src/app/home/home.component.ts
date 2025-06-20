import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import { PageErrorComponent } from '@app/components/page-error/page-error.component';
import { EventData } from '@app/event/models/event-data.model';
import { EventOpportunity } from '@app/event/models/event-opportunity.model';
import { FooterComponent } from '@app/footer/footer.component';
import { EventCarouselComponent } from "@app/home/event-carousel/event-carousel.component";
import { AppImageData } from '@app/models/app-image-data.model';
import { OrganizationInformation } from '@app/models/organization-information.model';
import { ImageService } from '@app/services/image.service';
import { OrganizationService } from '@app/services/organization.service';
import { environment } from '@environments/environment';
import { forkJoin } from 'rxjs';
import { OrgBannerComponent } from "./org-banner/org-banner.component";

@Component({
  selector: 'app-home',
  imports: [FooterComponent, PageErrorComponent, OrgBannerComponent, EventCarouselComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private title = inject(Title);
  private meta = inject(Meta);
  private destroyRef = inject(DestroyRef);

  private imageService = inject(ImageService);
  private organizationService = inject(OrganizationService);

  org?: OrganizationInformation;
  events = signal<EventData[]>([]);
  opportunities = signal<EventOpportunity[]>([]);
  bannerImage?: AppImageData;
  loaded = signal<boolean>(false);
  hasError = signal<boolean>(false);

  backgroundImage = "";// `url('/assets/images/orgs/tokyo.png')`;

  ngOnInit(): void {
    console.log('PROD API URL:', environment.apiUrl);
    const observables = {
      org: this.organizationService.getOrganizationInfo$(),
      events: this.organizationService.getEvents$(),
      opportunities: this.organizationService.getNextOpportunities$(),
    };
    forkJoin(observables).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (res) => {
        this.org = res.org;

        const index = res.events.length > 0 ? Math.floor(Math.random() * res.events.length) : 0;
        this.bannerImage = this.org.image;// res.events[index].image;
        const resizedImage = this.imageService.resizeImage(this.bannerImage, 384, 256);
        this.backgroundImage = `url('${resizedImage.src}')`;

        this.events.set(res.events);
        this.opportunities.set(res.opportunities);

        this.title.setTitle(`${this.org.name}`);
        // Set meta tags
        this.meta.updateTag({ name: 'description', content: this.org.infoDescription });

        // Open Graph meta tags
        this.meta.updateTag({ property: 'og:title', content: this.org.name });
        this.meta.updateTag({ property: 'og:description', content: this.org.infoDescription });
        this.meta.updateTag({ property: 'og:image', content: resizedImage.src });
        this.meta.updateTag({ property: 'og:url', content: window.location.href });
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


}
