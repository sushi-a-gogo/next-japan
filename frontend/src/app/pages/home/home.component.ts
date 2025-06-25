import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import { PageErrorComponent } from '@app/components/page-error/page-error.component';
import { AppImageData } from '@app/models/app-image-data.model';
import { ImageService } from '@app/services/image.service';
import { OrganizationService } from '@app/services/organization.service';
import { FooterComponent } from '@app/shared/footer/footer.component';
import { PageLoadSpinnerComponent } from "@app/shared/page-load-spinner/page-load-spinner.component";
import { of } from 'rxjs';
import { EventCarouselComponent } from "./event-carousel/event-carousel.component";
import { OrgBannerComponent } from "./org-banner/org-banner.component";

@Component({
  selector: 'app-home',
  imports: [FooterComponent, PageErrorComponent, OrgBannerComponent, EventCarouselComponent, PageLoadSpinnerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private title = inject(Title);
  private meta = inject(Meta);
  private destroyRef = inject(DestroyRef);

  private imageService = inject(ImageService);
  private organizationService = inject(OrganizationService);

  org = this.organizationService.organizationInformation;
  bannerImage?: AppImageData;
  loaded = signal<boolean>(false);
  hasError = signal<boolean>(false);

  backgroundImage = "url('/assets/images/tokyo-day.webp')";

  ngOnInit(): void {
    const org$ = this.org() ? of(this.org()!) : this.organizationService.getOrganizationInfo$();

    org$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (org) => {
        this.title.setTitle(`${org.name}`);
        // Set meta tags
        this.meta.updateTag({ name: 'description', content: org.infoDescription });

        // Open Graph meta tags
        this.meta.updateTag({ property: 'og:title', content: this.org.name });
        this.meta.updateTag({ property: 'og:description', content: org.infoDescription });
        this.meta.updateTag({ property: 'og:url', content: window.location.href });

        this.bannerImage = org.image;// res.events[index].image;
        const resizedImage = this.imageService.resizeImage(this.bannerImage, 384, 256);
        this.meta.updateTag({ property: 'og:image', content: resizedImage.src });
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
