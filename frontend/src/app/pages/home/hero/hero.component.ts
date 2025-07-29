import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ImageService } from '@app/services/image.service';
import organization from 'src/lib/organization-data';

@Component({
  selector: 'app-hero',
  imports: [NgOptimizedImage],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeSlideIn', [
      state('void', style({
        transform: 'translateY(20px)'
      })),
      state('in', style({
        transform: 'translateY(0px)'
      })),
      transition('void => in', [
        animate('400ms ease-out')
      ])
      // transition('void => in', [
      //   animate('400ms cubic-bezier(0.23, 1.5, 0.32, 1)', style({ transform: 'translateY(-6px)' })),
      //   animate('120ms cubic-bezier(0.23, 1.5, 0.32, 1)', style({ transform: 'translateY(2px)' })),
      //   animate('80ms cubic-bezier(0.23, 1.5, 0.32, 1)', style({ transform: 'translateY(0)' }))
      // ])
    ])
  ],
  host: { '[@fadeSlideIn]': 'in' }
})
export class HeroComponent {
  animationState = 'in';
  private imageService = inject(ImageService);

  org = organization;
  heroImage = this.imageService.resizeImage(organization.image, organization.image.width, organization.image.height);
}
