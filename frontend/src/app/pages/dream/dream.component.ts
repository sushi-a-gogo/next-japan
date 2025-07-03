import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { AppImageData } from '@app/models/app-image-data.model';
import { ImageService } from '@app/services/image.service';
import { ContentGeneratorComponent } from "./components/content-generator/content-generator.component";

@Component({
  selector: 'app-dream',
  imports: [NgOptimizedImage, ContentGeneratorComponent],
  templateUrl: './dream.component.html',
  styleUrl: './dream.component.scss'
})
export class DreamComponent implements OnInit {
  private imageService = inject(ImageService);
  private aiImage: AppImageData = {
    id: "ai-banner.png",
    cloudfareImageId: "a93ea8ab-b8cd-4d31-6832-163c8d097200",
    width: 1024,
    height: 1792
  };

  image = computed(() => {
    return this.imageService.resizeImage(this.aiImage, this.aiImage.width, this.aiImage.height);
  });

  private title = inject(Title);
  private meta = inject(Meta);

  ngOnInit(): void {
    this.title.setTitle('Next Japan AI');

    // Set meta tags
    const description = 'This page leverages advanced AI technology to help you design your ideal Japanese vacation event.';
    this.meta.updateTag({ name: 'description', content: description });

    // Open Graph meta tags
    this.meta.updateTag({ property: 'og:title', content: this.title.getTitle() });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: window.location.href });

  }
}
