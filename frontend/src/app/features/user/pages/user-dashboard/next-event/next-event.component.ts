import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EventRegistrationService } from '@app/features/events/services/event-registration.service';
import { EventsService } from '@app/features/events/services/events.service';
import { EventData } from '@features/events/models/event-data.model';
import { NextEventCardComponent } from "./next-event-card/next-event-card.component";

@Component({
  selector: 'app-next-event',
  imports: [NextEventCardComponent],
  templateUrl: './next-event.component.html',
  styleUrl: './next-event.component.scss'
})
export class NextEventComponent implements OnInit {
  private eventsService = inject(EventsService);
  private registrationService = inject(EventRegistrationService);
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
