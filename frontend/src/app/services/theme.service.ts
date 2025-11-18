import { isPlatformBrowser } from '@angular/common';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private currentMode = signal<'light' | 'dark' | 'device'>('device');

  selectedTheme = computed(() => {
    if (isPlatformBrowser(this.platformId)) {
      const theme = this.currentMode() === 'dark' || (this.currentMode() === 'device' && this.preferDarkTheme()) ? 'dark' : 'light';
      return theme;
    }

    return 'device';
  });

  setAppearanceMode(theme?: 'light' | 'dark') {
    this.currentMode.set(theme || 'device');
    this.manageTheme();
  }

  manageTheme() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.selectedTheme() === 'dark') {
        document?.body?.classList.add('dark-theme');
      } else {
        document?.body?.classList.remove('dark-theme');
      }
    }
  }

  private preferDarkTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
}
