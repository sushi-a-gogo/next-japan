import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { NavbarComponent } from "@app/components/navbar/navbar.component";
import { OrganizationInformation } from '@app/models/organization-information.model';
import { AuthMockService } from '@app/services/auth-mock.service';
import { ImageService } from '@app/services/image.service';

@Component({
  selector: 'app-org-banner',
  imports: [NgOptimizedImage, NavbarComponent],
  templateUrl: './org-banner.component.html',
  styleUrl: './org-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrgBannerComponent {
  private auth = inject(AuthMockService);
  private imageService = inject(ImageService);

  isAuthenticated = this.auth.isAuthenticated;
  org = input<OrganizationInformation | null>(null);
  bannerImage = computed(() => {
    if (this.org()) {
      const image = this.org()!.image;
      return this.imageService.resizeImage(image, image.width, image.height);
    }

    return undefined;
  });
}
