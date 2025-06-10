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

  dreamEvent = input.required<EventData>()
  imageUrl = input<string | null>(null);

  resizedImage = computed(() => this.imageService.resizeImage(this.dreamEvent().image, this.dreamEvent().image.width, this.dreamEvent().image.height));
}
