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
