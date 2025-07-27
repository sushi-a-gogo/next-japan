import { isPlatformBrowser } from '@angular/common';
import { Component, computed, DestroyRef, inject, input, OnChanges, PLATFORM_ID, signal, SimpleChanges } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { EventService } from '@app/pages/events/event-page/event.service';
import { DialogService } from '@app/services/dialog.service';
import { ErrorService } from '@app/services/error.service';
import { ImageService } from '@app/services/image.service';
import { MetaService } from '@app/services/meta.service';
import { LoadingSpinnerComponent } from '@app/shared/loading-spinner/loading-spinner.component';
import { EventBannerComponent } from "./components/event-banner/event-banner.component";
import { EventNavbarComponent } from "./components/event-navbar/event-navbar.component";
import { EventOpportunitiesComponent } from "./components/event-opportunities/event-opportunities.component";
import { EventOverviewComponent } from "./components/event-overview/event-overview.component";
import { OpportunityRequestFooterComponent } from "./components/opportunity-request-footer/opportunity-request-footer.component";
import { RegistrationDialogComponent } from "./components/registration-dialog/registration-dialog.component";

@Component({
  selector: 'app-event-page',
  imports: [EventNavbarComponent, EventOverviewComponent,
    EventOpportunitiesComponent, LoadingSpinnerComponent, RegistrationDialogComponent, OpportunityRequestFooterComponent, EventBannerComponent],
  templateUrl: './event-page.component.html',
  styleUrl: './event-page.component.scss'
})
export class EventPageComponent implements OnChanges {
  private router = inject(Router);
  private title = inject(Title);
  private meta = inject(MetaService);
  private platformId = inject(PLATFORM_ID);
  private destroyRef = inject(DestroyRef);

  private dialogService = inject(DialogService);
  private eventService = inject(EventService);
  private errorService = inject(ErrorService);
  private imageService = inject(ImageService);

  eventId = input.required<string>();
  focusChild: string | null = null;
  loaded = signal<boolean>(false);

  backgroundImage = computed(() => {
    const event = this.eventService.eventData().event;
    if (event && isPlatformBrowser(this.platformId)) {
      const resizedImage = this.imageService.resizeImage(event!.image, 384, 256);
      return `url('${resizedImage.src}')`;
    }
    return undefined;
  });

  showRegistrationDialog = computed(() => this.dialogService.showDialog() === 'registration');

  ngOnChanges(changes: SimpleChanges): void {
    const changed = changes['eventId'];
    if (!changed) return;

    const id = this.eventId();
    this.loaded.set(false);

    this.eventService.loadEvent$(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        next: (res) => {
          const event = res?.event;
          const eventTitle = event?.eventTitle || 'Event Not Found';
          const description = event?.description || 'Event Not Found';

          this.title.setTitle(eventTitle);
          this.meta.updateTags(eventTitle, description);

          if (!event) {
            this.errorService.sendError(new Error("The requested event was not found."));
            this.router.navigate(['./not-found']);
          } else {
            this.loaded.set(true);
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
  }

}
