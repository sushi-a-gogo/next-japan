import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { AppImageData } from '@app/core/models/app-image-data.model';
import { ImageService } from '@app/core/services/image.service';
import { ThemeService } from '@app/core/services/theme.service';

@Component({
  selector: 'app-logo',
  imports: [NgOptimizedImage],
  templateUrl: './app-logo.component.html',
  styleUrl: './app-logo.component.scss'
})
export class AppLogoComponent {
  private imageService = inject(ImageService);
  private themeService = inject(ThemeService);

  private logo: AppImageData = {
    id: "app-logo.png",
    cloudflareImageId: "5b99a6f9-b2b3-44fe-14d5-4df135419100",
    width: 1536,
    height: 1024
  };

  private darkLogo: AppImageData = {
    id: "app-logo.png",
    cloudflareImageId: "fd884c4e-81ea-4d2d-3332-07c8ed341600",
    width: 1024,
    height: 1024
  };

  width = input<number>(196);
  mode = input<'light' | 'dark'>('light');

  inDarkMode = computed(() => {
    return this.mode() === 'dark' || this.themeService.inDarkMode();
  });

  image = computed(() => {
    const appLogo = this.inDarkMode() ? this.darkLogo : this.logo;
    const height = Math.ceil(this.width() * 2 / 3);
    return this.imageService.resizeImage(appLogo, this.width(), height);
  });

  style = computed(() => ({ width: `${this.image().image.width}px`, height: `${this.image().image.height}px` }));

}
