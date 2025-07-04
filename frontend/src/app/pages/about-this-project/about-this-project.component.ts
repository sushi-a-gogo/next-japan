import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { AppImageData } from '@app/models/app-image-data.model';
import { AuthMockService } from '@app/services/auth-mock.service';
import { ImageService } from '@app/services/image.service';

@Component({
  selector: 'app-about-this-project',
  imports: [NgOptimizedImage],
  templateUrl: './about-this-project.component.html',
  styleUrl: './about-this-project.component.scss'
})
export class AboutThisProjectComponent implements OnInit {
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

  open = signal(false);

  private auth = inject(AuthMockService);
  isAuthenticated = this.auth.isAuthenticated;

  ngOnInit(): void {
    setTimeout(() => this.open.set(true), 100);
  }
}
