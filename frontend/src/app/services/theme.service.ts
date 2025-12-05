import { isPlatformBrowser } from '@angular/common';
import { computed, inject, Injectable, isDevMode, PLATFORM_ID, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private appearance = signal<'light' | 'dark' | 'device'>('device');

  isDarkAppearance = computed(() => {
    const currentAppearance = this.appearance();
    return this.isDarkModeActivated(currentAppearance);
  });

  setAppearance(theme?: 'light' | 'dark') {
    this.appearance.set(theme || 'device');
    this.manageAppearance();
  }

  manageAppearance() {
    const currentAppearance = this.appearance();
    if (isDevMode()) {
      console.log(`theme.service -> manageAppearance -> currentAppearance = '${currentAppearance}'`);
    }

    if (isPlatformBrowser(this.platformId)) {
      if (this.isDarkModeActivated(currentAppearance)) {
        document?.body?.classList.add('dark-theme');
      } else {
        document?.body?.classList.remove('dark-theme');
      }
    }
  }

  private isDarkModeActivated(currentAppearance: string) {
    if (currentAppearance === 'dark') {
      return true;
    }

    if (currentAppearance === 'device' && isPlatformBrowser(this.platformId)) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      return mediaQuery.matches
    }

    return false;;
  }
}
