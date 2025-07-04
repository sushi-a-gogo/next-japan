import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { AiEvent } from '@app/pages/event/models/ai-event.model';
import { ImageService } from '@app/services/image.service';

@Component({
  selector: 'app-dream-header',
  imports: [NgOptimizedImage],
  templateUrl: './dream-header.component.html',
  styleUrl: './dream-header.component.scss'
})
export class DreamHeaderComponent {
  event = input.required<AiEvent>();
  savedEvent = input<AiEvent | null>();

  private imageService = inject(ImageService);

  resizedImage = computed(() => {
    if (this.savedEvent()) {
      const image = this.savedEvent()!.image;
      return this.imageService.resizeImage(image, image.width, image.height).src;
    }
    return this.event().imageUrl;
  });

}
