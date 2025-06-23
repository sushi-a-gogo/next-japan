import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { OrganizationInformation } from '@app/models/organization-information.model';
import { AuthMockService } from '@app/services/auth-mock.service';
import { NavbarComponent } from "../../components/navbar/navbar.component";

@Component({
  selector: 'app-org-banner',
  imports: [NgOptimizedImage, NavbarComponent],
  templateUrl: './org-banner.component.html',
  styleUrl: './org-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrgBannerComponent {
  private auth = inject(AuthMockService);

  isAuthenticated = this.auth.isAuthenticated;
  org = input<OrganizationInformation | null>(null);
  bannerImage = `assets/images/tokyo-day.webp`;
}
