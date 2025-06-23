import { Component, inject } from '@angular/core';
import { AuthMockService } from '@app/services/auth-mock.service';
import { OrganizationService } from '@app/services/organization.service';
import { NavbarComponent } from "../../../components/navbar/navbar.component";
import { EventBannerComponent } from "./event-banner/event-banner.component";

@Component({
  selector: 'app-event-header',
  imports: [EventBannerComponent, NavbarComponent],
  templateUrl: './event-header.component.html',
  styleUrl: './event-header.component.scss'
})
export class EventHeaderComponent {
  private auth = inject(AuthMockService);
  private organizationService = inject(OrganizationService);

  isAuthenticated = this.auth.isAuthenticated;
  organizationInformation = this.organizationService.organizationInformation;

}
