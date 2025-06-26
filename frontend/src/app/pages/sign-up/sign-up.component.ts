import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ImageService } from '@app/services/image.service';
import { plans } from './subscription-plan.model';

@Component({
  selector: 'app-sign-up',
  imports: [NgOptimizedImage, RouterLink, CurrencyPipe],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  private imageService = inject(ImageService);

  backgroundImage = this.imageService.resizeImage({ id: 'about.png', width: 1792, height: 1024 }, 1792, 1024);
  plans = plans;
}
