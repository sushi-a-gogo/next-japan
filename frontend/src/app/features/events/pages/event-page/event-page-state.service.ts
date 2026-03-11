import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { Router } from "@angular/router";
import { ErrorService } from "@app/core/services/error.service";
import { of, switchMap } from "rxjs";
import { EventPageService } from "./event-page.service";

@Injectable()
export class EventPageState {
  private eventPageService = inject(EventPageService);
  private errorService = inject(ErrorService);

  eventId = signal<string | null>(null);

  private eventData$ = toObservable(
    computed(() => this.eventId()) // triggers when eventId changes
  ).pipe(
    switchMap((id) => {
      if (!id) {
        return of(this.emptyState());
      }
      return this.eventPageService.loadEventData$(id);
    })
  );

  eventData = toSignal(this.eventData$, { initialValue: this.emptyState() });
  event = computed(() => this.eventData().event);
  location = computed(() => this.eventData().location);
  opportunities = computed(() => this.eventData().opportunities);
  tickets = computed(() => this.eventData().tickets);
  loaded = computed(() => !!this.eventData().event);

  constructor(router: Router) {
    effect(() => {
      const error = this.eventData().error;
      if (error) {
        this.errorService.sendError(new Error('The requested event was not found.'));
        router.navigate(['/not-found']);
      }
    });
  }

  private emptyState() {
    return {
      event: null,
      location: null,
      opportunities: [],
      tickets: [],
      error: null,
    };
  }
}
