import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import fadeIn from '@app/animations/fadeIn.animation';
import { ImageService } from '@app/services/image.service';
import organization from 'src/lib/organization-data';

@Component({
  selector: 'app-hero',
  imports: [NgOptimizedImage],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeIn],
  host: { '[@fadeIn]': 'in' }
})
export class HeroComponent {
  animationState = 'in';
  private imageService = inject(ImageService);

  org = organization;
  heroImage = this.imageService.resizeImage(organization.image, organization.image.width, organization.image.height);
}
