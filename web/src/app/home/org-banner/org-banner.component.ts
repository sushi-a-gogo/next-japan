import { NgOptimizedImage } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { OrganizationInformation } from '@app/models/organization-information.model';
import { AuthMockService } from '@app/services/auth-mock.service';
import { LoginButtonComponent } from '@app/shared/login-button/login-button.component';
import { environment } from '@environments/environment';
import { AppLogoComponent } from "../../shared/app-logo/app-logo.component";

@Component({
  selector: 'app-org-banner',
  imports: [NgOptimizedImage, LoginButtonComponent, AppLogoComponent],
  templateUrl: './org-banner.component.html',
  styleUrl: './org-banner.component.scss'
})
export class OrgBannerComponent {
  org = input.required<OrganizationInformation>();
  bannerImage = computed(() => `${environment.apiUri}/images/${this.org().image.id}`);

  constructor(public auth: AuthMockService) { }

  get bannerImageBackground() {
    return this.org()
      ? `linear-gradient(rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.1)), url('/assets/images/${this.org().image.id}')`
      : undefined;
  }

}
