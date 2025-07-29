import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppImageData } from '@app/models/app-image-data.model';
import { ImageService } from '@app/services/image.service';

@Component({
  selector: 'app-ai-banner',
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './ai-banner.component.html',
  styleUrl: './ai-banner.component.scss',
  animations: [
    trigger('fadeSlideIn', [
      state('void', style({
        opacity: 0,
        filter: 'blur(5px)'
      })),
      state('in', style({
        opacity: 1,
        filter: 'blur(0)'
      })),
      transition('void => in', [
        animate('1000ms ease-out')
      ])
    ])
  ],
  host: { '[@fadeSlideIn]': 'in' }
})
export class AiBannerComponent {
  private imageService = inject(ImageService);

  private aiImage: AppImageData = {
    id: "ai-background.png",
    cloudflareImageId: "46a4b01c-c275-4556-aec4-ec7be2e8d500",
    width: 1792,
    height: 1024
  };

  aiBackgroundImage = computed(() => {
    return this.imageService.resizeImage(this.aiImage, this.aiImage.width, this.aiImage.height);
  });

}
