import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private errorMessageSignal = signal<string>('');
  errorMessage = this.errorMessageSignal.asReadonly();

  handleError(error: HttpErrorResponse, message = 'Something went wrong. Please try again later.', log = false) {
    if (log) {
      this.logError(
        error instanceof Error ? error : new Error(error.message)
      );
      this.errorMessageSignal.set(message)

    }
    return throwError(() => new Error(message));
  }

  logError(error: Error) {
    console.error(`** ERROR: ${error.message}`);
  }

  clearError() {
    this.errorMessageSignal.set('');
  }
}
