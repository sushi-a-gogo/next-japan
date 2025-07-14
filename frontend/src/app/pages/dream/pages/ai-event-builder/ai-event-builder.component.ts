import { NgOptimizedImage } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatProgressBar } from "@angular/material/progress-bar";
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { NavigationStart, Router } from '@angular/router';
import { AppImageData } from '@app/models/app-image-data.model';
import { ContentGeneratorComponent } from "@app/pages/dream/pages/ai-event-builder/content-generator/content-generator.component";
import { ImageService } from '@app/services/image.service';
import { MetaService } from '@app/services/meta.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-ai-event-builder',
  imports: [NgOptimizedImage, ContentGeneratorComponent, MatProgressBar],
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
  busy = signal<boolean>(false);


  private title = inject(Title);
  private meta = inject(MetaService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.title.setTitle('Next Japan AI');

    // Set meta tags
    const description = 'This page leverages advanced AI technology to help you design your ideal Japanese vacation event.';
    this.meta.updateTags(this.title.getTitle(), description);

    this.router.events.pipe(
      filter((e) => e instanceof NavigationStart),
      takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.snackBar.dismiss());
  }

  onEventCreating() {
    this.busy.set(true);
  }

  onEventCreated() {
    this.router.navigate(['/dream/event']);
  }
}

