import { afterNextRender, inject, Injectable, signal } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private auth = inject(AuthService);

  private showDialogSignal = signal<string>('');
  showDialog = this.showDialogSignal.asReadonly();

  constructor() {
    afterNextRender(() => {
      if (!this.auth.token) {
        this.showDialogSignal.set('about');
      }
    });
  }

  showProfileDialog() {
    this.showDialogSignal.set('profile');
  }

  showRegistrationDialog() {
    this.showDialogSignal.set('registration');
  }

  closeDialog(key: string) {
    if (this.showDialogSignal() === key) {
      this.showDialogSignal.set('');
    }
  }
}
