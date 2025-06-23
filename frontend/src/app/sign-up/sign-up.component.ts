import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ImageService } from '@app/services/image.service';
import { NavbarComponent } from "../components/navbar/navbar.component";
import { plans } from './subscription-plan.model';

@Component({
  selector: 'app-sign-up',
  imports: [NgOptimizedImage, CurrencyPipe, NavbarComponent],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  private imageService = inject(ImageService);

  backgroundImage = this.imageService.resizeImage({ id: 'about.png', width: 1536, height: 1024 }, 1536, 1024);
  plans = plans;
}
