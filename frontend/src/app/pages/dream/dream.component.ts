import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { AppImageData } from '@app/models/app-image-data.model';
import { ImageService } from '@app/services/image.service';
import { FooterComponent } from '@app/shared/footer/footer.component';
import { ContentGeneratorComponent } from "./components/content-generator/content-generator.component";

@Component({
  selector: 'app-dream',
  imports: [NgOptimizedImage, ContentGeneratorComponent, FooterComponent],
  templateUrl: './dream.component.html',
  styleUrl: './dream.component.scss'
})
export class DreamComponent implements OnInit {
  private imageService = inject(ImageService);
  private aiImage: AppImageData = {
    id: "ai.png",
    cloudfareImageId: "22d97aa6-85ed-4713-d256-6a0bf903af00",
    width: 768,
    height: 1366
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
