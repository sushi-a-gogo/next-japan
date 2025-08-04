import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private currentMode = signal<'light' | 'dark' | 'device'>('device');

  constructor() { }

  setAppearanceMode(theme?: 'light' | 'dark') {
    this.currentMode.set(theme || 'device');
    this.manageTheme();
  }

  manageTheme() {
    const useDarkTheme = this.currentMode() === 'dark' || (this.currentMode() === 'device' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (useDarkTheme) {
      document?.body?.classList.add('dark-theme');
    } else {
      document?.body?.classList.remove('dark-theme');
    }
  }
}
