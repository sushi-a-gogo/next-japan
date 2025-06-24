import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  private showDialogSignal = signal<string>('about');
  showDialog = this.showDialogSignal.asReadonly();

  showAboutDialog() {
    this.showDialogSignal.set('about');
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
