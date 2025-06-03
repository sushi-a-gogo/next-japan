import { Component, input } from '@angular/core';
import { OrganizationInformation } from '@app/models/organization-information.model';
import { AuthMockService } from '@app/services/auth-mock.service';
import { LoginButtonComponent } from '@app/shared/login-button/login-button.component';
import { AppLogoComponent } from "../../shared/app-logo/app-logo.component";

@Component({
  selector: 'app-org-banner',
  imports: [LoginButtonComponent, AppLogoComponent],
  templateUrl: './org-banner.component.html',
  styleUrl: './org-banner.component.scss'
})
export class OrgBannerComponent {
  org = input.required<OrganizationInformation>();

  constructor(public auth: AuthMockService) { }

  get logoImageSrc() {
    return `assets/images/${this.org().logoImageId}`;
  }

  get bannerImageBackground() {
    return this.org().bannerImageId
      ? `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url('/assets/images/${this.org().bannerImageId}')`
      : undefined;
  }

}
