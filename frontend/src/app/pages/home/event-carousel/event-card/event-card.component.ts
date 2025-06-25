import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventData } from '@app/pages/event/models/event-data.model';
import { ImageService } from '@app/services/image.service';
import { OpportunityDateComponent } from "../../../../shared/opportunity-date/opportunity-date.component";

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

  routerLink: string = '';
  private router = inject(Router);

  ngOnInit() {
    this.routerLink = `/event/${this.event().eventId}`;
  }

  goToEvent() {
    this.router.navigate([this.routerLink]);
  }
}
