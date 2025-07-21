import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ImageService } from '@app/services/image.service';
import organization from 'src/lib/organization-data';

@Component({
  selector: 'app-org-banner',
  imports: [NgOptimizedImage],
  templateUrl: './org-banner.component.html',
  styleUrl: './org-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrgBannerComponent {
  private imageService = inject(ImageService);

  org = organization;
  bannerImage = this.imageService.resizeImage(organization.image, organization.image.width, organization.image.height);
}
