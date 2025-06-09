import { NgOptimizedImage } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OpportunityDateComponent } from "@app/components/opportunity-date/opportunity-date.component";
import { EventData } from '@app/event/models/event-data.model';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-event-card',
  imports: [NgOptimizedImage, OpportunityDateComponent],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss'
})
export class EventCardComponent implements OnInit {
  event = input.required<EventData>();
  openInNewTab = input<boolean>(false);

  imageSrc?: string;
  routerLink: string = '';

  private router = inject(Router);

  ngOnInit() {
    this.routerLink = `/event/${this.event().eventId}`;
    this.imageSrc = `${environment.apiUri}/images/${this.event().image.id}`;
  }


  goToEvent() {
    if (this.openInNewTab()) {
      window.open(this.routerLink, `_blank`);
    } else {
      this.router.navigate([this.routerLink]);
    }
  }
}
