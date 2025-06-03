import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { EventCarouselComponent } from "@app/components/event-carousel/event-carousel.component";
import { EventData } from '@app/event/models/event-data.model';
import { EventOpportunity } from '@app/event/models/event-opportunity.model';
import { ApiResult } from '@app/models/api-result.model';
import { OrganizationEvents } from '@app/models/organization-events.model';
import { OrganizationInformation } from '@app/models/organization-information.model';
import { OrganizationService } from '@app/services/organization.service';
import { LoadingSpinnerComponent } from "@app/shared/loading-spinner/loading-spinner.component";
import { of, switchMap } from 'rxjs';
import { OrgBannerComponent } from "./org-banner/org-banner.component";

@Component({
  selector: 'app-home',
  imports: [LoadingSpinnerComponent, OrgBannerComponent, EventCarouselComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  org?: OrganizationInformation;
  events = signal<EventData[]>([]);
  opportunities = signal<EventOpportunity[]>([]);
  loading = false;

  constructor(private title: Title,
    private organizationService: OrganizationService,
  ) { }

  ngOnInit(): void {
    this.organizationService.getOrganizationInfo$().pipe(
      switchMap((res: ApiResult) => {
        if (res.hasError) {
          return of(res);
        }

        this.org = res.retVal as OrganizationInformation;
        this.title.setTitle(`${this.org.name}`);
        return this.organizationService.getEvents$();
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((res: ApiResult) => {
      if (!res.hasError) {
        const orgEvents = res.retVal as OrganizationEvents;
        this.events.set(orgEvents.events);
        this.opportunities.set(orgEvents.upcomingOpportunities);
      }
    });
    ;
  }
}
