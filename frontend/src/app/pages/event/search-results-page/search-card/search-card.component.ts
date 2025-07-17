import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventData } from '@app/models/event/event-data.model';
import { ImageService } from '@app/services/image.service';
import { OpportunityDateComponent } from "@app/shared/opportunity-date/opportunity-date.component";

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
    const width = this.isGrokEvent() ? 224 : 170;
    return this.imageService.resizeImage(this.event().image, width, 128);
  });

  routerLink: string = '';
  private router = inject(Router);

  ngOnInit() {
    this.routerLink = `/event/${this.event().eventId}`;
  }

  goToEvent() {
    this.router.navigate([this.routerLink], { queryParams: { q: this.query() } });
  }

}
