import { Component, computed, DestroyRef, inject, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '@app/core/auth/auth.service';
import { ApiResponse } from '@app/core/models/api-response.model';
import { EventRegistration } from '@app/features/events/models/event-registration.model';
import { EventService } from '@app/features/events/pages/event-page/event.service';
import { EventRegistrationService } from '@app/features/events/services/event-registration.service';
import { EventSelectionService } from '@app/features/events/services/event-selection.service';
import { EventLocationCard } from '@app/features/events/ui/event-location-card/event-location-card.component';
import { EventOpportunityCardComponent } from "@app/features/events/ui/event-opportunity-card/event-opportunity-card.component";
import { AnchorComponent } from '@app/shared/components/anchor/anchor.component';
import { ButtonComponent } from '@app/shared/components/button/button.component';
import { LoadingSpinnerComponent } from "@app/shared/components/loading-spinner/loading-spinner.component";
import { ModalComponent } from "@app/shared/components/modal/modal.component";
import { delay, finalize, of } from 'rxjs';


@Component({
  selector: 'app-event-registration-dialog',
  imports: [MatButtonModule, ModalComponent, ButtonComponent, AnchorComponent, LoadingSpinnerComponent, EventLocationCard, EventOpportunityCardComponent],
  templateUrl: './event-registration-dialog.component.html',
  styleUrl: './event-registration-dialog.component.scss'
})
export class EventRegistrationDialogComponent {
  private authService = inject(AuthService);
  private eventService = inject(EventService);
  private registrationService = inject(EventRegistrationService);
  private selectionService = inject(EventSelectionService);
  private destroyRef = inject(DestroyRef);

  close = output<boolean>();

  opportunity = this.selectionService.selectedOpportunity;
  location = computed(() => this.eventService.eventData().location);
  busy = signal<boolean>(false);
  completed = signal<boolean>(false);

  sendRequest() {
    this.busy.set(true);
    this.requestSelected$()
      .pipe(
        delay(500),
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.busy.set(false))
      ).subscribe({
        next: (res) => {
          this.selectionService.clearSelected();
          this.completed.set(true);
        },
        error: (e) => {
          console.error(e);
        }
      })
  }

  closeDialog() {
    this.close.emit(true);
  }

  private requestSelected$() {
    const event = this.eventService.eventData().event;
    if (!event) {
      const emptyResp: ApiResponse<EventRegistration[]> = { success: true, data: [] };
      return of(emptyResp);
    }

    const userId = this.authService.user()!.userId;
    return this.registrationService.requestOpportunity$(userId, this.opportunity()!.opportunityId);
  }
}
