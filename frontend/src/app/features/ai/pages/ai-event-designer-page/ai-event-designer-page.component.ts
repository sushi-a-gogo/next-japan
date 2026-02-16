import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatProgressBar } from "@angular/material/progress-bar";
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { NavigationStart, Router } from '@angular/router';
import { AppImageData } from '@app/core/models/app-image-data.model';
import { ImageService } from '@app/core/services/image.service';
import { MetaService } from '@app/core/services/meta.service';
import { AiEvent } from '@app/features/ai/models/ai-event.model';
import { ContentGeneratorComponent } from "@app/features/ai/pages/ai-event-designer-page/content-generator/content-generator.component";
import { filter } from 'rxjs';

@Component({
  selector: 'app-ai-event-designer-page',
  imports: [NgOptimizedImage, ContentGeneratorComponent, MatProgressBar],
  templateUrl: './ai-event-designer-page.component.html',
  styleUrl: './ai-event-designer-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiEventDesignerPageComponent implements OnInit {
  private imageService = inject(ImageService);
  private aiImage: AppImageData = {
    id: "ai-background.png",
    cloudflareImageId: "fe93cd16-79b0-411a-3584-4a52953f3d00",
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

  onEventCreated(event: AiEvent | null) {
    if (event) {
      this.router.navigate(['/ai/event']);
    } else {
      this.busy.set(false);
    }
  }
}

