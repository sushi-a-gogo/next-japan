import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ButtonComponent } from '@app/shared/components/button/button.component';
import { ImageService } from '@core/services/image.service';
import { EventData } from '@features/events/models/event-data.model';
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
  heroImages = computed(() => [...this.events().filter((e) => e.aiProvider !== 'Grok').map((e) => {
    const hero = this.imageService.resizeImage(e.image, e.image.width, e.image.height);
    return { ...hero, grokImage: e.aiProvider === 'Grok' };
  })]);

  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    interval(10000).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      const current = this.currentImageIndex();
      if (current === null) {
        const rndIndex = Math.floor(Math.random() * this.heroImages().length);
        this.currentImageIndex.set(rndIndex);
      } else {
        const nextIndex = (current + 1) % this.heroImages().length;
        this.currentImageIndex.set(nextIndex);
      }
    })
  }

  navigateToAboutPage() {
    this.router.navigate(['/about-this-project']);
  }
}
