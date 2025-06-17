import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { EventData } from '@app/event/models/event-data.model';
import { ImageService } from '@app/services/image.service';

@Component({
  selector: 'app-dream-banner',
  imports: [NgOptimizedImage],
  templateUrl: './dream-banner.component.html',
  styleUrl: './dream-banner.component.scss'
})
export class DreamBannerComponent {
  private imageService = inject(ImageService);

  dreamEvent = input<EventData | null>(null)

  resizedImage = computed(() => {
    if (!this.dreamEvent()) {
      return null;
    }

    const image = this.dreamEvent()!.image;
    return this.imageService.resizeImage(image, image.width, image.height)
  });
}
