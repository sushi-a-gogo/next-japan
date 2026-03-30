import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from "@angular/router";
import { ImageService } from '@app/core/services/image.service';
import { EventData } from '@app/features/events/models/event-data.model';
import { EventLikeButtonComponent } from "@app/features/events/ui/event-like-button/event-like-button.component";
import { EventShareButtonComponent } from "@app/features/events/ui/event-share-button/event-share-button.component";
import { NextButtonComponent } from "@app/shared/ui/next-button/next-button.component";

@Component({
  selector: 'app-suggested-event-card',
  imports: [NgOptimizedImage, EventLikeButtonComponent, EventShareButtonComponent, NextButtonComponent, RouterLink],
  templateUrl: './suggested-event-card.component.html',
  styleUrl: './suggested-event-card.component.scss'
})
export class SuggestedEventCardComponent {
  private imageService = inject(ImageService);

  event = input.required<EventData>();
  routerLink = computed(() => `/event/${this.event()?.eventId}`);

  eventImage = computed(() => {
    return this.event() ? this.imageService.resizeImage(this.event()!.image, 384, 256) : null;
  });


}
