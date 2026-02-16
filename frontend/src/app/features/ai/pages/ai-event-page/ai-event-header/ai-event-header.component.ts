import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { ImageService } from '@core/services/image.service';
import { AiEvent } from '@events/models/ai-event.model';
import { EventData } from '@events/models/event-data.model';

@Component({
  selector: 'app-ai-event-header',
  imports: [NgOptimizedImage],
  templateUrl: './ai-event-header.component.html',
  styleUrl: './ai-event-header.component.scss'
})
export class AiEventHeaderComponent {
  event = input.required<AiEvent>();
  savedEvent = input<EventData | null>();

  xAi = computed(() => this.event().aiProvider === 'Grok');

  private imageService = inject(ImageService);

  bannerImage = computed(() => {
    if (this.savedEvent()) {
      const image = this.savedEvent()!.image;
      return this.imageService.resizeImage(image, image.width, image.height).src;
    }
    return this.event().imageUrl;
  });

}
