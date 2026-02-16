import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OpportunityDateComponent } from "@app/features/events/ui/opportunity-date/opportunity-date.component";
import { ImageService } from '@core/services/image.service';
import { EventData } from '@events/models/event-data.model';

@Component({
  selector: 'app-search-card',
  imports: [NgOptimizedImage, OpportunityDateComponent],
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
