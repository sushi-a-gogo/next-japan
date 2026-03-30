import { Component, computed, DestroyRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from "@angular/router";
import { AuthService } from '@app/core/auth/auth.service';
import { DialogService } from '@app/core/services/dialog.service';
import { RegistrationRequestTicket } from '@app/features/registrations/models/registration-request-ticket.model';
import { RegistrationService } from '@app/features/registrations/services/registration.service';
import { RegistrationCardComponent } from "@app/features/registrations/ui/registration-card/registration-card.component";
import { LoadingSpinnerComponent } from "@app/shared/ui/loading-spinner/loading-spinner.component";
import { NextButtonComponent } from "@app/shared/ui/next-button/next-button.component";
import { delay, finalize } from 'rxjs';


@Component({
  selector: 'app-registration-request-dialog',
  imports: [MatButtonModule, LoadingSpinnerComponent, RegistrationCardComponent, NextButtonComponent, RouterLink],
  templateUrl: './registration-request-dialog.component.html',
  styleUrl: './registration-request-dialog.component.scss',
})
export class RegistrationRequestDialogComponent {
  private authService = inject(AuthService);
  private dialogService = inject(DialogService);
  private registrationService = inject(RegistrationService);
  private destroyRef = inject(DestroyRef);

  data = input<RegistrationRequestTicket>();

  registrationRequest = computed(() => this.data());// this.selectionService.registrationRequest());
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
    this.dialogService.closeDialog();
  }

  private requestSelected$() {
    const userId = this.authService.user()!.userId;
    return this.registrationService.registerUserToOpportunity$(userId, this.registrationRequest()!.opportunity.opportunityId);
  }
}
