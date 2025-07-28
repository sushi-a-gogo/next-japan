import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor() { }

  setAppearanceMode(theme?: 'light' | 'dark') {
    const useDarkTheme = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (useDarkTheme) {
      document?.body?.classList.add('dark-theme');
    } else {
      document?.body?.classList.remove('dark-theme');
    }
  }
}
