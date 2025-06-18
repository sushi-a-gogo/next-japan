import { Component, effect, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorService } from '@app/services/error.service';

@Component({
  selector: 'app-error-bar',
  imports: [],
  templateUrl: './error-bar.component.html',
  styleUrl: './error-bar.component.scss'
})
export class ErrorBarComponent {
  private snackBar = inject(MatSnackBar);
  private errorService = inject(ErrorService);

  constructor() {
    effect(() => {
      if (this.errorService.errorMessage()) {
        this.openSnackBar(this.errorService.errorMessage());
      }
    });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 10000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    }).afterDismissed().subscribe(() => this.errorService.clearError());
  }

}
