import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, ElementRef, inject, input, OnChanges, OnInit, PLATFORM_ID, signal, SimpleChanges, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { NavigationStart, Router } from '@angular/router';
import { AuthService } from '@app/core/auth/auth.service';
import { ApiResponse } from '@app/core/models/api-response.model';
import { EventService } from '@app/features/events/pages/event-page/event.service';
import { EventRegistrationService } from '@app/features/events/services/event-registration.service';
import { EventSelectionService } from '@app/features/events/services/event-selection.service';
import { PageLoadSpinnerComponent } from "@app/shared/components/page-load-spinner/page-load-spinner.component";
import { DialogService } from '@core/services/dialog.service';
import { ErrorService } from '@core/services/error.service';
import { ImageService } from '@core/services/image.service';
import { MetaService } from '@core/services/meta.service';
import { EventRegistration } from '@features/events/models/event-registration.model';
import { filter, of, switchMap } from 'rxjs';
import { EventRegistrationDialogComponent } from "../../ui/event-registration-dialog/event-registration-dialog.component";
import { EventCoordinatorsComponent } from './components/event-coordinators/event-coordinators.component';
import { EventHeroComponent } from "./components/event-hero/event-hero.component";
import { EventMapComponent } from "./components/event-map/event-map.component";
import { EventOpportunitiesComponent } from "./components/event-opportunities/event-opportunities.component";

@Component({
  selector: 'app-event-page',
  imports: [EventCoordinatorsComponent,
    EventOpportunitiesComponent, EventRegistrationDialogComponent, EventHeroComponent, PageLoadSpinnerComponent, EventMapComponent],
  templateUrl: './event-page.component.html',
  styleUrl: './event-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class EventPageComponent implements OnInit, OnChanges {
  private router = inject(Router);
  private title = inject(Title);
  private meta = inject(MetaService);
  private platformId = inject(PLATFORM_ID);
  private destroyRef = inject(DestroyRef);

  private authService = inject(AuthService);
  private dialogService = inject(DialogService);
  private eventService = inject(EventService);
  private eventRegistrationService = inject(EventRegistrationService);
  private eventSelectionService = inject(EventSelectionService);
  private errorService = inject(ErrorService);
  private imageService = inject(ImageService);

  eventId = input.required<string>();
  event = computed(() => this.eventService.eventData().event);
  focusChild: string | null = null;
  loaded = signal<boolean>(false);

  showRegistrationDialog = computed(() => this.dialogService.showDialog() === 'registration');
  @ViewChild('opportunities') opportunities?: ElementRef;

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.eventSelectionService.clearSelected();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const changed = changes['eventId'];
    if (!changed) return;

    const id = this.eventId();
    this.loaded.set(false);

    this.getEventRegistrations$()
      .pipe(
        switchMap(() => this.eventService.loadEvent$(id)),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        next: (res) => {
          const event = res?.event;
          const eventTitle = event?.eventTitle || 'Event Not Found';
          const description = event?.description || 'Event Not Found';

          this.title.setTitle(eventTitle);
          this.meta.updateTags(eventTitle, description);

          if (event) {
            const resizedImage = this.imageService.resizeImage(event.image, 384, 256);
            this.meta.updateTag({ property: 'og:image', content: resizedImage.src });
            this.meta.updateTag({ property: 'og:image:width', content: '384' });
            this.meta.updateTag({ property: 'og:image:height', content: '256' });
          } else {
            this.errorService.sendError(new Error("The requested event was not found."));
            this.router.navigate(['./not-found']);
          }
        },
        error: (e) => {
          this.loaded.set(true);
          this.errorService.sendError(new Error('Error fetching requested event.'));
          this.router.navigate(['./not-found']);
        },
        complete: () => this.loaded.set(true)
      });
  }

  scrollToOpportunities() {
    this.opportunities?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  }

  closeRegistrationDialog() {
    this.dialogService.closeDialog('registration');
    this.eventSelectionService.clearSelected();
  }

  private getEventRegistrations$() {
    if (isPlatformBrowser(this.platformId)) {
      const userId = this.authService.user()?.userId;
      if (userId) {
        return this.eventRegistrationService.getUserEventRegistrations$(userId);
      }
    }

    const emptyResp: ApiResponse<EventRegistration[]> = { success: true, data: [] };
    return of(emptyResp);
  }

}
