import { NgOptimizedImage } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { AppImageData } from '@app/models/app-image-data.model';
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
  image = input.required<AppImageData>();
  bannerImage = computed(() => `${environment.apiUri}/images/${this.image().id}`);

  constructor(public auth: AuthMockService) { }

  get bannerImageBackground() {
    return this.org()
      ? `linear-gradient(rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.1)), url('/assets/images/${this.org().image.id}')`
      : undefined;
  }

}
