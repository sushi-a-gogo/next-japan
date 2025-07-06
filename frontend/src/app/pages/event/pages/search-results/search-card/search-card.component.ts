import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventData } from '@app/pages/event/models/event-data.model';
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
  resizedImage = computed(() => {
    return this.imageService.resizeImage(this.event().image, 224, 128);
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
