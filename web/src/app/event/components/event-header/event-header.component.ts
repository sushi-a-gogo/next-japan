import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthMockService } from '@app/services/auth-mock.service';
import { OrganizationService } from '@app/services/organization.service';
import { LoginButtonComponent } from "@app/shared/login-button/login-button.component";
import { AppLogoComponent } from "../../../shared/app-logo/app-logo.component";
import { EventBannerComponent } from "./event-banner/event-banner.component";

@Component({
  selector: 'app-event-header',
  imports: [RouterLink, LoginButtonComponent, EventBannerComponent, AppLogoComponent],
  templateUrl: './event-header.component.html',
  styleUrl: './event-header.component.scss'
})
export class EventHeaderComponent {
  private auth = inject(AuthMockService);
  private organizationService = inject(OrganizationService);

  isAuthenticated = this.auth.isAuthenticated;
  organizationInformation = this.organizationService.organizationInformation;

}
