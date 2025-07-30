import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import slideDownBounce from '@app/animations/slideDownBounce.animation';
import { ImageService } from '@app/services/image.service';
import organization from 'src/lib/organization-data';

@Component({
  selector: 'app-hero',
  imports: [NgOptimizedImage],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideDownBounce],
  host: { '[@slideDownBounce]': 'in' }
})
export class HeroComponent {
  animationState = 'in';
  private imageService = inject(ImageService);

  org = organization;
  heroImage = this.imageService.resizeImage(organization.image, organization.image.width, organization.image.height);
}
