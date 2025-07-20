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
      const savedUser = this.storage.session.getItem('nextjp');
      if (!savedUser) {
        this.storage.session.setItem('nextjp', '1');
        this.showDialogSignal.set('about');
      }
    });
  }

  showProfileDialog() {
    this.showDialogSignal.set('profile');
  }

  showEventsDialog() {
    this.showDialogSignal.set('events');
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
