import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventData } from '@app/pages/event/models/event-data.model';
import { ImageService } from '@app/services/image.service';
import { OpportunityDateComponent } from "./opportunity-date/opportunity-date.component";

@Component({
  selector: 'app-event-card',
  imports: [NgOptimizedImage, OpportunityDateComponent],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss'
})
export class EventCardComponent implements OnInit {
  private imageService = inject(ImageService);

  event = input.required<EventData>();
  resizedImage = computed(() => {
    return this.imageService.resizeImage(this.event().image, 384, 256);
  });

  openInNewTab = input<boolean>(false);


  routerLink: string = '';

  private router = inject(Router);

  ngOnInit() {
    this.routerLink = `/event/${this.event().eventId}`;
  }

  goToEvent() {
    if (this.openInNewTab()) {
      window.open(this.routerLink, `_blank`);
    } else {
      this.router.navigate([this.routerLink]);
    }
  }
}
