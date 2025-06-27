import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { NavbarComponent } from "@app/components/navbar/navbar.component";
import { AppImageData } from '@app/models/app-image-data.model';
import { AuthMockService } from '@app/services/auth-mock.service';
import { ImageService } from '@app/services/image.service';
import { FooterComponent } from "../../shared/footer/footer.component";

@Component({
  selector: 'app-about-this-project',
  imports: [NgOptimizedImage, NavbarComponent, FooterComponent],
  templateUrl: './about-this-project.component.html',
  styleUrl: './about-this-project.component.scss'
})
export class AboutThisProjectComponent {
  private imageService = inject(ImageService);
  private aboutImage: AppImageData = {
    id: "about.png",
    cloudfareImageId: "32d6e94b-c33d-4953-379c-fe2a1b373400",
    width: 1366,
    height: 768
  };

  image = computed(() => {
    return this.imageService.resizeImage(this.aboutImage, this.aboutImage.width, this.aboutImage.height);
  });

  private auth = inject(AuthMockService);
  isAuthenticated = this.auth.isAuthenticated;
}
