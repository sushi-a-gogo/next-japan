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
    // trigger('fadeSlideIn', [
    //   state('void', style({
    //     opacity: 0,
    //     transform: 'scale(0.95)'
    //   })),
    //   state('in', style({
    //     opacity: 1,
    //     transform: 'scale(1)'
    //   })),
    //   transition('void => in', [
    //     animate('600ms ease-out')
    //   ])
    // ])
    trigger('fadeSlideIn', [
      state('void', style({
        opacity: 0,
        transform: 'scale(1.025)'
      })),
      state('in', style({
        opacity: 1,
        transform: 'scale(1.0)'
      })),
      transition('void => in', [
        animate('400ms ease-out')
      ])
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
