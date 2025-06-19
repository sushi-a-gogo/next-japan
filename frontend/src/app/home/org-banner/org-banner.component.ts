import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { AppImageData } from '@app/models/app-image-data.model';
import { OrganizationInformation } from '@app/models/organization-information.model';
import { AuthMockService } from '@app/services/auth-mock.service';
import { LoginButtonComponent } from '@app/shared/login-button/login-button.component';
import { AppLogoComponent } from "../../shared/app-logo/app-logo.component";

@Component({
  selector: 'app-org-banner',
  imports: [NgOptimizedImage, LoginButtonComponent, AppLogoComponent],
  templateUrl: './org-banner.component.html',
  styleUrl: './org-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrgBannerComponent {
  private auth = inject(AuthMockService);

  isAuthenticated = this.auth.isAuthenticated;
  org = input.required<OrganizationInformation>();
  image = input.required<AppImageData>();
  bannerImage = computed(() => `assets/images/tokyo-day.webp`);
}
