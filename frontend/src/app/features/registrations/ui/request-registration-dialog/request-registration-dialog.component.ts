import { Component, computed, DestroyRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '@app/core/auth/auth.service';
import { DialogService } from '@app/core/services/dialog.service';
import { RegistrationRequestTicket } from '@app/features/registrations/models/registration-request-ticket.model';
import { RegistrationService } from '@app/features/registrations/services/registration.service';
import { RegistrationCardComponent } from "@app/features/registrations/ui/registration-card/registration-card.component";
import { AnchorComponent } from '@app/shared/ui/anchor/anchor.component';
import { ButtonComponent } from '@app/shared/ui/button/button.component';
import { LoadingSpinnerComponent } from "@app/shared/ui/loading-spinner/loading-spinner.component";
import { delay, finalize } from 'rxjs';


@Component({
  selector: 'app-request-registration-dialog',
  imports: [MatButtonModule, ButtonComponent, AnchorComponent, LoadingSpinnerComponent, RegistrationCardComponent],
  templateUrl: './request-registration-dialog.component.html',
  styleUrl: './request-registration-dialog.component.scss',
})
export class RequestRegistrationDialogComponent {
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
