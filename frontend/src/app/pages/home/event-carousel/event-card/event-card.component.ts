import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { EventData } from '@app/pages/event/models/event-data.model';
import { ImageService } from '@app/services/image.service';
import { OpportunityDateComponent } from "@shared/opportunity-date/opportunity-date.component";

@Component({
  selector: 'app-event-card',
  imports: [NgOptimizedImage, OpportunityDateComponent],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss'
})
export class EventCardComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private imageService = inject(ImageService);

  private defaultImage = {
    image: {
      id: 'about.png',
      width: 1792,
      height: 1024
    },
    src: "assets/images/default-event.avif"
  };

  event = input.required<EventData>();
  isGrokEvent = computed(() => this.event().aiProvider === 'Grok');
  resizedImage = computed(() => {
    if (isPlatformBrowser(this.platformId)) {
      const width = this.isGrokEvent() ? 342 : 448;
      return this.imageService.resizeImage(this.event().image, width, 256)
    }
    return this.defaultImage;
  });

  routerLink: string = '';
  private router = inject(Router);

  ngOnInit() {
    this.routerLink = `/event/${this.event().eventId}`;
  }

  goToEvent() {
    this.router.navigate([this.routerLink]);
  }
}
