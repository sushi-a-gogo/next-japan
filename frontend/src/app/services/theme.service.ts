import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentMode = signal<'light' | 'dark' | 'device'>('device');
  private platformId = inject(PLATFORM_ID);

  setAppearanceMode(theme?: 'light' | 'dark') {
    this.currentMode.set(theme || 'device');
    this.manageTheme();
  }

  manageTheme() {
    const useDarkTheme = this.currentMode() === 'dark' || (this.currentMode() === 'device' && this.isDeviceSetToDarkTheme());
    if (useDarkTheme) {
      document?.body?.classList.add('dark-theme');
    } else {
      document?.body?.classList.remove('dark-theme');
    }
  }

  private isDeviceSetToDarkTheme() {
    if (isPlatformBrowser(this.platformId)) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false;
  }
}
