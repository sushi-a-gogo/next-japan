import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { EventData } from '@app/models/event/event-data.model';
import { EventRegistrationService } from '@app/services/event-registration.service';
import { EventsService } from '@app/services/events.service';
import { ImageService } from '@app/services/image.service';
import { LikeButtonComponent } from "@app/shared/like-button/like-button.component";
import { ShareButtonComponent } from "@app/shared/share-button/share-button.component";

@Component({
  selector: 'app-next-event',
  imports: [MatCardModule, MatButtonModule, RouterLink, LikeButtonComponent, ShareButtonComponent],
  templateUrl: './next-event.component.html',
  styleUrl: './next-event.component.scss'
})
export class NextEventComponent implements OnInit {
  private eventsService = inject(EventsService);
  private registrationService = inject(EventRegistrationService);
  private imageService = inject(ImageService);
  private destroyRef = inject(DestroyRef);

  suggestedEvent = signal<EventData | null>(null);
  suggestedRouterLink = computed(() => `/event/${this.suggestedEvent()?.eventId}`);

  suggestedEventImage = computed(() => {
    return this.suggestedEvent() ? this.imageService.resizeImage(this.suggestedEvent()!.image, 384, 256) : null;
  });

  ngOnInit(): void {
    this.eventsService.get$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((events) => {
      const registrations = this.registrationService.userEventRegistrations();
      const registeredIds = registrations.map((r) => r.opportunity.eventId);
      const unregisteredEvents = events.filter((e) => !registeredIds.includes(e.eventId));
      const randomIndex = Math.floor(Math.random() * unregisteredEvents.length);
      const suggestion = randomIndex >= 0 ? unregisteredEvents[randomIndex] : null;
      this.suggestedEvent.set(suggestion);
    });
  }
}
