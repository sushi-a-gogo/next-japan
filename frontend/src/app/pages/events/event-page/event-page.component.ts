import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, OnChanges, OnInit, PLATFORM_ID, signal, SimpleChanges } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { NavigationStart, Router } from '@angular/router';
import { ApiResponse } from '@app/models/api-response.model';
import { EventRegistration } from '@app/models/event/event-registration.model';
import { EventService } from '@app/pages/events/event-page/event.service';
import { AuthMockService } from '@app/services/auth-mock.service';
import { DialogService } from '@app/services/dialog.service';
import { ErrorService } from '@app/services/error.service';
import { EventRegistrationService } from '@app/services/event-registration.service';
import { EventSelectionService } from '@app/services/event-selection.service';
import { ImageService } from '@app/services/image.service';
import { MetaService } from '@app/services/meta.service';
import { PageLoadSpinnerComponent } from "@app/shared/page-load-spinner/page-load-spinner.component";
import { filter, of, switchMap } from 'rxjs';
import { EventHeroComponent } from "./components/event-hero/event-hero.component";
import { EventNavbarComponent } from "./components/event-navbar/event-navbar.component";
import { EventOpportunitiesComponent } from "./components/event-opportunities/event-opportunities.component";
import { EventOverviewComponent } from "./components/event-overview/event-overview.component";
import { RegistrationDialogComponent } from "./components/registration-dialog/registration-dialog.component";

@Component({
  selector: 'app-event-page',
  imports: [EventNavbarComponent, EventOverviewComponent,
    EventOpportunitiesComponent, RegistrationDialogComponent, EventHeroComponent, PageLoadSpinnerComponent],
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

  private authService = inject(AuthMockService);
  private dialogService = inject(DialogService);
  private eventService = inject(EventService);
  private eventRegistrationService = inject(EventRegistrationService);
  private eventSelectionService = inject(EventSelectionService);
  private errorService = inject(ErrorService);
  private imageService = inject(ImageService);

  eventId = input.required<string>();
  focusChild: string | null = null;
  loaded = signal<boolean>(false);

  // heroImage = computed(() => {
  //   const event = this.eventService.eventData().event;
  //   if (event && isPlatformBrowser(this.platformId)) {
  //     const resizedImage = this.imageService.resizeImage(event!.image, 384, 256);
  //     return resizedImage.src;
  //   }
  //   return undefined;
  // });

  showRegistrationDialog = computed(() => this.dialogService.showDialog() === 'registration');

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
          const resizedImage = this.imageService.resizeImage(event.image, 384, 256);
          this.meta.updateTag({ property: 'og:image', content: resizedImage.src });
          this.meta.updateTag({ property: 'og:image:width', content: '384' });
          this.meta.updateTag({ property: 'og:image:height', content: '256' });

          if (!event) {
            this.errorService.sendError(new Error("The requested event was not found."));
            this.router.navigate(['./not-found']);
          }
        },
        error: (e) => {
          this.errorService.sendError(new Error('Error fetching requested event.'));
          this.router.navigate(['./not-found']);
        },
        complete: () => this.loaded.set(true)
      });
  }

  setFocusChild(child: string) {
    this.focusChild = child;
    setTimeout(() => {
      this.focusChild = null;
    }, 250);
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

    const emptyResp: ApiResponse<EventRegistration[]> = { data: [] };
    return of(emptyResp);
  }

}
