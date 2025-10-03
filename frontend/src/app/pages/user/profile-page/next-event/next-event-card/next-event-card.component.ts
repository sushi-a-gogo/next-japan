import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { EventData } from '@app/models/event/event-data.model';
import { ImageService } from '@app/services/image.service';
import { AnchorComponent } from '@app/shared/anchor/anchor.component';
import { LikeButtonComponent } from "@app/shared/like-button/like-button.component";
import { ShareButtonComponent } from "@app/shared/share-button/share-button.component";

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
