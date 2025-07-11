import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppImageData } from '@app/models/app-image-data.model';
import { ContentGeneratorComponent } from "@app/pages/dream/pages/ai-event-builder/content-generator/content-generator.component";
import { ImageService } from '@app/services/image.service';
import { MetaService } from '@app/services/meta.service';

@Component({
  selector: 'app-ai-event-builder',
  imports: [NgOptimizedImage, ContentGeneratorComponent],
  templateUrl: './ai-event-builder.component.html',
  styleUrl: './ai-event-builder.component.scss'
})
export class AiEventBuilderComponent implements OnInit {
  private imageService = inject(ImageService);
  private aiImage: AppImageData = {
    id: "ai-background.png",
    cloudflareImageId: "46a4b01c-c275-4556-aec4-ec7be2e8d500",
    // cloudflareImageId: "a93ea8ab-b8cd-4d31-6832-163c8d097200",
    width: 1024,
    height: 1792
  };

  image = computed(() => {
    return this.imageService.resizeImage(this.aiImage, this.aiImage.width, this.aiImage.height);
  });

  private title = inject(Title);
  private meta = inject(MetaService);
  private router = inject(Router);

  ngOnInit(): void {
    this.title.setTitle('Next Japan AI');

    // Set meta tags
    const description = 'This page leverages advanced AI technology to help you design your ideal Japanese vacation event.';
    this.meta.updateTags(this.title.getTitle(), description);
  }

  onEventCreated() {
    this.router.navigate(['/dream/event']);
  }
}

