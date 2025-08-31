import { Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { EventData } from '@app/models/event/event-data.model';
import { ImageService } from '@app/services/image.service';
import { LikeButtonComponent } from "@app/shared/like-button/like-button.component";
import { ShareButtonComponent } from "@app/shared/share-button/share-button.component";

@Component({
  selector: 'app-next-event',
  imports: [MatCardModule, MatButtonModule, RouterLink, LikeButtonComponent, ShareButtonComponent],
  templateUrl: './next-event.component.html',
  styleUrl: './next-event.component.scss'
})
export class NextEventComponent {
  private imageService = inject(ImageService);

  suggestedEvent = input.required<EventData>();
  suggestedRouterLink = computed(() => `/event/${this.suggestedEvent()?.eventId}`);

  suggestedEventImage = computed(() => {
    return this.suggestedEvent() ? this.imageService.resizeImage(this.suggestedEvent()!.image, 384, 256) : null;
  });
}
