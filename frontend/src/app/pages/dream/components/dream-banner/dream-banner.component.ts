import { animate, style, transition, trigger } from '@angular/animations';
import { Component, computed, DestroyRef, inject, input, signal } from '@angular/core';
import { AiEvent } from '@app/pages/event/models/ai-event.model';
import { AiService } from '@app/services/ai.service';
import { ImageService } from '@app/services/image.service';
import { LoadingSpinnerComponent } from '@app/shared/loading-spinner/loading-spinner.component';
import { DreamHeaderComponent } from "./dream-header/dream-header.component";

@Component({
  selector: 'app-dream-banner',
  imports: [LoadingSpinnerComponent, DreamHeaderComponent],
  templateUrl: './dream-banner.component.html',
  styleUrl: './dream-banner.component.scss',
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
export class DreamBannerComponent {
  private aiService = inject(AiService);
  private imageService = inject(ImageService);
  private destroyRef = inject(DestroyRef);

  busy = signal<boolean>(false);

  dreamEvent = input.required<AiEvent>()
  savedEvent = signal<AiEvent | null>(null);


  backgroundImage = computed(() => {
    const resizedImage = this.imageService.resizeImage(this.dreamEvent()!.image, 384, 256);
    return `url('${resizedImage.src}')`;
  });

  reset() {
    //this.dreamEvent.set(null);
  }
}
