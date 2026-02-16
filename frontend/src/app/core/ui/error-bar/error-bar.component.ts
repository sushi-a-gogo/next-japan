import { isPlatformBrowser } from '@angular/common';
import { Component, effect, inject, PLATFORM_ID } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorService } from '@app/core/services/error.service';

@Component({
  selector: 'app-error-bar',
  imports: [],
  templateUrl: './error-bar.component.html',
  styleUrl: './error-bar.component.scss'
})
export class ErrorBarComponent {
  private platformId = inject(PLATFORM_ID);
  private snackBar = inject(MatSnackBar);
  private errorService = inject(ErrorService);

  constructor() {
    effect(() => {
      if (isPlatformBrowser(this.platformId) && this.errorService.errorMessage()) {
        this.openSnackBar(this.errorService.errorMessage());
      }
    });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 8000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: 'error-bar'
    }).afterDismissed().subscribe(() => {
      this.errorService.clearError();
    });
  }

}
