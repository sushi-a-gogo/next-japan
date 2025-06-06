import { Component, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventData } from '@app/event/models/event-data.model';
import { environment } from '@environments/environment';
import { OpportunityDateComponent } from "../../opportunity-date/opportunity-date.component";

@Component({
  selector: 'app-event-card',
  imports: [OpportunityDateComponent],
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
    if (this.event().imageId) {
      this.imageSrc = `${environment.apiUri}/images/${this.event().imageId}`;
    }
  }


  goToEvent() {
    if (this.openInNewTab()) {
      window.open(this.routerLink, `_blank`);
    } else {
      this.router.navigate([this.routerLink]);
    }
  }
}
