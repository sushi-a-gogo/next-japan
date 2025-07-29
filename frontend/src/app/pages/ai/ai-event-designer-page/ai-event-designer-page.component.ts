import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgOptimizedImage } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatProgressBar } from "@angular/material/progress-bar";
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { NavigationStart, Router } from '@angular/router';
import { AppImageData } from '@app/models/app-image-data.model';
import { ContentGeneratorComponent } from "@app/pages/ai/ai-event-designer-page/content-generator/content-generator.component";
import { ImageService } from '@app/services/image.service';
import { MetaService } from '@app/services/meta.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-ai-event-designer-page',
  imports: [NgOptimizedImage, ContentGeneratorComponent, MatProgressBar],
  templateUrl: './ai-event-designer-page.component.html',
  styleUrl: './ai-event-designer-page.component.scss',
  animations: [
    trigger('fadeSlideIn', [
      state('void', style({
        opacity: 0.25,
        filter: 'blur(2px)',
        transform: 'translateY(50px)'
      })),
      state('in', style({
        opacity: 1,
        filter: 'blur(0)',
        transform: 'translateY(0)'
      })),
      transition('void => in', [
        animate('400ms ease-out')
      ])
    ])
  ],
  host: { '[@fadeSlideIn]': 'in' }

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

  onEventCreated() {
    this.router.navigate(['/ai/event']);
  }
}

