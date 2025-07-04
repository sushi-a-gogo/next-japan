import { animate, style, transition, trigger } from '@angular/animations';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { DreamHeaderComponent } from "@app/pages/dream/components/dream-banner/dream-header/dream-header.component";
import { AiEvent } from '@app/pages/event/models/ai-event.model';
import { ImageService } from '@app/services/image.service';
import { AiService } from '@app/services/open-ai.service';
import { LoadingSpinnerComponent } from '@app/shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-ai-event',
  imports: [RouterLink, LoadingSpinnerComponent, DreamHeaderComponent],
  templateUrl: './ai-event.component.html',
  styleUrl: './ai-event.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-in-out', style({ opacity: 1 }))
      ])
    ])
  ],
  host: { '[@fadeIn]': '' }
})
export class AiEventComponent {
  private router = inject(Router);
  private aiService = inject(AiService);
  private imageService = inject(ImageService);
  private destroyRef = inject(DestroyRef);

  busy = signal<boolean>(false);

  dreamEvent = this.aiService.aiEvent;
  savedEvent = signal<AiEvent | null>(null);


  backgroundImage = computed(() => {
    return `url('${this.dreamEvent()?.imageUrl}')`;
  });

  reset() {
    this.router.navigate(['../dream']);
  }

  saveEvent() {
    this.aiService.saveEvent$(this.dreamEvent()!).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res) => {
      console.log('Saved:', res.data);
      this.savedEvent.set(res.data); // Update with Cloudflare URL
    });

  }
}

