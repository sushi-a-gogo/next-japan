import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { EventData } from '@app/pages/event/models/event-data.model';
import { ImageService } from '@app/services/image.service';
import { LoadingSpinnerComponent } from '@app/shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-dream-banner',
  imports: [NgOptimizedImage, LoadingSpinnerComponent],
  templateUrl: './dream-banner.component.html',
  styleUrl: './dream-banner.component.scss'
})
export class DreamBannerComponent {
  private imageService = inject(ImageService);

  dreamEvent = input<EventData | null>(null)
  busy = input<boolean>(false);
  error = input<string | null>();

  resizedImage = computed(() => {
    if (!this.dreamEvent()) {
      return null;
    }

    const image = this.dreamEvent()!.image;
    return this.imageService.resizeImage(image, image.width, image.height)
  });
}
