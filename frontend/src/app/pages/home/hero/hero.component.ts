import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { EventData } from '@app/models/event/event-data.model';
import { ImageService } from '@app/services/image.service';
import { ButtonComponent } from '@app/shared/button/button.component';
import { interval } from 'rxjs';
import organization from 'src/lib/organization-data';

@Component({
  selector: 'app-hero',
  imports: [NgOptimizedImage, ButtonComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.fade-in-animate]': 'true' }
})
export class HeroComponent implements OnInit {
  private router = inject(Router);
  private imageService = inject(ImageService);

  org = organization;
  hero = this.imageService.resizeImage(this.org.image, this.org.image.width, this.org.image.height)
  events = input<EventData[]>([]);

  currentImageIndex = signal<number | null>(null);
  heroImages = computed(() => [...this.events().map((e) => {
    const hero = this.imageService.resizeImage(e.image, e.image.width, e.image.height);
    return { ...hero, grokImage: e.aiProvider === 'Grok' };
  })]);

  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    interval(10000).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      const current = this.currentImageIndex();
      if (current === null) {
        const rndIndex = Math.floor(Math.random() * this.events().length);
        this.currentImageIndex.set(rndIndex);
      } else {
        const nextIndex = (current + 1) % this.events().length;
        this.currentImageIndex.set(nextIndex);
      }
    })
  }

  navigateToAboutPage() {
    this.router.navigate(['/about-this-project']);
  }
}
