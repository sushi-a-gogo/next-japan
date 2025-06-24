import { Component, input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventData } from '@app/pages/event/models/event-data.model';

@Component({
  selector: 'app-event-breadcrumb',
  imports: [RouterLink],
  templateUrl: './event-breadcrumb.component.html',
  styleUrl: './event-breadcrumb.component.scss'
})
export class EventBreadcrumbComponent implements OnInit {
  data = input.required<EventData>();
  eventRouterLink!: string;
  landingPageRouterLink!: string;
  clientPageRouterLink!: string;

  ngOnInit(): void {
    this.eventRouterLink = `/event/${this.data().eventId}`;
    this.landingPageRouterLink = `/home`;
    this.clientPageRouterLink = `/home`;
  }


}
