import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '@app/core/auth/auth.service';
import { EventLocation } from '@app/features/events/models/event-location.model';
import { EventLocationCard } from '@app/features/events/ui/event-location-card/event-location-card.component';
import { EventOpportunityCardComponent } from "@app/features/events/ui/event-opportunity-card/event-opportunity-card.component";
import { RegistrationSelectionService } from '@app/features/registrations/services/registration-selection.service';
import { RegistrationService } from '@app/features/registrations/services/registration.service';
import { AnchorComponent } from '@app/shared/ui/anchor/anchor.component';
import { ButtonComponent } from '@app/shared/ui/button/button.component';
import { LoadingSpinnerComponent } from "@app/shared/ui/loading-spinner/loading-spinner.component";
import { ModalComponent } from "@app/shared/ui/modal/modal.component";
import { delay, finalize } from 'rxjs';


@Component({
  selector: 'app-request-registration-dialog',
  imports: [MatButtonModule, ModalComponent, ButtonComponent, AnchorComponent, LoadingSpinnerComponent, EventLocationCard, EventOpportunityCardComponent],
  templateUrl: './request-registration-dialog.component.html',
  styleUrl: './request-registration-dialog.component.scss',
})
export class RequestRegistrationDialogComponent {
  private authService = inject(AuthService);
  private registrationService = inject(RegistrationService);
  private selectionService = inject(RegistrationSelectionService);
  private destroyRef = inject(DestroyRef);

  location = input<EventLocation | null>(null)
  opportunity = this.selectionService.selectedOpportunity;
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
          this.completed.set(true);
        },
        error: (e) => {
          console.error(e);
        }
      })
  }

  closeDialog() {
    this.completed.set(false);
    this.selectionService.clearSelectedOpportunity();
  }

  private requestSelected$() {
    const userId = this.authService.user()!.userId;
    return this.registrationService.registerUserToOpportunity$(userId, this.opportunity()!.opportunityId);
  }
}
