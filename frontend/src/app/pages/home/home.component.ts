import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { LayoutComponent } from "@app/core/layout/layout.component";
import { AppImageData } from '@app/core/models/app-image-data.model';
import { CanonicalService } from '@app/core/services/canonical.service';
import { ImageService } from '@app/core/services/image.service';
import { MetaService } from '@app/core/services/meta.service';
import { EventCarouselComponent } from "@app/features/events/ui/event-carousel/event-carousel.component";
import { FadeInOnScrollDirective } from '@app/shared/directives/fade-in-on-scroll.directive';
import { PageLoadSpinnerComponent } from '@app/shared/ui/page-load-spinner/page-load-spinner.component';
import organization from 'src/lib/organization-data';
import { AboutSiteBannerComponent } from "./about-site-banner/about-site-banner.component";
import { AiBannerComponent } from "./ai-banner/ai-banner.component";
import { EventHomeService } from './event-home.service';
import { HeroComponent } from "./hero/hero.component";

@Component({
  selector: 'app-home',
  imports: [NgOptimizedImage, FadeInOnScrollDirective, HeroComponent, EventCarouselComponent, LayoutComponent, AiBannerComponent, AboutSiteBannerComponent, PageLoadSpinnerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  private title = inject(Title);
  private meta = inject(MetaService);

  private route = inject(ActivatedRoute);
  private canonicalService = inject(CanonicalService);
  private eventHomeService = inject(EventHomeService);
  private imageService = inject(ImageService);

  events = this.eventHomeService.eventData;
  eventsLoaded = this.eventHomeService.eventDataLoaded;

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
  }
}
