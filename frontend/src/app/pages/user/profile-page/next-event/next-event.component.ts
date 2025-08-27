import { Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { EventData } from '@app/models/event/event-data.model';
import { EventRegistration } from '@app/models/event/event-registration.model';
import { ImageService } from '@app/services/image.service';
import { OpportunityTimestampComponent } from "@app/shared/opportunity-timestamp/opportunity-timestamp.component";

@Component({
  selector: 'app-next-event',
  imports: [MatCardModule, MatButtonModule, RouterLink, OpportunityTimestampComponent],
  templateUrl: './next-event.component.html',
  styleUrl: './next-event.component.scss'
})
export class NextEventComponent {
  private imageService = inject(ImageService);

  nextEvent = input<EventRegistration>();
  suggestedEvent = input<EventData>();

  nextRouterLink = computed(() => `/event/${this.nextEvent()?.opportunity.eventId}`);
  suggestedRouterLink = computed(() => `/event/${this.suggestedEvent()?.eventId}`);

  resizedImage = computed(() => {
    return this.nextEvent() ? this.imageService.resizeImage(this.nextEvent()!.image, 384, 256) : null;
  });

  suggestedEventImage = computed(() => {
    return this.suggestedEvent() ? this.imageService.resizeImage(this.suggestedEvent()!.image, 384, 256) : null;
  });
}
