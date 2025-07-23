import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppImageData } from '@app/models/app-image-data.model';
import { ImageService } from '@app/services/image.service';
import { plans } from './subscription-plan.model';

@Component({
  selector: 'app-sign-up',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  private imageService = inject(ImageService);
  private aboutImage: AppImageData = {
    id: "about.png",
    cloudflareImageId: "32d6e94b-c33d-4953-379c-fe2a1b373400",
    width: 1792,
    height: 1024
  };

  image = computed(() => {
    return this.imageService.resizeImage(this.aboutImage, this.aboutImage.width, this.aboutImage.height);
  });

  plans = plans;
}
