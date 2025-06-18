import { NgOptimizedImage } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { FooterComponent } from '@app/footer/footer.component';
import { AppImageData } from '@app/models/app-image-data.model';
import { ImageService } from '@app/services/image.service';
import { ContentGeneratorComponent } from "./components/content-generator/content-generator.component";

@Component({
  selector: 'app-dream',
  imports: [NgOptimizedImage, ContentGeneratorComponent, FooterComponent],
  templateUrl: './dream.component.html',
  styleUrl: './dream.component.scss'
})
export class DreamComponent implements OnInit {
  backgroundImage: AppImageData = { id: 'dream.png', width: 1536, height: 1024 };
  backgroundImageSrc: string;

  private title = inject(Title);
  private meta = inject(Meta);
  private imageService = inject(ImageService);

  constructor() {
    this.backgroundImageSrc = this.imageService.resizeImage(this.backgroundImage, 1536, 1024).src;
  }

  ngOnInit(): void {
    this.title.setTitle('Next Japan Dream Events');

    // Set meta tags
    const description = 'This page leverages advanced AI technology to help you design your ideal Japanese vacation event.';
    this.meta.updateTag({ name: 'description', content: description });

    // Open Graph meta tags
    this.meta.updateTag({ property: 'og:title', content: this.title.getTitle() });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: window.location.href });

  }
}
