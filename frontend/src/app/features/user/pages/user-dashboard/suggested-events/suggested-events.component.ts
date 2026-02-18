import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EventData } from '@app/features/events/models/event-data.model';
import { EventsService } from '@app/features/events/services/events.service';
import { RegistrationService } from '@app/features/registrations/services/registration.service';
import { SuggestedEventCardComponent } from "./suggested-event-card/suggested-event-card.component";

@Component({
  selector: 'app-suggested-events',
  imports: [SuggestedEventCardComponent],
  templateUrl: './suggested-events.component.html',
  styleUrl: './suggested-events.component.scss'
})
export class SuggestedEventsComponent implements OnInit {
  private eventsService = inject(EventsService);
  private registrationService = inject(RegistrationService);
  private destroyRef = inject(DestroyRef);

  suggestedEvents = signal<EventData[]>([]);

  ngOnInit(): void {
    this.eventsService.get$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((events) => {
      const registrations = this.registrationService.userEventRegistrations();
      const registeredIds = registrations.map((r) => r.opportunity.eventId);
      const unregisteredEvents = events.filter((e) => !registeredIds.includes(e.eventId));
      const suggestedEvents = new Set<EventData>();
      while (suggestedEvents.size < 2 && unregisteredEvents.length > suggestedEvents.size) {
        const index = Math.floor(Math.random() * unregisteredEvents.length);
        suggestedEvents.add(unregisteredEvents[index]);
      }
      this.suggestedEvents.set(Array.from(suggestedEvents));
    });
  }
}
