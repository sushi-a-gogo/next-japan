import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventInformation } from '@app/pages/event/models/event-information.model';
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

  event = input.required<EventInformation>();
  resizedImage = computed(() => {
    return this.imageService.resizeImage(this.event().image, 192, 128);
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
