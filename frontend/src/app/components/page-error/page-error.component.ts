import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppImageData } from '@app/models/app-image-data.model';
import { ImageService } from '@app/services/image.service';

@Component({
  selector: 'app-page-error',
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './page-error.component.html',
  styleUrl: './page-error.component.scss'
})
export class PageErrorComponent {
  private imageService = inject(ImageService);
  private notFoundImage: AppImageData = {
    id: "about.png",
    cloudfareImageId: "180a8511-bc5e-46e7-8db3-7e7af379c800",
    width: 1366,
    height: 768
  };

  image = computed(() => {
    return this.imageService.resizeImage(this.notFoundImage, this.notFoundImage.width, this.notFoundImage.height);
  });

  @Input() errorTitle = 'Page not available.';
  @Input() errorMessage = `We're sorry. The requested page could not be loaded.`;
  @Input() routerLink?: string;
  @Input() routerLinkText?: string;

}
