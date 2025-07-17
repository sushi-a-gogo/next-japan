import { Component, input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventOpportunity } from '@app/models/event/event-opportunity.model';

@Component({
  selector: 'app-event-breadcrumb',
  imports: [RouterLink],
  templateUrl: './event-breadcrumb.component.html',
  styleUrl: './event-breadcrumb.component.scss'
})
export class EventBreadcrumbComponent implements OnInit {
  data = input.required<EventOpportunity>();
  eventRouterLink!: string;
  landingPageRouterLink!: string;
  clientPageRouterLink!: string;

  ngOnInit(): void {
    this.eventRouterLink = `/event/${this.data().eventId}`;
    this.landingPageRouterLink = `/home`;
    this.clientPageRouterLink = `/home`;
  }


}
