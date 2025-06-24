import { NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NavbarComponent } from "@app/components/navbar/navbar.component";
import { AuthMockService } from '@app/services/auth-mock.service';
import { ImageService } from '@app/services/image.service';

@Component({
  selector: 'app-about-this-project',
  imports: [NgOptimizedImage, NavbarComponent],
  templateUrl: './about-this-project.component.html',
  styleUrl: './about-this-project.component.scss'
})
export class AboutThisProjectComponent {
  private auth = inject(AuthMockService);
  private imageService = inject(ImageService);

  isAuthenticated = this.auth.isAuthenticated;
  backgroundImage = this.imageService.resizeImage({ id: 'about.png', width: 1536, height: 1024 }, 1536, 1024);

}
