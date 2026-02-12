import { Component, computed, DestroyRef, inject, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { ApiResponse } from '@app/models/api-response.model';
import { EventRegistration } from '@app/models/event/event-registration.model';
import { EventService } from '@app/pages/events/event-page/event.service';
import { AuthService } from '@app/services/auth.service';
import { EventRegistrationService } from '@app/services/event-registration.service';
import { EventSelectionService } from '@app/services/event-selection.service';
import { AddressStripComponent } from '@app/shared/address-strip/address-strip.component';
import { AnchorComponent } from '@app/shared/anchor/anchor.component';
import { ButtonComponent } from '@app/shared/button/button.component';
import { LoadingSpinnerComponent } from "@app/shared/loading-spinner/loading-spinner.component";
import { ModalComponent } from "@app/shared/modal/modal.component";
import { OpportunityTimestampComponent } from "@app/shared/opportunity-timestamp/opportunity-timestamp.component";
import { delay, finalize, of } from 'rxjs';


@Component({
  selector: 'app-registration-dialog',
  imports: [MatButtonModule, ModalComponent, ButtonComponent, AnchorComponent, LoadingSpinnerComponent, AddressStripComponent, OpportunityTimestampComponent],
  templateUrl: './registration-dialog.component.html',
  styleUrl: './registration-dialog.component.scss'
})
export class RegistrationDialogComponent {
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
