import { Component, computed, DestroyRef, inject, input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { PageErrorComponent } from '@app/components/page-error/page-error.component';
import { EventService } from '@app/event/event.service';
import { AuthMockService } from '@app/services/auth-mock.service';
import { environment } from '@environments/environment';
import { forkJoin } from 'rxjs';
import { LoadingSpinnerComponent } from "../shared/loading-spinner/loading-spinner.component";
import { EventHeaderComponent } from "./components/event-header/event-header.component";
import { EventNavbarComponent } from "./components/event-navbar/event-navbar.component";
import { EventOpportunitiesComponent } from "./components/event-opportunities/event-opportunities.component";
import { EventOverviewComponent } from "./components/event-overview/event-overview.component";

@Component({
  selector: 'app-event-page',
  imports: [EventHeaderComponent, EventNavbarComponent, PageErrorComponent, EventOverviewComponent, EventOpportunitiesComponent, LoadingSpinnerComponent],
  templateUrl: './event-page.component.html',
  styleUrl: './event-page.component.scss'
})
export class EventPageComponent implements OnChanges {
  private auth = inject(AuthMockService);
  private eventService = inject(EventService);
  private destroyRef = inject(DestroyRef);
  private event = this.eventService.event;

  eventId = input.required<string>();

  isAuthenticated = this.auth.isAuthenticated;

  title = inject(Title);
  focusChild: string | null = null;
  loaded = signal<boolean>(false);
  hasError = signal<boolean>(false);

  backgroundImage = computed(() => this.event()?.imageId ?
    `url('${environment.apiUri}/${this.event()!.imageId}')` : `url('assets/images/event-banner-default.png')`
  );

  ngOnChanges(changes: SimpleChanges): void {
    const id = Number(this.eventId());
    this.loaded.set(false);
    forkJoin([this.eventService.getEvent$(id), this.eventService.getEventLocations$(id)])
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe(([event]) => {
        this.title.setTitle(event?.eventTitle || 'No event');
        this.hasError.set(!event);
        this.loaded.set(true);
      })
  }

  setFocusChild(child: string) {
    this.focusChild = child;
    setTimeout(() => {
      this.focusChild = null;
    }, 250);
  }

}
