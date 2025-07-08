import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AppImageData } from '@app/models/app-image-data.model';
import { AuthMockService } from '@app/services/auth-mock.service';
import { ImageService } from '@app/services/image.service';
import { MetaService } from '@app/services/meta.service';

@Component({
  selector: 'app-about-this-project',
  imports: [NgOptimizedImage],
  templateUrl: './about-this-project.component.html',
  styleUrl: './about-this-project.component.scss'
})
export class AboutThisProjectComponent implements OnInit {
  private title = inject(Title);
  private meta = inject(MetaService);

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
    this.title.setTitle('About Next Japan');

    // Set meta tags
    const description = 'Learn about the vision, technology, and developer behind the Next Japan project.';
    this.meta.updateTags(this.title.getTitle(), description);

    setTimeout(() => this.open.set(true), 100);
  }
}
