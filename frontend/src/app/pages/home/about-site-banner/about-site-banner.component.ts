import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ImageService } from '@core/services/image.service';

@Component({
  selector: 'app-about-site-banner',
  imports: [NgOptimizedImage],
  templateUrl: './about-site-banner.component.html',
  styleUrl: './about-site-banner.component.scss'
})
export class AboutSiteBannerComponent {
  private imageService = inject(ImageService);

  siteLogo = computed(() => {
    const image = {
      id: "logo",
      cloudflareImageId: '9da4dc71-f165-4462-0ca9-46122546db00',
      width: 1024,
      height: 1024,
    };
    return this.imageService.resizeImage(image, image.width, image.height);
  });

}
