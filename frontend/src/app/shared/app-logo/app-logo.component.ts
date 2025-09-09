import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { AppImageData } from '@app/models/app-image-data.model';
import { ImageService } from '@app/services/image.service';

@Component({
  selector: 'app-logo',
  imports: [NgOptimizedImage],
  templateUrl: './app-logo.component.html',
  styleUrl: './app-logo.component.scss'
})
export class AppLogoComponent {
  private imageService = inject(ImageService);
  private logo: AppImageData = {
    id: "app-logo.png",
    cloudflareImageId: "3b588c66-9a25-4edd-ed61-560b698cf600",
    width: 1792,
    height: 1024
  };

  width = input<number>(96);

  image = computed(() => {
    const height = Math.ceil(this.width() * 2 / 3);
    return this.imageService.resizeImage(this.logo, this.width(), height);
  });

  style = computed(() => ({ width: `${this.image().image.width}px`, height: `${this.image().image.height}px` }));

}
