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
    cloudfareImageId: "3b588c66-9a25-4edd-ed61-560b698cf600",
    width: 1792,
    height: 1024
  };

  size = input<number>(48);

  image = computed(() => {
    return this.imageService.resizeImage(this.logo, this.size(), this.size());
  });

  style = computed(() => ({ width: `${this.size()}px`, height: `${this.size}px` }));

}
