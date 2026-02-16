import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppImageData } from '@app/core/models/app-image-data.model';
import { ImageService } from '@core/services/image.service';

@Component({
  selector: 'app-page-error',
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './page-error.component.html',
  styleUrl: './page-error.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class PageErrorComponent {
  private imageService = inject(ImageService);
  private notFoundImage: AppImageData = {
    id: "about.png",
    cloudflareImageId: "180a8511-bc5e-46e7-8db3-7e7af379c800",
    width: 1792,
    height: 1024
  };

  image = computed(() => {
    return this.imageService.resizeImage(this.notFoundImage, this.notFoundImage.width, this.notFoundImage.height);
  });

  errorMessage = input<string>(`We're sorry. The requested page could not be loaded.`);
  errorTitle = input<string>('Page not available.');

}
