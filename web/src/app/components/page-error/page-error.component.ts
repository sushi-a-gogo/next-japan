import { NgOptimizedImage } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ImageService } from '@app/services/image.service';

@Component({
  selector: 'app-page-error',
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './page-error.component.html',
  styleUrl: './page-error.component.scss'
})
export class PageErrorComponent {
  private imageService = inject(ImageService);
  resizedImage = this.imageService.resizeImage({ id: 'error.png', width: 1536, height: 1024 }, 1536, 1024);

  @Input() errorTitle = 'Page not available.';
  @Input() errorMessage = `We're sorry. The requested page could not be loaded.`;
  @Input() routerLink?: string;
  @Input() routerLinkText?: string;

}
