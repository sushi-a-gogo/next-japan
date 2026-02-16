import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { LikeButtonComponent } from "@app/features/events/ui/like-button/like-button.component";
import { ShareButtonComponent } from "@app/features/events/ui/share-button/share-button.component";
import { AnchorComponent } from '@app/shared/components/anchor/anchor.component';
import { ImageService } from '@core/services/image.service';
import { EventData } from '@features/events/models/event-data.model';

@Component({
  selector: 'app-next-event-card',
  imports: [NgOptimizedImage, AnchorComponent, LikeButtonComponent, ShareButtonComponent],
  templateUrl: './next-event-card.component.html',
  styleUrl: './next-event-card.component.scss'
})
export class NextEventCardComponent {
  private imageService = inject(ImageService);

  event = input.required<EventData>();
  routerLink = computed(() => `/event/${this.event()?.eventId}`);

  eventImage = computed(() => {
    return this.event() ? this.imageService.resizeImage(this.event()!.image, 384, 256) : null;
  });


}
