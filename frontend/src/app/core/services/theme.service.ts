import { isPlatformBrowser } from '@angular/common';
import { effect, inject, Injectable, isDevMode, PLATFORM_ID, signal } from '@angular/core';
import { AuthService } from '@app/core/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private appearance = signal<'light' | 'dark' | 'device'>('device');
  private darkMode = signal(false);
  private auth = inject(AuthService);

  inDarkMode = this.darkMode.asReadonly();

  private userChangeEffect = effect(() => {
    const user = this.auth.user();
    this.setAppearance(user?.mode);
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
        this.darkMode.set(true);
      } else {
        document?.body?.classList.remove('dark-theme');
        this.darkMode.set(false);
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
