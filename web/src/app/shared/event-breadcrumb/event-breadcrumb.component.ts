import { Component, inject, input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventData } from '@app/event/models/event-data.model';
import { OrganizationService } from '@app/services/organization.service';

@Component({
  selector: 'app-event-breadcrumb',
  imports: [RouterLink],
  templateUrl: './event-breadcrumb.component.html',
  styleUrl: './event-breadcrumb.component.scss'
})
export class EventBreadcrumbComponent implements OnInit {
  private organizationService = inject(OrganizationService);

  data = input.required<EventData>();
  organization = this.organizationService.organizationInformation;
  eventRouterLink!: string;
  landingPageRouterLink!: string;
  clientPageRouterLink!: string;

  ngOnInit(): void {
    this.eventRouterLink = `/event/${this.data().eventId}`;
    this.landingPageRouterLink = `/home`;
    this.clientPageRouterLink = `/home`;
  }


}
