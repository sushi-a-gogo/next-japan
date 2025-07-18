import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private errorMessageSignal = signal<string>('');
  errorMessage = this.errorMessageSignal.asReadonly();

  simulateError$<T>() {
    return new Observable<T>((observer) => {
      setTimeout(() => {
        observer.error(new Error('This is a simulated error!'));
      }, 1000);
    });
  }

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

  sendError(error: Error) {
    this.errorMessageSignal.set(error.message || 'Unknown Error');
  }
}
