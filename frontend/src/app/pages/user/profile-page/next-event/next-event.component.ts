import { Component, computed, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { EventData } from '@app/models/event/event-data.model';
import { EventRegistration } from '@app/models/event/event-registration.model';
import { User } from '@app/models/user.model';
import { EventRegistrationService } from '@app/services/event-registration.service';
import { EventsService } from '@app/services/events.service';
import { ImageService } from '@app/services/image.service';
import { OpportunityTimestampComponent } from "@app/shared/opportunity-timestamp/opportunity-timestamp.component";
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-next-event',
  imports: [MatCardModule, MatButtonModule, RouterLink, OpportunityTimestampComponent],
  templateUrl: './next-event.component.html',
  styleUrl: './next-event.component.scss'
})
export class NextEventComponent implements OnInit {
  private eventsService = inject(EventsService);
  private registrationService = inject(EventRegistrationService);
  private imageService = inject(ImageService);
  private destroyRef = inject(DestroyRef);

  user = input.required<User>();
  loaded = signal(false);
  suggestedEvent = signal<EventData | null>(null);

  event = computed(() => {
    const registrations = this.registrationService.userEventRegistrations();
    return registrations.length ? [...registrations].sort(this.sortByDate)[0] : null;
  });

  routerLink = computed(() => `/event/${this.event()?.opportunity.eventId}`);

  resizedImage = computed(() => {
    return this.event() ? this.imageService.resizeImage(this.event()!.image, 384, 256) : null;
  });

  suggestedEventImage = computed(() => {
    return this.suggestedEvent() ? this.imageService.resizeImage(this.suggestedEvent()!.image, 384, 256) : null;
  });

  ngOnInit(): void {

    this.registrationService.getUserEventRegistrations$(this.user().userId).pipe(
      switchMap((resp) => resp.data.length > 0 ? of([]) : this.eventsService.get$()),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((events) => {
      if (events.length) {
        const randomIndex = Math.floor(Math.random() * events.length);
        this.suggestedEvent.set(events[randomIndex]);
      }
      this.loaded.set(true);
    })
  }

  private sortByDate(a: EventRegistration, b: EventRegistration) {
    return new Date(a.opportunity.startDate).getTime() - new Date(b.opportunity.startDate).getTime();
  }

}
