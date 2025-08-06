import { afterNextRender, inject, Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private storage = inject(StorageService);

  private showDialogSignal = signal<string>('');
  showDialog = this.showDialogSignal.asReadonly();

  constructor() {
    afterNextRender(() => {
      const savedStatus = this.storage.session.getItem('nextjp.status');
      if (!savedStatus) {
        this.storage.session.setItem('nextjp.status', '1');
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
