import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { PageErrorComponent } from '@app/components/page-error/page-error.component';
import { EventData } from '@app/event/models/event-data.model';
import { EventOpportunity } from '@app/event/models/event-opportunity.model';
import { FooterComponent } from '@app/footer/footer.component';
import { EventCarouselComponent } from "@app/home/event-carousel/event-carousel.component";
import { ApiResult } from '@app/models/api-result.model';
import { OrganizationInformation } from '@app/models/organization-information.model';
import { ImageService } from '@app/services/image.service';
import { OrganizationService } from '@app/services/organization.service';
import { of, switchMap } from 'rxjs';
import { OrgBannerComponent } from "./org-banner/org-banner.component";

@Component({
  selector: 'app-home',
  imports: [FooterComponent, PageErrorComponent, OrgBannerComponent, EventCarouselComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private imageService = inject(ImageService);
  private destroyRef = inject(DestroyRef);

  org?: OrganizationInformation;
  events = signal<EventData[]>([]);
  opportunities = signal<EventOpportunity[]>([]);
  loaded = signal<boolean>(false);
  hasError = signal<boolean>(false);

  backgroundImage = "";// `url('/assets/images/orgs/tokyo.png')`;

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

        const resizedImage = this.imageService.resizeImage(this.org.image, 384, 256);
        this.backgroundImage = `url('${resizedImage.src}')`;
        return this.organizationService.getEvents$();
      }),
      switchMap((res) => {
        this.events.set(res.retVal);
        return this.organizationService.getNextOpportunities$();
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((res: ApiResult) => {
      if (!res.hasError) {
        this.opportunities.set(res.retVal);
      }
      this.loaded.set(true);
    });
  }


}
