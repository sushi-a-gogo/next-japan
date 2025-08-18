import { afterNextRender, inject, Injectable, signal } from '@angular/core';
import { LOCAL_STORAGE_STATUS_KEY, LOCAL_STORAGE_USER_KEY, StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private storage = inject(StorageService);

  private showDialogSignal = signal<string>('');
  showDialog = this.showDialogSignal.asReadonly();

  constructor() {
    afterNextRender(() => {
      const savedStatus = this.storage.local.getItem(LOCAL_STORAGE_STATUS_KEY) || this.storage.local.getItem(LOCAL_STORAGE_USER_KEY);
      if (!savedStatus) {
        this.storage.local.setItem(LOCAL_STORAGE_STATUS_KEY, '1');
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
