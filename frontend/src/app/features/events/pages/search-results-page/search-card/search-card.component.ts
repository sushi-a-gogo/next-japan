import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImageService } from '@app/core/services/image.service';
import { EventData } from '@app/features/events/models/event-data.model';
import { EventDateCardComponent } from "@app/features/events/ui/event-date-card/event-date-card.component";

@Component({
  selector: 'app-search-card',
  imports: [NgOptimizedImage, EventDateCardComponent],
  templateUrl: './search-card.component.html',
  styleUrl: './search-card.component.scss'
})
export class SearchCardComponent implements OnInit {
  private imageService = inject(ImageService);

  event = input.required<EventData>();
  query = input<string>();

  isGrokEvent = computed(() => this.event().aiProvider === 'Grok');

  resizedImage = computed(() => {
    const width = this.isGrokEvent() ? 384 : 384;
    return this.imageService.resizeImage(this.event().image, width, 256);
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
